@echo off
echo Setting up MCQ Generator project...

echo Creating virtual environment...
python -m venv venv
if %ERRORLEVEL% neq 0 (
    echo Error creating virtual environment
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate
if %ERRORLEVEL% neq 0 (
    echo Error activating virtual environment
    exit /b 1
)

echo Upgrading pip...
python -m pip install --upgrade pip
if %ERRORLEVEL% neq 0 (
    echo Error upgrading pip
    exit /b 1
)

echo Installing requirements...
python -m pip install -r backend\requirements.txt
if %ERRORLEVEL% neq 0 (
    echo Error installing requirements
    exit /b 1
)

echo Creating models directory...
mkdir backend\models
if not exist backend\models (
    echo Error creating models directory
    exit /b 1
)

echo Downloading spaCy model...
python -m spacy download en_core_web_sm
if %ERRORLEVEL% neq 0 (
    echo Error downloading spaCy model
    exit /b 1
)

echo Downloading NLTK data...
python -c "import nltk; nltk.download('punkt'); nltk.download('wordnet'); nltk.download('stopwords')"
if %ERRORLEVEL% neq 0 (
    echo Error downloading NLTK data
    exit /b 1
)

echo Creating run script...
echo @echo off > run.bat
echo cd backend >> run.bat
echo ..\venv\Scripts\python app.py >> run.bat

echo Setup completed successfully!
echo.
echo To run the application:
echo 1. Run the frontend: npm run dev
echo 2. Run the backend: run.bat (from the project root directory)

pause 