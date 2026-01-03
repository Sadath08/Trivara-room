# 🚀 Trivara Hotel Management System - Quick Start Guide

## Overview
This guide will help you get both the frontend and backend servers running for the Trivara Hotel Management System.

---

## 📋 Prerequisites

- **Python 3.8+** installed ([Download Python](https://www.python.org/downloads/))
- **Node.js 16+** installed ([Download Node.js](https://nodejs.org/))
- **Git** (optional, for version control)

---

## ⚡ Quick Start (First Time Setup)

### Step 1: Backend Setup

1. **Open Command Prompt or PowerShell**

2. **Navigate to the backend folder:**
   ```bash
   cd C:\Users\Syed\OneDrive\Desktop\Hotel\backend
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create admin user (one-time):**
   ```bash
   python create_admin.py
   ```

### Step 2: Frontend Setup

1. **Open a NEW Command Prompt/PowerShell window**

2. **Navigate to the frontend folder:**
   ```bash
   cd C:\Users\Syed\OneDrive\Desktop\Hotel\Frontend\Frontend
   ```

3. **Install Node.js dependencies (one-time):**
   ```bash
   npm install
   ```

---

## 🎯 Daily Startup (Every Time You Work)

### ⭐ RECOMMENDED: One-Click Startup (Easiest!)

**This is the fastest and easiest way to start the application!**

1. Navigate to: `C:\Users\Syed\OneDrive\Desktop\Hotel`
2. **Double-click** `start_all.bat`
3. ✅ Two terminal windows will open automatically
4. ✅ Backend starts first, then frontend
5. ✅ Browser opens automatically to `http://localhost:5173`
6. ✅ Ready to use!

**That's it!** Both servers are now running and the application is ready.

---

### Option 2: Start Servers Separately (Alternative)

#### Start Backend:
1. Navigate to: `C:\Users\Syed\OneDrive\Desktop\Hotel\backend`
2. **Double-click** `start_backend.bat`
3. A terminal window will open showing the server status
4. ✅ Backend ready when you see: `Application startup complete`

#### Start Frontend:
1. Navigate to: `C:\Users\Syed\OneDrive\Desktop\Hotel\Frontend\Frontend`
2. **Double-click** `start_frontend.bat` 
3. ✅ Frontend ready when you see: `Local: http://localhost:5173/`

### Option 3: Manual Commands (Advanced)

#### Terminal 1 - Backend:
```bash
cd C:\Users\Syed\OneDrive\Desktop\Hotel\backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Terminal 2 - Frontend:
```bash
cd C:\Users\Syed\OneDrive\Desktop\Hotel\Frontend\Frontend
npm run dev
```

---

## 🌐 Access the Application

Once both servers are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Default Admin Credentials:
- **Email:** `trivara.admin.11@gmail.com`
- **Password:** `trivaraadmin1947`

---

## ❌ Troubleshooting

### Problem: "Failed to fetch" error when logging in

**Solution:**
- ✅ Make sure the **backend server is running** on port 8000
- Check if you see `Application startup complete` in the backend terminal
- Try accessing http://localhost:8000 in your browser - you should see a JSON message

### Problem: "Port 8000 is already in use"

**Solution:**
1. Check if backend is already running in another terminal
2. Or kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :8000
   taskkill /PID <PID_NUMBER> /F
   ```

### Problem: "Port 5173 is already in use"

**Solution:**
1. Check if frontend is already running
2. Press `Ctrl+C` in the frontend terminal to stop it
3. Or use a different port by editing `vite.config.js`

### Problem: Backend shows database errors

**Solution:**
1. Reset the database:
   ```bash
   cd C:\Users\Syed\OneDrive\Desktop\Hotel\backend
   python reset_db.py
   python create_admin.py
   ```

### Problem: Login error "Invalid credentials"

**Solution:**
- Default credentials: `trivara.admin.11@gmail.com` / `trivaraadmin1947`
- If still not working, recreate admin:
  ```bash
  python create_admin.py
  ```

### Problem: "Module not found" errors

**Solution:**
- **Backend:** `pip install -r requirements.txt`
- **Frontend:** `npm install`

---

## 🔄 Common Development Workflow

1. **Start your day:**
   - Run `start_backend.bat` (or manual command)
   - Run `npm run dev` in frontend folder

2. **Make changes:**
   - Both servers auto-reload when you save files
   - No need to restart manually

3. **End your day:**
   - Press `Ctrl+C` in both terminal windows
   - Close the terminals

---

## 📝 Important Notes

- **ALWAYS start the backend first**, then the frontend
- Keep both terminal windows open while developing
- The backend must be running for login/registration to work
- If you see "Failed to fetch", check the backend server status

---

## 🆘 Still Having Issues?

1. Make sure both Python and Node.js are installed
2. Check that you're in the correct directories
3. Verify no firewall is blocking ports 8000 or 5173
4. Try restarting your computer and following the steps again

---

## 📞 Quick Reference

| Component | Port | URL |
|-----------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 8000 | http://localhost:8000 |
| API Documentation | 8000 | http://localhost:8000/docs |

**Remember:** Backend server must be running for the application to work! 🎯
