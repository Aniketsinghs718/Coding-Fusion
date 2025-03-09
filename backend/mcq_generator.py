import torch
import nltk
import pke
import random
import spacy
import numpy as np
from flashtext import KeywordProcessor
from transformers import T5ForConditionalGeneration, T5Tokenizer
from sense2vec import Sense2Vec
from sentence_transformers import SentenceTransformer
from similarity.normalized_levenshtein import NormalizedLevenshtein
from nltk.corpus import wordnet, stopwords
import pdfplumber
import re
import os

# Download required nltk datasets
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('stopwords', quiet=True)

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file using pdfplumber"""
    full_text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
        return full_text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def chunk_text(text, chunk_size=2000, overlap=200):
    """Split text into chunks with overlap for better context preservation"""
    words = text.split()
    chunks = []
    
    if len(words) <= chunk_size:
        return [text]
    
    i = 0
    while i < len(words):
        chunk = ' '.join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap

    return chunks

class MCQGenerator:
    def __init__(self, use_gpu=True):
        self.device = torch.device("cuda" if torch.cuda.is_available() and use_gpu else "cpu")
        print(f"Using device: {self.device}")
        self._load_models()
        self.stop_words = set(stopwords.words('english'))
        try:
            self.nlp = spacy.load('en_core_web_sm')
        except:
            print("Downloading spaCy model...")
            import os
            os.system("python -m spacy download en_core_web_sm")
            self.nlp = spacy.load('en_core_web_sm')

    def _load_models(self):
        # Load T5 models for summarization, question generation, and explanation
        print("Loading models...")
        self.summary_model = T5ForConditionalGeneration.from_pretrained('models/t5-base').to(self.device)
        self.question_model = T5ForConditionalGeneration.from_pretrained('models/t5_squad_v1').to(self.device)
        self.explanation_model = T5ForConditionalGeneration.from_pretrained('models/t5-base').to(self.device)

        # Load tokenizers
        self.summary_tokenizer = T5Tokenizer.from_pretrained('models/t5-base')
        self.question_tokenizer = T5Tokenizer.from_pretrained('models/t5_squad_v1')
        self.explanation_tokenizer = T5Tokenizer.from_pretrained('models/t5-base')

        # Load sentence transformer for better keyword ranking and distractor filtering
        self.sentence_model = SentenceTransformer('models/msmarco-distilbert-base-v3')

        # Load Sense2Vec for distractor generation
        self.s2v = Sense2Vec().from_disk('models/s2v_old')

        # Initialize Levenshtein similarity for option filtering
        self.normalized_levenshtein = NormalizedLevenshtein()
        print("Models loaded successfully.")

    def generate_summary(self, text):
        input_text = "summarize: " + text
        inputs = self.summary_tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True).to(self.device)
        summary_ids = self.summary_model.generate(
            inputs,
            num_beams=4,
            max_length=min(150, len(text) // 3),
            early_stopping=True,
            no_repeat_ngram_size=2
        )
        return self.summary_tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    def extract_keywords(self, text, n=10):
        # Use multiple extraction methods for better results
        keywords = []

        # Method 1: Using pke
        try:
            extractor = pke.unsupervised.MultipartiteRank()
            extractor.load_document(input=text, language='en')
            pos = {'PROPN', 'NOUN', 'ADJ'}
            extractor.candidate_selection(pos=pos)
            extractor.candidate_weighting(alpha=1.1, threshold=0.74, method='average')
            keyphrases = [kw[0] for kw in extractor.get_n_best(n=n*2)]
            keywords.extend(keyphrases)
        except Exception as e:
            print(f"pke extraction error: {e}")

        # Method 2: Using spaCy for entity recognition
        doc = self.nlp(text)
        for ent in doc.ents:
            if ent.label_ in ['PERSON', 'ORG', 'GPE', 'LOC', 'PRODUCT', 'EVENT', 'WORK_OF_ART', 'LAW', 'LANGUAGE', 'DATE', 'MONEY', 'PERCENT', 'QUANTITY']:
                keywords.append(ent.text)

        # Method 3: Using noun chunks from spaCy
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) <= 3:  # Keep phrases of reasonable length
                keywords.append(chunk.text)

        # Filter and rank keywords
        filtered_keywords = []
        for keyword in keywords:
            # Filter out stop words and short keywords
            if keyword.lower() not in self.stop_words and len(keyword) > 3:
                filtered_keywords.append(keyword)

        # Remove duplicates while preserving order
        unique_keywords = []
        seen = set()
        for kw in filtered_keywords:
            if kw.lower() not in seen:
                seen.add(kw.lower())
                unique_keywords.append(kw)

        # Rank keywords by importance in the text
        keyword_embeddings = self.sentence_model.encode(unique_keywords)
        text_embedding = self.sentence_model.encode([text])[0]

        # Calculate similarity to main text
        similarities = np.dot(keyword_embeddings, text_embedding) / (
            np.linalg.norm(keyword_embeddings, axis=1) * np.linalg.norm(text_embedding)
        )

        # Sort keywords by similarity and return top n
        sorted_keywords = [x for _, x in sorted(zip(similarities, unique_keywords), reverse=True)]
        return sorted_keywords[:n]

    def generate_question(self, context, answer):
        # Find the sentence containing the answer for better context
        sentences = nltk.sent_tokenize(context)
        answer_sentence = ""
        for sentence in sentences:
            if answer.lower() in sentence.lower():
                answer_sentence = sentence
                break

        if not answer_sentence:
            answer_sentence = context

        # Use more specific prompts with randomization for variety
        templates = [
            f"generate a multiple choice question: {answer_sentence} answer: {answer}",
            f"create a quiz question based on this information: {answer_sentence} with answer: {answer}",
            f"write a test question where '{answer}' is the correct answer: {answer_sentence}",
            f"formulate an exam question about: {answer_sentence} with '{answer}' as the answer",
            f"develop a question for assessment: {answer_sentence} correct answer: {answer}"
        ]

        # Choose a random template for variety
        template = random.choice(templates)

        # Try different templates to generate questions
        inputs = self.question_tokenizer(template, max_length=512, padding=False, truncation=True, return_tensors="pt").to(self.device)
        
        # Add randomness to generation parameters
        num_beams = random.choice([3, 4, 5])
        max_length = random.randint(32, 64)
        
        outputs = self.question_model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            num_beams=num_beams,
            num_return_sequences=2,
            max_length=max_length,
            temperature=random.uniform(0.7, 1.3)  # Add temperature for more randomness
        )

        questions = []
        for output in outputs:
            question = self.question_tokenizer.decode(output, skip_special_tokens=True).replace("question:", "").strip()
            questions.append(question)

        # Validate questions
        valid_questions = []
        for q in questions:
            # Must end with question mark
            if not q.endswith("?"):
                q = q + "?"

            # Must not include the answer directly
            if answer.lower() not in q.lower():
                # Must be a proper length
                if 10 <= len(q) <= 150:
                    valid_questions.append(q)

        if valid_questions:
            # Return the highest quality question
            return max(valid_questions, key=lambda q: self._score_question(q, answer, answer_sentence))
        else:
            # Fallback to a template question if generation fails
            return self._create_template_question(answer, answer_sentence)

    def _score_question(self, question, answer, context):
        """Score question quality based on multiple factors"""
        score = 0

        # Reward questions with question words
        question_words = ["what", "who", "where", "when", "why", "how", "which"]
        if any(question.lower().startswith(word) for word in question_words):
            score += 2

        # Reward medium-length questions
        if 20 <= len(question) <= 80:
            score += 1

        # Check semantic relevance between question and context
        try:
            question_embedding = self.sentence_model.encode([question])[0]
            context_embedding = self.sentence_model.encode([context])[0]
            similarity = np.dot(question_embedding, context_embedding) / (
                np.linalg.norm(question_embedding) * np.linalg.norm(context_embedding)
            )
            score += similarity * 3
        except:
            pass

        return score

    def _create_template_question(self, answer, context):
        """Create a template-based question when generation fails"""
        doc = self.nlp(answer)
        entity_type = None
        for ent in doc.ents:
            entity_type = ent.label_
            break

        # Choose template based on answer type with multiple options for each type
        templates = {
            "PERSON": [
                f"Who is {answer} described in the text?",
                f"What role does {answer} play according to the passage?",
                f"How is {answer} significant based on the information provided?"
            ],
            "ORG": [
                f"What is {answer} mentioned in the passage?",
                f"What function does {answer} serve according to the text?",
                f"Why is {answer} important in this context?"
            ],
            "GPE": [
                f"Where is {answer} located according to the text?",
                f"What is significant about {answer} in this passage?",
                f"How is {answer} characterized in the given information?"
            ],
            "DATE": [
                f"When did events related to {answer} take place?",
                f"What significance does {answer} have in the timeline described?",
                f"How does {answer} relate to other events mentioned?"
            ],
            "GENERAL": [
                f"What is the significance of {answer} in the given context?",
                f"Which of the following best describes {answer}?",
                f"According to the passage, what is {answer}?",
                f"What is true about {answer} based on the information provided?",
                f"How does {answer} relate to the main concepts discussed?"
            ]
        }

        if entity_type in templates:
            return random.choice(templates[entity_type])
        else:
            return random.choice(templates["GENERAL"])

    def generate_explanation(self, context, answer, question):
        # Add randomness to the explanation prompt
        prompts = [
            f"explain: why '{answer}' is the correct answer to the question '{question}' based on this context: {context}",
            f"elaborate on why '{answer}' correctly answers '{question}' given this information: {context}",
            f"justify why '{answer}' is the right response to '{question}' considering: {context}"
        ]
        
        input_text = random.choice(prompts)
        inputs = self.explanation_tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True).to(self.device)
        
        # Randomize generation parameters
        temperature = random.uniform(0.8, 1.2)
        max_length = random.randint(50, 100)
        
        explanation_ids = self.explanation_model.generate(
            inputs,
            num_beams=4,
            max_length=max_length,
            early_stopping=True,
            no_repeat_ngram_size=2,
            temperature=temperature
        )
        return self.explanation_tokenizer.decode(explanation_ids[0], skip_special_tokens=True)

    def get_wordnet_distractors(self, answer):
        """Get distractors from WordNet synonyms, hypernyms, and hyponyms"""
        distractors = []

        # Get synsets for the answer
        synsets = wordnet.synsets(answer)
        for synset in synsets:
            # Get synonyms
            for lemma in synset.lemmas():
                synonym = lemma.name().replace('_', ' ')
                if synonym != answer and synonym not in distractors:
                    distractors.append(synonym)

            # Get hypernyms and hyponyms
            for hypernym in synset.hypernyms():
                for lemma in hypernym.lemmas():
                    distractor = lemma.name().replace('_', ' ')
                    if distractor != answer and distractor not in distractors:
                        distractors.append(distractor)

            for hyponym in synset.hyponyms():
                for lemma in hyponym.lemmas():
                    distractor = lemma.name().replace('_', ' ')
                    if distractor != answer and distractor not in distractors:
                        distractors.append(distractor)

        return distractors

    def generate_distractors(self, answer, context, question, num_distractors=3):
        all_distractors = []

        # Method 1: Sense2Vec
        try:
            answer_tokens = answer.lower().split()
            if len(answer_tokens) == 1:
                sense = self.s2v.get_best_sense(answer)
                if sense:
                    most_similar = self.s2v.most_similar(sense, n=10)
                    s2v_distractors = [word[0].split("|")[0] for word in most_similar]
                    all_distractors.extend(s2v_distractors)
            else:
                # For multi-word answers, try to get distractors for the main words
                for token in answer_tokens:
                    if token not in self.stop_words and len(token) > 3:
                        try:
                            sense = self.s2v.get_best_sense(token)
                            if sense:
                                most_similar = self.s2v.most_similar(sense, n=5)
                                s2v_distractors = [word[0].split("|")[0] for word in most_similar]
                                all_distractors.extend(s2v_distractors)
                        except:
                            continue
        except Exception as e:
            print(f"Sense2Vec error: {e}")

        # Method 2: WordNet
        wordnet_distractors = self.get_wordnet_distractors(answer)
        all_distractors.extend(wordnet_distractors)

        # Method 3: Extract other keywords from context as distractors
        context_keywords = self.extract_keywords(context, n=10)
        all_distractors.extend([kw for kw in context_keywords if kw.lower() != answer.lower()])

        # Filter distractors
        filtered_distractors = []
        seen = set()

        # Calculate similarity between answer and distractors
        answer_embedding = self.sentence_model.encode([answer])[0]

        for distractor in all_distractors:
            distractor_lower = distractor.lower()

            # Skip if already seen, too similar to answer, or is a substring of answer
            if (distractor_lower in seen or
                distractor_lower == answer.lower() or
                distractor_lower in answer.lower() or
                answer.lower() in distractor_lower):
                continue

            # Calculate semantic similarity
            try:
                distractor_embedding = self.sentence_model.encode([distractor])[0]
                similarity = np.dot(answer_embedding, distractor_embedding) / (
                    np.linalg.norm(answer_embedding) * np.linalg.norm(distractor_embedding)
                )

                # Skip if too similar or too dissimilar
                if similarity > 0.85 or similarity < 0.2:
                    continue
            except:
                pass

            # Calculate string similarity
            levenshtein_sim = self.normalized_levenshtein.similarity(distractor_lower, answer.lower())
            if levenshtein_sim > 0.7:  # Too similar
                continue

            seen.add(distractor_lower)
            filtered_distractors.append(distractor)

            if len(filtered_distractors) >= num_distractors * 2:
                break

        # Ensure we have enough distractors
        if len(filtered_distractors) < num_distractors:
            # Generate generic distractors as backup
            backup_distractors = [
                f"None of the above",
                f"All of the above",
                f"Cannot be determined"
            ]
            filtered_distractors.extend(backup_distractors)

        # Randomize the distractor selection further
        random.shuffle(filtered_distractors)

        # Select the final distractors - prioritize those most similar to answer in length
        answer_len = len(answer)
        filtered_distractors.sort(key=lambda x: abs(len(x) - answer_len))

        return filtered_distractors[:num_distractors]

    def process_chunk(self, chunk, num_questions=5):
        """Process a single text chunk and generate MCQs"""
        chunk = chunk.strip().replace("\n", " ")
        summary = self.generate_summary(chunk)
        print(f"Generated summary: {summary[:100]}...")

        keywords = self.extract_keywords(summary)
        print(f"Extracted keywords: {', '.join(keywords[:5])}...")

        # Shuffle keywords for randomization
        random.shuffle(keywords)

        mcqs = []
        for keyword in keywords:
            try:
                question = self.generate_question(summary, keyword)
                if not question or len(question) < 10:
                    continue

                distractors = self.generate_distractors(keyword, summary, question)
                if len(distractors) < 3:
                    continue

                explanation = self.generate_explanation(summary, keyword, question)

                # Shuffle options
                options = [keyword] + distractors[:3]
                random.shuffle(options)

                # Find correct answer index
                correct_index = options.index(keyword)

                mcqs.append({
                    "question": question,
                    "answer": keyword,
                    "options": options,
                    "correct_index": correct_index,
                    "explanation": explanation
                })

                if len(mcqs) >= num_questions:
                    break
            except Exception as e:
                print(f"Error generating MCQ for keyword '{keyword}': {e}")
                continue

        return mcqs

    def process_pdf(self, pdf_path, questions_per_chunk=3, chunk_size=2000, overlap=200):
        """Process an entire PDF file, extracting text and generating MCQs from chunks"""
        # Extract text from PDF
        print(f"Extracting text from {pdf_path}...")
        pdf_text = extract_text_from_pdf(pdf_path)
        
        if not pdf_text:
            print("Failed to extract text from PDF or PDF is empty.")
            return []
            
        print(f"Successfully extracted {len(pdf_text)} characters from PDF.")
        
        # Chunk the text
        chunks = chunk_text(pdf_text, chunk_size=chunk_size, overlap=overlap)
        print(f"Split text into {len(chunks)} chunks.")
        
        # Process each chunk
        all_mcqs = []
        for i, chunk in enumerate(chunks):
            print(f"\nProcessing chunk {i+1}/{len(chunks)}...")
            chunk_mcqs = self.process_chunk(chunk, num_questions=questions_per_chunk)
            all_mcqs.extend(chunk_mcqs)
            
        # Add entropy to increase randomness in the final set
        random.shuffle(all_mcqs)
        
        return all_mcqs

    def format_output(self, mcqs):
        """Format the MCQs for display"""
        output = "\n" + "="*40 + " Generated MCQs " + "="*40 + "\n"
        for i, mcq in enumerate(mcqs, 1):
            output += f"\nQ{i}: {mcq['question']}\n"

            # Add options with letters
            for j, option in enumerate(mcq['options']):
                letter = chr(65 + j)  # A, B, C, D
                output += f"{letter}. {option}\n"

            correct_letter = chr(65 + mcq['correct_index'])
            output += f"\nCorrect Answer: {correct_letter}. {mcq['answer']}\n"
            output += f"Explanation: {mcq['explanation']}\n"

        return output

    def process_text(self, text, questions_per_chunk=3, chunk_size=2000, overlap=200):
        """Process plain text and generate MCQs from chunks"""
        if not text:
            print("Empty text provided.")
            return []
            
        print(f"Processing text with {len(text)} characters.")
        
        # Chunk the text
        chunks = chunk_text(text, chunk_size=chunk_size, overlap=overlap)
        print(f"Split text into {len(chunks)} chunks.")
        
        # Process each chunk
        all_mcqs = []
        for i, chunk in enumerate(chunks):
            print(f"\nProcessing chunk {i+1}/{len(chunks)}...")
            chunk_mcqs = self.process_chunk(chunk, num_questions=questions_per_chunk)
            all_mcqs.extend(chunk_mcqs)
            
        # Add entropy to increase randomness in the final set
        random.shuffle(all_mcqs)
        
        return all_mcqs
