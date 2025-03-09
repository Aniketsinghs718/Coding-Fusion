import os
import json
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import logging
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload settings
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'txt'}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Initialize MCQ Generator
mcq_generator = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def check_models_exist():
    """Check if required models exist"""
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    required_models = [
        os.path.join(models_dir, 't5-base'),
        os.path.join(models_dir, 't5_squad_v1'),
        os.path.join(models_dir, 'msmarco-distilbert-base-v3'),
        os.path.join(models_dir, 's2v_old')
    ]
    
    missing_models = [model for model in required_models if not os.path.exists(model)]
    
    if missing_models:
        return False, missing_models
    return True, []

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    models_exist, missing_models = check_models_exist()
    
    if not models_exist:
        return jsonify({
            "status": "warning", 
            "message": "MCQ Generator API is running but some models are missing",
            "missing_models": missing_models
        })
    
    return jsonify({"status": "ok", "message": "MCQ Generator API is running"})

@app.route('/api/generate-mcq', methods=['POST'])
def generate_mcq():
    """Generate MCQs from uploaded file or text"""
    global mcq_generator
    
    # Check if models exist
    models_exist, missing_models = check_models_exist()
    if not models_exist:
        return jsonify({
            "error": "Required models are missing. Please download the models first.",
            "missing_models": missing_models
        }), 500
    
    # Import MCQGenerator here to avoid import errors if models are missing
    try:
        from mcq_generator import MCQGenerator
    except Exception as e:
        logger.error(f"Error importing MCQGenerator: {e}")
        return jsonify({"error": f"Failed to import MCQGenerator: {str(e)}"}), 500
    
    # Initialize MCQ generator if not already done
    if mcq_generator is None:
        try:
            logger.info("Initializing MCQ Generator...")
            mcq_generator = MCQGenerator(use_gpu=False)  # Set to True if GPU is available
            logger.info("MCQ Generator initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing MCQ Generator: {e}")
            logger.error(traceback.format_exc())
            return jsonify({"error": f"Failed to initialize MCQ Generator: {str(e)}"}), 500
    
    # Get parameters from request
    questions_per_chunk = int(request.form.get('questionsPerChunk', 3))
    chunk_size = int(request.form.get('chunkSize', 2000))
    overlap = int(request.form.get('overlap', 200))
    
    # Check if the request has a file or text
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            try:
                # Save file to temporary location
                filename = secure_filename(file.filename)
                temp_dir = tempfile.mkdtemp()
                filepath = os.path.join(temp_dir, filename)
                file.save(filepath)
                
                logger.info(f"Processing file: {filename}")
                
                # Process file based on type
                if filename.endswith('.pdf'):
                    mcqs = mcq_generator.process_pdf(
                        filepath, 
                        questions_per_chunk=questions_per_chunk,
                        chunk_size=chunk_size,
                        overlap=overlap
                    )
                elif filename.endswith('.txt'):
                    with open(filepath, 'r', encoding='utf-8') as f:
                        text = f.read()
                    mcqs = mcq_generator.process_text(
                        text,
                        questions_per_chunk=questions_per_chunk,
                        chunk_size=chunk_size,
                        overlap=overlap
                    )
                
                # Clean up temporary file
                os.remove(filepath)
                os.rmdir(temp_dir)
                
                return jsonify({"mcqs": mcqs})
            
            except Exception as e:
                logger.error(f"Error processing file: {e}")
                logger.error(traceback.format_exc())
                return jsonify({"error": f"Error processing file: {str(e)}"}), 500
        else:
            return jsonify({"error": f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"}), 400
    
    elif 'text' in request.form:
        text = request.form['text']
        if not text:
            return jsonify({"error": "Empty text provided"}), 400
        
        try:
            logger.info("Processing text input")
            mcqs = mcq_generator.process_text(
                text,
                questions_per_chunk=questions_per_chunk,
                chunk_size=chunk_size,
                overlap=overlap
            )
            return jsonify({"mcqs": mcqs})
        
        except Exception as e:
            logger.error(f"Error processing text: {e}")
            logger.error(traceback.format_exc())
            return jsonify({"error": f"Error processing text: {str(e)}"}), 500
    
    else:
        return jsonify({"error": "No file or text provided"}), 400

@app.route('/api/download-models', methods=['POST'])
def download_models():
    """Endpoint to download required models"""
    try:
        # Create models directory if it doesn't exist
        models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        # Download spaCy model
        os.system("python -m spacy download en_core_web_sm")
        
        # Download NLTK datasets
        import nltk
        nltk.download('punkt')
        nltk.download('wordnet')
        nltk.download('stopwords')
        
        # Download Hugging Face models
        from transformers import T5ForConditionalGeneration, T5Tokenizer
        
        # Download and save T5 base model
        t5_base_path = os.path.join(models_dir, 't5-base')
        if not os.path.exists(t5_base_path):
            os.makedirs(t5_base_path, exist_ok=True)
            model = T5ForConditionalGeneration.from_pretrained('t5-base')
            tokenizer = T5Tokenizer.from_pretrained('t5-base')
            model.save_pretrained(t5_base_path)
            tokenizer.save_pretrained(t5_base_path)
        
        # Download and save T5 SQuAD model
        t5_squad_path = os.path.join(models_dir, 't5_squad_v1')
        if not os.path.exists(t5_squad_path):
            os.makedirs(t5_squad_path, exist_ok=True)
            model = T5ForConditionalGeneration.from_pretrained('mrm8488/t5-base-finetuned-squad-v1')
            tokenizer = T5Tokenizer.from_pretrained('mrm8488/t5-base-finetuned-squad-v1')
            model.save_pretrained(t5_squad_path)
            tokenizer.save_pretrained(t5_squad_path)
        
        # Download and save Sentence Transformer model
        from sentence_transformers import SentenceTransformer
        st_path = os.path.join(models_dir, 'msmarco-distilbert-base-v3')
        if not os.path.exists(st_path):
            os.makedirs(st_path, exist_ok=True)
            model = SentenceTransformer('msmarco-distilbert-base-v3')
            model.save(st_path)
        
        # Note: Sense2Vec model needs to be downloaded manually due to its size
        # and specific format requirements
        
        return jsonify({"status": "success", "message": "Models downloaded successfully"})
    
    except Exception as e:
        logger.error(f"Error downloading models: {e}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Error downloading models: {str(e)}"}), 500

@app.route('/api/models-status', methods=['GET'])
def models_status():
    """Check the status of required models"""
    models_exist, missing_models = check_models_exist()
    
    if models_exist:
        return jsonify({
            "status": "ok",
            "message": "All required models are available"
        })
    else:
        return jsonify({
            "status": "missing",
            "message": "Some required models are missing",
            "missing_models": missing_models
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
