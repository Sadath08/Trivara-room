# Hotel Management System - Backend

This is the backend API for the Hotel Management System, built with **FastAPI** and **PostgreSQL**.

## 🚀 Quick Start

**The easiest way to start the backend:**

1. Navigate to the backend folder
2. **Double-click** `start_backend.bat` (Windows)
3. Wait for "Application startup complete"
4. Backend is now running at http://localhost:8000

> **New to the project?** See [STARTUP_GUIDE.md](../STARTUP_GUIDE.md) in the project root for detailed setup instructions.

---

## Prerequisites

-   Python 3.8+
-   PostgreSQL (running locally)

## Installation

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Create a virtual environment** (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Configuration

### 3. Configure Environment Variables
Create a `.env` file in the `backend` directory (if it doesn't exist) and add your database configuration:

```env
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
# CHANGE THE BELOW URL TO MATCH YOUR DATABASE
# Format: postgresql://<username>:<password>@<host>:<port>/<dbname>
DATABASE_URL=postgresql://postgres:root123@localhost:5432/Hotel
```

> **IMPORTANT**: The `DATABASE_URL` is where you connect your backend to your PostgreSQL database.
> -   **Username/Password**: Replaces `postgres:root123`.
> -   **Port**: Default is `5432`. If you are using a different port (like 5173), change it here.
> -   **Database Name**: Replaces `Hotel`. Ensure this database exists in your PostgreSQL server.

### 4. Run the Backend
Navigate to the `backend` directory and run:
    Run the included script to check if the backend can connect to your database:
    ```bash
    python check_db.py
    ```

## Running the Application

### Option 1: Using Startup Script (Recommended)
```bash
# Windows
start_backend.bat

# Or just double-click start_backend.bat
```

### Option 2: Manual Command
Start the development server using **Uvicorn**:

```bash
uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`.

## API Documentation

Once the server is running, you can explore the API using the interactive Swagger UI:

-   **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
-   **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Features

-   **Auth**: Register and Login (JWT Tokens).
-   **Users**: View profile (`/users/me`).
-   **Rooms**:
    -   Admin can add rooms and upload images.
    -   Users can view rooms.
-   **Bookings**: Users can book rooms (with dynamic pricing calculation).

---

## 🔧 Troubleshooting

### "Failed to fetch" Error in Frontend

**Problem**: Frontend shows "Failed to fetch" when trying to login or register.

**Solution**: The backend server is not running. Make sure to:
1. Start the backend using `start_backend.bat`
2. Wait for "Application startup complete" message
3. Verify backend is accessible at http://localhost:8000

### Port 8000 Already in Use

**Problem**: Error message says port 8000 is already in use.

**Solution**:
1. Check if backend is already running in another terminal
2. Or find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :8000
   taskkill /PID <PID_NUMBER> /F
   ```

### Database Connection Errors

**Problem**: Backend fails to start with database errors.

**Solution**:
1. Make sure PostgreSQL is running
2. Verify database credentials in `.env` file
3. Check if the database exists
4. Try resetting the database:
   ```bash
   python reset_db.py
   python create_admin.py
   ```

### Missing Dependencies

**Problem**: ImportError or ModuleNotFoundError when starting.

**Solution**:
```bash
pip install -r requirements.txt
```

---

For more detailed setup instructions and troubleshooting, see [STARTUP_GUIDE.md](../STARTUP_GUIDE.md).

