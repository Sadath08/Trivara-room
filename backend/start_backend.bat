@echo off
echo ========================================
echo   Starting Trivara Hotel Backend Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

echo [1/4] Checking Python installation...
python --version

REM Check if we're in the correct directory
if not exist "app\main.py" (
    echo ERROR: Cannot find app\main.py
    echo Please run this script from the backend directory
    pause
    exit /b 1
)

echo [2/4] Installing/Updating dependencies...
echo.
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo.
    echo WARNING: Some packages might not have installed correctly
    echo Trying to continue anyway...
    echo.
)

echo.
echo [3/4] Checking database connection...
python check_db.py
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Database connection failed
    echo ========================================
    echo.
    echo Please check:
    echo 1. PostgreSQL is running
    echo 2. Database credentials in .env file are correct
    echo 3. Database 'Hotel' exists
    echo.
    echo To reset the database, run:
    echo   python reset_db.py
    echo   python create_admin.py
    echo.
    pause
    exit /b 1
)

echo Database connection successful!
echo.
echo [4/4] Starting Uvicorn server...
echo.
echo ========================================
echo Backend will be available at: http://localhost:8000
echo API docs at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

REM If uvicorn exits (either error or user stopped it)
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Server stopped with an error
    echo ========================================
    echo.
    echo Common solutions:
    echo 1. Make sure port 8000 is not already in use
    echo 2. Check if all dependencies are installed: pip install -r requirements.txt
    echo 3. Verify the database is accessible
    echo.
) else (
    echo.
    echo ========================================
    echo Server stopped normally
    echo ========================================
    echo.
)

REM Keep window open to see any errors
pause
