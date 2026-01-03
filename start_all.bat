@echo off
echo ========================================
echo   Trivara Hotel - One-Click Startup
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

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)

echo [1/3] Checking prerequisites...
echo   - Python: OK
echo   - Node.js: OK
echo.

REM Check if port 8000 is already in use
netstat -ano | findstr :8000 >nul 2>&1
if not errorlevel 1 (
    echo WARNING: Port 8000 is already in use!
    echo The backend server might already be running.
    echo.
    echo Options:
    echo   1. Close this window and check if backend is already running
    echo   2. Kill the process using port 8000 and try again
    echo.
    pause
    exit /b 1
)

echo [2/3] Starting Backend Server...
echo   Opening backend terminal window...
echo.

REM Start backend in a new window
start "Trivara Backend Server" cmd /c "cd /d "%~dp0backend" && start_backend.bat"

REM Wait for backend to start (give it 8 seconds)
echo   Waiting for backend to initialize...
timeout /t 8 /nobreak >nul

REM Check if backend is running
netstat -ano | findstr :8000 >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Backend failed to start
    echo ========================================
    echo.
    echo Please check the backend terminal window for error details.
    echo Common issues:
    echo   - Database connection failed
    echo   - Missing Python packages
    echo   - Port 8000 blocked by firewall
    echo.
    pause
    exit /b 1
)

echo   Backend server is running on port 8000
echo.

echo [3/3] Starting Frontend Server...
echo   Opening frontend terminal window...
echo.

REM Start frontend in a new window
start "Trivara Frontend Server" cmd /c "cd /d "%~dp0Frontend\Frontend" && start_frontend.bat"

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Two terminal windows have been opened:
echo   1. Backend Server (must stay open)
echo   2. Frontend Server (must stay open)
echo.
echo To stop the servers:
echo   Press Ctrl+C in each terminal window
echo.
echo ========================================
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul

REM Open browser to frontend
start http://localhost:5173

echo.
echo You can close this window now.
echo.
pause
