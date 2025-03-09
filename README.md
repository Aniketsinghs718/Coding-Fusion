# MCQ Generator

An AI-powered Multiple Choice Question (MCQ) generator that creates quizzes from PDF documents or text input.

## Features

- Upload PDF or TXT files to generate MCQs
- Enter text directly to create quizzes
- AI-generated questions, options, and explanations
- Interactive quiz interface
- Automatic scoring and feedback
- Dashboard to track quiz performance

## Architecture

The application consists of two main components:

1. **Frontend**: React application built with TypeScript, Vite, and Tailwind CSS
2. **Backend**: Flask API that uses AI models to generate MCQs

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- npm or yarn
- Git

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/mcq-generator.git
cd mcq-generator
```

### Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

### Backend Setup

1. Run the setup script to create a virtual environment and download required models:

#### Windows

```bash
cd backend
python setup.py
```

#### macOS/Linux

```bash
cd backend
python3 setup.py
```

This script will:
- Create a virtual environment
- Install required Python packages
- Download necessary AI models
- Create a run script for the backend

2. Start the backend server:

#### Windows

```bash
run.bat
```

#### macOS/Linux

```bash
./run.sh
```

The backend API will be available at http://localhost:5000

## Manual Setup (if the setup script fails)

If the automatic setup script fails, you can manually set up the environment:

1. Create a virtual environment:

```bash
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
```

2. Activate the virtual environment:

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install requirements:

```bash
pip install -r backend/requirements.txt
```

4. Download required models:

```bash
# Download spaCy model
python -m spacy download en_core_web_sm

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('wordnet'); nltk.download('stopwords')"
```

5. Create the models directory:

```bash
mkdir -p backend/models
```

6. Download Hugging Face models (this may take some time):

```bash
python -c "from transformers import T5ForConditionalGeneration, T5Tokenizer; from sentence_transformers import SentenceTransformer; model = T5ForConditionalGeneration.from_pretrained('t5-base'); tokenizer = T5Tokenizer.from_pretrained('t5-base'); model.save_pretrained('backend/models/t5-base'); tokenizer.save_pretrained('backend/models/t5-base'); model = T5ForConditionalGeneration.from_pretrained('mrm8488/t5-base-finetuned-squad-v1'); tokenizer = T5Tokenizer.from_pretrained('mrm8488/t5-base-finetuned-squad-v1'); model.save_pretrained('backend/models/t5_squad_v1'); tokenizer.save_pretrained('backend/models/t5_squad_v1'); model = SentenceTransformer('msmarco-distilbert-base-v3'); model.save('backend/models/msmarco-distilbert-base-v3')"
```

7. Download Sense2Vec model:

```bash
# Download and extract Sense2Vec model
curl -L https://github.com/explosion/sense2vec/releases/download/v1.0.0/s2v_reddit_2015_md.tar.gz -o s2v_reddit_2015_md.tar.gz
tar -xzf s2v_reddit_2015_md.tar.gz
mv s2v_reddit_2015_md backend/models/s2v_old
rm s2v_reddit_2015_md.tar.gz
```

8. Start the backend server:

```bash
# Windows
cd backend
python app.py

# macOS/Linux
cd backend
python app.py
```

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Choose between uploading a PDF/TXT file or entering text directly
3. Click "Generate Quiz" to create MCQs from your content
4. Take the quiz and view your results
5. Access your quiz history and performance from the dashboard

## Troubleshooting

### Common Issues

1. **Model download failures**: If you encounter issues downloading models, try downloading them manually and placing them in the `backend/models` directory.

2. **GPU vs CPU**: By default, the application uses CPU for inference. If you have a compatible GPU, you can enable it by setting `use_gpu=True` in the `MCQGenerator` initialization in `app.py`.

3. **Memory issues**: The models require significant memory. If you encounter memory errors, try:
   - Reducing the chunk size in the API request
   - Using a machine with more RAM
   - Setting smaller batch sizes in the model configuration

4. **Timeout errors**: Generating MCQs can take time. If you encounter timeout errors, increase the timeout settings in your web server configuration.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hugging Face for providing pre-trained models
- Explosion AI for Sense2Vec
- The open-source community for various libraries used in this project 