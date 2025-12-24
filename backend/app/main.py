from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, users, rooms, bookings, reviews, booking_modifications, availability

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hotel Management System API")

# CORS
origins = [
    "http://localhost",
    "http://localhost:5173", # Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files for Images
# We mount the directory relative to the project root where we run main.py from usually,
# or we use absolute path.
# Assuming running from 'backend' directory or root?
# Let's assume we run from 'backend' using `uvicorn app.main:app`
# then 'backend/static' is 'static'. 
# But let's be robust.
import os
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # backend/
static_dir = os.path.join(backend_dir, "static")

app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(rooms.router)
app.include_router(bookings.router)

# Phase 1 OTA Features
app.include_router(reviews.router)
app.include_router(booking_modifications.router)
app.include_router(availability.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Hotel Management API"}
