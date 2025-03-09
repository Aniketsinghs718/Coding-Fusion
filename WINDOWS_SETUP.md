# Windows Setup Guide for MCQ Generator

This guide provides step-by-step instructions for setting up the MCQ Generator project on Windows.

## Prerequisites

- Python 3.8+ (download from [python.org](https://www.python.org/downloads/))
- Node.js 16+ (download from [nodejs.org](https://nodejs.org/))
- Git (download from [git-scm.com](https://git-scm.com/download/win))

## Step 1: Clone the Repository

1. Open Command Prompt
2. Navigate to the directory where you want to clone the project
3. Run the following command:

```
git clone https://github.com/yourusername/mcq-generator.git
cd mcq-generator
```

## Step 2: Set Up the Frontend

1. Install the required Node.js packages:

```
npm install
```

2. Start the development server:

```
npm run dev
```

The frontend will be available at http://localhost:5173 (or another port if 5173 is in use)

## Step 3: Set Up the Backend

### Option 1: Using the Setup Script (Recommended)

1. Run the Windows setup script:

```
setup_windows.bat
```

This script will:
- Create a virtual environment
- Install required Python packages
- Download spaCy model and NLTK data
- Create a run script for the backend

2. Download the models (this may take some time):

```
download_models.bat
```

### Option 2: Manual Setup

If the setup script doesn't work, follow these steps manually:

1. Create a virtual environment:

```
python -m venv venv
```

2. Activate the virtual environment:

```
venv\Scripts\activate
```

3. Upgrade pip:

```
python -m pip install --upgrade pip
```

4. Install requirements:

```
python -m pip install -r backend\requirements.txt
```

5. Download spaCy model:

```
python -m spacy download en_core_web_sm
```

6. Download NLTK data:

```
python -c "import nltk; nltk.download('punkt'); nltk.download('wordnet'); nltk.download('stopwords')"
```

7. Create the models directory:

```
mkdir backend\models
```

8. Download the models manually:

- T5 base model:
```
python -c "from transformers import T5ForConditionalGeneration, T5Tokenizer; model = T5ForConditionalGeneration.from_pretrained('t5-base'); tokenizer = T5Tokenizer.from_pretrained('t5-base'); model.save_pretrained('backend/models/t5-base'); tokenizer.save_pretrained('backend/models/t5-base')"
```

- T5 SQuAD model:
```
python -c "from transformers import T5ForConditionalGeneration, T5Tokenizer; model = T5ForConditionalGeneration.from_pretrained('mrm8488/t5-base-finetuned-squad-v1'); tokenizer = T5Tokenizer.from_pretrained('mrm8488/t5-base-finetuned-squad-v1'); model.save_pretrained('backend/models/t5_squad_v1'); tokenizer.save_pretrained('backend/models/t5_squad_v1')"
```

- Sentence Transformer model:
```
python -c "from sentence_transformers import SentenceTransformer; model = SentenceTransformer('msmarco-distilbert-base-v3'); model.save('backend/models/msmarco-distilbert-base-v3')"
```

- Sense2Vec model (this is a large download):
```
python -c "import os, requests, tarfile; url = 'https://github.com/explosion/sense2vec/releases/download/v1.0.0/s2v_reddit_2015_md.tar.gz'; print('Downloading Sense2Vec model...'); response = requests.get(url, stream=True); with open('s2v_reddit_2015_md.tar.gz', 'wb') as f: [f.write(chunk) for chunk in response.iter_content(chunk_size=8192)]; print('Extracting...'); with tarfile.open('s2v_reddit_2015_md.tar.gz', 'r:gz') as tar: tar.extractall(); os.rename('s2v_reddit_2015_md', 'backend/models/s2v_old'); os.remove('s2v_reddit_2015_md.tar.gz')"
```

## Step 4: Run the Backend

1. Start the backend server:

```
run.bat
```

The backend API will be available at http://localhost:5000

## Step 5: Use the Application

1. Open your browser and navigate to http://localhost:5173 (or the port shown in your terminal)
2. Choose between uploading a PDF/TXT file or entering text directly
3. Click "Generate Quiz" to create MCQs from your content

## Troubleshooting

### Common Issues

1. **"Python was not found"**: Make sure Python is installed and added to your PATH environment variable.

2. **"pip is not recognized"**: Try using `python -m pip` instead of just `pip`.

3. **Model download failures**: If you encounter issues downloading models, try downloading them one by one using the commands in the manual setup section.

4. **Memory issues**: The models require significant memory. If you encounter memory errors, try:
   - Closing other applications to free up memory
   - Reducing the chunk size in the API request
   - Using a machine with more RAM

5. **Port already in use**: If port 5000 is already in use, you can change the port in `backend/app.py` by modifying the line:
   ```python
   port = int(os.environ.get('PORT', 5000))
   ```

6. **Timeout errors**: Generating MCQs can take time. If you encounter timeout errors, be patient or try with smaller text inputs first.

7. **Virtual environment activation fails**: If you see an error about execution policies, try running PowerShell as administrator and execute:
   ```
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ``` 