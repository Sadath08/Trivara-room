@echo off
echo ========================================
echo   Starting Trivara Frontend Server
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)

echo [1/3] Checking Node.js installation...
node --version
npm --version
echo.

REM Check if we're in the correct directory
if not exist "package.json" (
    echo ERROR: Cannot find package.json
    echo Please run this script from the Frontend\Frontend directory
    pause
    exit /b 1
)

REM Check if backend is running
echo [2/3] Checking backend server connection...
curl -s http://localhost:8000 >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo WARNING: Backend server is not responding!
    echo ========================================
    echo.
    echo The backend server on port 8000 is not accessible.
    echo Login and registration will NOT work without the backend.
    echo.
    echo Please ensure the backend server is running:
    echo   1. Navigate to: C:\Users\Syed\OneDrive\Desktop\Hotel\backend
    echo   2. Run: start_backend.bat
    echo.
    echo Or use the one-click startup:
    echo   1. Navigate to: C:\Users\Syed\OneDrive\Desktop\Hotel
    echo   2. Run: start_all.bat
    echo.
    echo Press any key to continue anyway (frontend will start but won't connect)...
    pause >nul
    echo.
) else (
    echo   Backend server is running! Connection OK.
    echo.
)

echo [3/3] Starting Vite development server...
echo.
echo ========================================
echo Frontend will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the development server
npm run dev

REM If npm exits with error
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Failed to start the frontend
    echo ========================================
    echo.
    echo Common solutions:
    echo 1. Make sure dependencies are installed: npm install
    echo 2. Check if port 5173 is not already in use
    echo 3. Verify package.json exists in this directory
    echo.
    pause
)
