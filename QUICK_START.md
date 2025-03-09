# Quick Start Guide for Windows

This is a simplified guide to get the MCQ Generator up and running on Windows.

## Prerequisites

- Python 3.8+ (with pip)
- Git
- Node.js and npm

## Step 1: Install Required Software

If you don't have the prerequisites installed:

1. **Python**: Download and install from [python.org](https://www.python.org/downloads/) (Make sure to check "Add Python to PATH")
2. **Git**: Download and install from [git-scm.com](https://git-scm.com/download/win)
3. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/)

## Step 2: Setup (One-Time Process)

1. Open Command Prompt and navigate to the project directory
2. Run the installation script:
   ```
   install_windows.bat
   ```
3. Download the required models (this may take a long time):
   ```
   download_models.bat
   ```

## Step 3: Running the Application

1. Start the backend server:
   ```
   run.bat
   ```
2. In a new Command Prompt window, start the frontend:
   ```
   npm run dev
   ```
3. Open your browser and go to the URL shown in the frontend terminal (usually http://localhost:5173)

## Troubleshooting

If you encounter errors:

1. **Installation fails**: Try running the commands manually:
   ```
   python -m venv venv
   venv\Scripts\activate
   python -m pip install --upgrade pip
   python -m pip install -r backend\requirements.txt
   ```

2. **Model download fails**: Try downloading each model separately using the commands in WINDOWS_SETUP.md

3. **Backend server fails to start**: Check if all models are downloaded correctly in the `backend\models` directory

4. **"Python was not found"**: Make sure Python is added to your PATH environment variable

5. **"Git not found"**: Make sure Git is installed and added to your PATH

For more detailed instructions, see WINDOWS_SETUP.md 