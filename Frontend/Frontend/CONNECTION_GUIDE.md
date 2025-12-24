# Frontend-Backend Connection Guide

## ✅ What Has Been Connected

### 1. Authentication System ✓
- **Login**: Connected to `/api/v1/auth/login`
- **Register**: Connected to `/api/v1/auth/register`
- **Token Management**: Automatic token storage and refresh
- **Auth Context**: Global authentication state management

### 2. API Service Layer ✓
- **`src/services/api.js`**: Centralized API client
  - Automatic token injection
  - Token refresh on 401 errors
  - Error handling
  - Base URL configuration

### 3. Authentication Context ✓
- **`src/context/AuthContext.jsx`**: React Context for auth
  - User state management
  - Login/logout functions
  - Auth state persistence

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the Frontend directory:

```bash
VITE_API_URL=http://localhost:8000/api/v1
```

### 2. Start Backend

```bash
cd Backend
# Setup backend (see Backend/README.md)
uvicorn app.main:app --reload
```

Backend should be running on `http://localhost:8000`

### 3. Start Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend should be running on `http://localhost:5173`

## 🔌 API Connection Status

### ✅ Fully Connected
- **Authentication**: Login, Register, Logout
- **Token Management**: Storage, Refresh, Auto-retry

### 🔄 Partially Connected (Mock Data Fallback)
- **Properties**: API structure ready, using mock data until backend endpoints complete
- **Bookings**: API structure ready, using mock data
- **User Profile**: API structure ready

### 📝 To Complete Connection

1. **Update Property Endpoints**:
   - Complete backend property endpoints
   - Update `useProperties` hook to use real API
   - Update `Listings.jsx` to fetch from API

2. **Update Booking Flow**:
   - Complete backend booking endpoints
   - Connect booking creation to API
   - Update `Booking.jsx` to use real API

3. **Update Property Details**:
   - Connect property details to API
   - Update `PropertyDetails.jsx` to fetch from API

## 🧪 Testing the Connection

### 1. Test Registration

1. Go to http://localhost:5173/signup
2. Fill in the form:
   - Email: `test@example.com`
   - Name: `Test User`
   - Password: `testpass123`
   - Confirm Password: `testpass123`
3. Submit
4. Should redirect to login page

### 2. Test Login

1. Go to http://localhost:5173/login
2. Use credentials from registration
3. Should redirect to dashboard on success

### 3. Check Authentication State

- Navbar should show user name when logged in
- Dashboard should be accessible
- Logout should work

## 📁 Files Created/Modified

### New Files
- `Frontend/src/services/api.js` - API client
- `Frontend/src/context/AuthContext.jsx` - Auth context
- `Frontend/src/hooks/useProperties.js` - Properties hook
- `Frontend/.env.example` - Environment template

### Modified Files
- `Frontend/src/App.jsx` - Added AuthProvider wrapper
- `Frontend/src/pages/Login.jsx` - Connected to backend API
- `Frontend/src/pages/Signup.jsx` - Connected to backend API

## 🔐 Authentication Flow

```
User Login
  ↓
Call authAPI.login(email, password)
  ↓
Backend validates credentials
  ↓
Returns access_token + refresh_token
  ↓
Tokens stored in localStorage
  ↓
User state updated in AuthContext
  ↓
Protected routes accessible
```

## 🔄 Token Refresh Flow

```
API Request
  ↓
401 Unauthorized
  ↓
Auto-refresh with refresh_token
  ↓
New tokens received
  ↓
Retry original request
  ↓
Success
```

## 🚨 Troubleshooting

### CORS Errors
- Check backend CORS settings in `Backend/app/core/config.py`
- Ensure frontend URL is in `CORS_ORIGINS`

### Connection Refused
- Verify backend is running on port 8000
- Check `VITE_API_URL` in `.env` file

### 401 Errors
- Check token is being sent in headers
- Verify token hasn't expired
- Check refresh token logic

### Mock Data Still Showing
- Backend endpoints not yet implemented
- Using fallback to mock data
- Will automatically switch when endpoints ready

## 📚 Next Steps

1. **Complete Backend Endpoints**:
   - Properties CRUD
   - Bookings creation/management
   - Reviews system

2. **Update Frontend Hooks**:
   - Switch from mock data to real API calls
   - Add proper error handling
   - Add loading states

3. **Add Protected Routes**:
   - Require authentication for certain pages
   - Redirect to login if not authenticated

4. **Add Real-time Updates**:
   - WebSocket for booking notifications
   - Real-time property availability

---

**Status**: Authentication is fully connected! Property and booking endpoints are structured and ready to connect once backend endpoints are complete.

