@echo off
echo Starting MCQ Generator backend server...

REM Activate virtual environment
call venv\Scripts\activate
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to activate virtual environment
    echo Make sure you've run install_windows.bat first
    pause
    exit /b 1
)

REM Check if models exist
if not exist backend\models\t5-base (
    echo Error: Required models are missing
    echo Please run download_models.bat first
    pause
    exit /b 1
)

REM Start the backend server
cd backend
python app.py
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to start the backend server
    pause
    exit /b 1
) 