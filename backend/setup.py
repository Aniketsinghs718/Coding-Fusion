import os
import sys
import subprocess
import platform
import shutil
from pathlib import Path

def create_virtual_environment():
    """Create a virtual environment for the project"""
    print("Creating virtual environment...")
    
    # Determine the appropriate command based on the platform
    if platform.system() == "Windows":
        venv_cmd = [sys.executable, "-m", "venv", "venv"]
    else:
        venv_cmd = ["python3", "-m", "venv", "venv"]
    
    try:
        subprocess.run(venv_cmd, check=True)
        print("Virtual environment created successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error creating virtual environment: {e}")
        sys.exit(1)

def install_requirements():
    """Install required packages from requirements.txt"""
    print("Installing requirements...")
    
    # Determine the pip path based on the platform
    if platform.system() == "Windows":
        pip_path = os.path.join("venv", "Scripts", "pip")
        python_path = os.path.join("venv", "Scripts", "python")
    else:
        pip_path = os.path.join("venv", "bin", "pip")
        python_path = os.path.join("venv", "bin", "python")
    
    try:
        # Upgrade pip using the Python executable to avoid errors
        subprocess.run([python_path, "-m", "pip", "install", "--upgrade", "pip"], check=True)
        
        # Install requirements
        subprocess.run([python_path, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("Requirements installed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        sys.exit(1)

def download_spacy_model():
    """Download the spaCy model"""
    print("Downloading spaCy model...")
    
    # Determine the python path based on the platform
    if platform.system() == "Windows":
        python_path = os.path.join("venv", "Scripts", "python")
    else:
        python_path = os.path.join("venv", "bin", "python")
    
    try:
        subprocess.run([python_path, "-m", "spacy", "download", "en_core_web_sm"], check=True)
        print("spaCy model downloaded successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error downloading spaCy model: {e}")
        sys.exit(1)

def download_nltk_data():
    """Download required NLTK data"""
    print("Downloading NLTK data...")
    
    # Determine the python path based on the platform
    if platform.system() == "Windows":
        python_path = os.path.join("venv", "Scripts", "python")
    else:
        python_path = os.path.join("venv", "bin", "python")
    
    nltk_script = """
import nltk
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')
print('NLTK data downloaded successfully.')
"""
    
    try:
        subprocess.run([python_path, "-c", nltk_script], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error downloading NLTK data: {e}")
        sys.exit(1)

def download_huggingface_models():
    """Download required Hugging Face models"""
    print("Downloading Hugging Face models...")
    
    # Determine the python path based on the platform
    if platform.system() == "Windows":
        python_path = os.path.join("venv", "Scripts", "python")
    else:
        python_path = os.path.join("venv", "bin", "python")
    
    # Create models directory if it doesn't exist
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    huggingface_script = """
from transformers import T5ForConditionalGeneration, T5Tokenizer
from sentence_transformers import SentenceTransformer
import os
from pathlib import Path

models_dir = Path("models")

# Download T5 base model
print("Downloading T5 base model...")
t5_base_path = models_dir / "t5-base"
t5_base_path.mkdir(exist_ok=True)
model = T5ForConditionalGeneration.from_pretrained("t5-base")
tokenizer = T5Tokenizer.from_pretrained("t5-base")
model.save_pretrained(t5_base_path)
tokenizer.save_pretrained(t5_base_path)
print("T5 base model downloaded successfully.")

# Download T5 SQuAD model
print("Downloading T5 SQuAD model...")
t5_squad_path = models_dir / "t5_squad_v1"
t5_squad_path.mkdir(exist_ok=True)
model = T5ForConditionalGeneration.from_pretrained("mrm8488/t5-base-finetuned-squad-v1")
tokenizer = T5Tokenizer.from_pretrained("mrm8488/t5-base-finetuned-squad-v1")
model.save_pretrained(t5_squad_path)
tokenizer.save_pretrained(t5_squad_path)
print("T5 SQuAD model downloaded successfully.")

# Download Sentence Transformer model
print("Downloading Sentence Transformer model...")
st_path = models_dir / "msmarco-distilbert-base-v3"
st_path.mkdir(exist_ok=True)
model = SentenceTransformer("msmarco-distilbert-base-v3")
model.save(st_path)
print("Sentence Transformer model downloaded successfully.")
"""
    
    try:
        subprocess.run([python_path, "-c", huggingface_script], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error downloading Hugging Face models: {e}")
        sys.exit(1)

def download_sense2vec():
    """Download Sense2Vec model"""
    print("Downloading Sense2Vec model...")
    
    # Determine the python path based on the platform
    if platform.system() == "Windows":
        python_path = os.path.join("venv", "Scripts", "python")
    else:
        python_path = os.path.join("venv", "bin", "python")
    
    sense2vec_script = """
import os
import requests
import zipfile
from pathlib import Path

models_dir = Path("models")
s2v_path = models_dir / "s2v_old"

if not s2v_path.exists():
    # URL for the Sense2Vec model
    url = "https://github.com/explosion/sense2vec/releases/download/v1.0.0/s2v_reddit_2015_md.tar.gz"
    
    # Download the model
    print("Downloading Sense2Vec model (this may take a while)...")
    response = requests.get(url, stream=True)
    
    # Save the model to a temporary file
    with open("s2v_reddit_2015_md.tar.gz", "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    # Extract the model
    print("Extracting Sense2Vec model...")
    import tarfile
    with tarfile.open("s2v_reddit_2015_md.tar.gz", "r:gz") as tar:
        tar.extractall()
    
    # Rename the extracted directory
    os.rename("s2v_reddit_2015_md", "models/s2v_old")
    
    # Remove the temporary file
    os.remove("s2v_reddit_2015_md.tar.gz")
    
    print("Sense2Vec model downloaded and extracted successfully.")
else:
    print("Sense2Vec model already exists.")
"""
    
    try:
        subprocess.run([python_path, "-c", sense2vec_script], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error downloading Sense2Vec model: {e}")
        sys.exit(1)

def create_run_script():
    """Create a script to run the application"""
    print("Creating run script...")
    
    if platform.system() == "Windows":
        with open(os.path.join("..", "run.bat"), "w") as f:
            f.write("@echo off\n")
            f.write("cd backend\n")
            f.write("..\\venv\\Scripts\\python app.py\n")
        print("Created run.bat")
    else:
        with open(os.path.join("..", "run.sh"), "w") as f:
            f.write("#!/bin/bash\n")
            f.write("cd backend\n")
            f.write("../venv/bin/python app.py\n")
        os.chmod(os.path.join("..", "run.sh"), 0o755)
        print("Created run.sh")

def main():
    """Main function to set up the project"""
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Change to the project root directory (parent of current directory)
    os.chdir(os.path.dirname(current_dir))
    
    print("Setting up MCQ Generator project...")
    print(f"Working directory: {os.getcwd()}")
    
    # Create virtual environment
    create_virtual_environment()
    
    # Install requirements
    install_requirements()
    
    # Download spaCy model
    download_spacy_model()
    
    # Download NLTK data
    download_nltk_data()
    
    # Download Hugging Face models
    download_huggingface_models()
    
    # Download Sense2Vec model
    download_sense2vec()
    
    # Create run script
    create_run_script()
    
    print("\nSetup completed successfully!")
    print("\nTo run the application:")
    if platform.system() == "Windows":
        print("1. Run the frontend: npm run dev")
        print("2. Run the backend: run.bat (from the project root directory)")
    else:
        print("1. Run the frontend: npm run dev")
        print("2. Run the backend: ./run.sh (from the project root directory)")

if __name__ == "__main__":
    main() 