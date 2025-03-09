@echo off
echo ===== MCQ Generator Installation Script =====
echo.

REM Check if Python is installed
python --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Check if pip is available
python -m pip --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: pip is not available
    echo Please ensure pip is installed with your Python installation
    pause
    exit /b 1
)

REM Check if git is installed (needed for pke installation)
git --version > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Creating virtual environment...
if exist venv (
    echo Virtual environment already exists. Removing...
    rmdir /s /q venv
)

python -m venv venv
if %ERRORLEVEL% neq 0 (
    echo Error creating virtual environment
    echo Trying alternative method...
    python -m pip install virtualenv
    python -m virtualenv venv
    if %ERRORLEVEL% neq 0 (
        echo Failed to create virtual environment
        pause
        exit /b 1
    )
)

echo Activating virtual environment...
call venv\Scripts\activate
if %ERRORLEVEL% neq 0 (
    echo Error activating virtual environment
    pause
    exit /b 1
)

echo Upgrading pip...
python -m pip install --upgrade pip
if %ERRORLEVEL% neq 0 (
    echo Warning: Failed to upgrade pip, continuing with installation...
)

echo Installing wheel and setuptools...
python -m pip install wheel setuptools
if %ERRORLEVEL% neq 0 (
    echo Warning: Failed to install wheel and setuptools, continuing...
)

echo Installing basic requirements...
python -m pip install nltk spacy numpy requests
if %ERRORLEVEL% neq 0 (
    echo Error installing basic requirements
    pause
    exit /b 1
)

echo Installing pke from GitHub...
python -m pip install git+https://github.com/boudinfl/pke.git
if %ERRORLEVEL% neq 0 (
    echo Error installing pke
    pause
    exit /b 1
)

echo Installing remaining requirements...
python -m pip install torch flashtext transformers sense2vec sentence-transformers python-Levenshtein pdfplumber flask flask-cors python-dotenv
if %ERRORLEVEL% neq 0 (
    echo Error installing remaining requirements
    pause
    exit /b 1
)

echo Downloading spaCy model...
python -m spacy download en_core_web_sm
if %ERRORLEVEL% neq 0 (
    echo Error downloading spaCy model
    pause
    exit /b 1
)

echo Downloading NLTK data...
python -c "import nltk; nltk.download('punkt'); nltk.download('wordnet'); nltk.download('stopwords')"
if %ERRORLEVEL% neq 0 (
    echo Error downloading NLTK data
    pause
    exit /b 1
)

echo Creating models directory...
if not exist backend\models mkdir backend\models
if not exist backend\models (
    echo Error creating models directory
    pause
    exit /b 1
)

echo Creating run script...
echo @echo off > run.bat
echo call venv\Scripts\activate >> run.bat
echo cd backend >> run.bat
echo python app.py >> run.bat

echo.
echo ===== Installation completed successfully! =====
echo.
echo To download the required models, run:
echo   download_models.bat
echo.
echo To start the backend server, run:
echo   run.bat
echo.
echo To start the frontend, run:
echo   npm run dev
echo.

pause 