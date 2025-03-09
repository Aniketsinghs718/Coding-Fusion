@echo off
echo ===== Downloading Models for MCQ Generator =====
echo.
echo This process may take a long time depending on your internet connection.
echo The models are several gigabytes in size.
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to activate virtual environment
    echo Make sure you've run install_windows.bat first
    pause
    exit /b 1
)

REM Ensure models directory exists
echo Ensuring models directory exists...
if not exist backend\models mkdir backend\models
if not exist backend\models (
    echo Error: Failed to create models directory
    pause
    exit /b 1
)

REM Download T5 base model
echo.
echo Downloading T5 base model (this may take several minutes)...
if exist backend\models\t5-base (
    echo T5 base model already exists, skipping...
) else (
    python -c "from transformers import T5ForConditionalGeneration, T5Tokenizer; print('Downloading T5 base model...'); model = T5ForConditionalGeneration.from_pretrained('t5-base'); tokenizer = T5Tokenizer.from_pretrained('t5-base'); print('Saving T5 base model...'); model.save_pretrained('backend/models/t5-base'); tokenizer.save_pretrained('backend/models/t5-base'); print('T5 base model downloaded and saved successfully.')"
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to download T5 base model
        pause
        exit /b 1
    )
)

REM Download T5 SQuAD model
echo.
echo Downloading T5 SQuAD model (this may take several minutes)...
if exist backend\models\t5_squad_v1 (
    echo T5 SQuAD model already exists, skipping...
) else (
    python -c "from transformers import T5ForConditionalGeneration, T5Tokenizer; print('Downloading T5 SQuAD model...'); model = T5ForConditionalGeneration.from_pretrained('mrm8488/t5-base-finetuned-squad-v1'); tokenizer = T5Tokenizer.from_pretrained('mrm8488/t5-base-finetuned-squad-v1'); print('Saving T5 SQuAD model...'); model.save_pretrained('backend/models/t5_squad_v1'); tokenizer.save_pretrained('backend/models/t5_squad_v1'); print('T5 SQuAD model downloaded and saved successfully.')"
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to download T5 SQuAD model
        pause
        exit /b 1
    )
)

REM Download Sentence Transformer model
echo.
echo Downloading Sentence Transformer model (this may take several minutes)...
if exist backend\models\msmarco-distilbert-base-v3 (
    echo Sentence Transformer model already exists, skipping...
) else (
    python -c "from sentence_transformers import SentenceTransformer; print('Downloading Sentence Transformer model...'); model = SentenceTransformer('msmarco-distilbert-base-v3'); print('Saving Sentence Transformer model...'); model.save('backend/models/msmarco-distilbert-base-v3'); print('Sentence Transformer model downloaded and saved successfully.')"
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to download Sentence Transformer model
        pause
        exit /b 1
    )
)

REM Download Sense2Vec model
echo.
echo Downloading Sense2Vec model (this may take a long time, ~1GB download)...
if exist backend\models\s2v_old (
    echo Sense2Vec model already exists, skipping...
) else (
    python -c "import os, requests, tarfile; url = 'https://github.com/explosion/sense2vec/releases/download/v1.0.0/s2v_reddit_2015_md.tar.gz'; print('Downloading Sense2Vec model (this may take a while)...'); try: response = requests.get(url, stream=True); total_size = int(response.headers.get('content-length', 0)); downloaded = 0; with open('s2v_reddit_2015_md.tar.gz', 'wb') as f: for chunk in response.iter_content(chunk_size=8192): if chunk: f.write(chunk); downloaded += len(chunk); if total_size > 0: percent = int(100 * downloaded / total_size); print(f'Downloaded {downloaded} of {total_size} bytes ({percent}%)', end='\\r'); print('\\nExtracting Sense2Vec model...'); with tarfile.open('s2v_reddit_2015_md.tar.gz', 'r:gz') as tar: tar.extractall(); os.rename('s2v_reddit_2015_md', 'backend/models/s2v_old'); os.remove('s2v_reddit_2015_md.tar.gz'); print('Sense2Vec model downloaded and extracted successfully.'); except Exception as e: print(f'Error: {e}'); exit(1)"
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to download Sense2Vec model
        echo You can try downloading it manually:
        echo 1. Download from: https://github.com/explosion/sense2vec/releases/download/v1.0.0/s2v_reddit_2015_md.tar.gz
        echo 2. Extract the archive
        echo 3. Rename the extracted folder to "s2v_old"
        echo 4. Move it to the backend\models directory
        pause
        exit /b 1
    )
)

echo.
echo ===== All models downloaded successfully! =====
echo.
echo You can now run the backend server with:
echo   run.bat
echo.

pause 