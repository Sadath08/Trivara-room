"""
Database reset and initialization script
Run this to fix any database schema issues
"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base
from app import models
from app.auth import get_password_hash
from sqlalchemy.orm import Session

def reset_database():
    """Drop all tables and recreate them"""
    print("Dropping all existing tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating all tables with latest schema...")
    Base.metadata.create_all(bind=engine)
    
    print("Database reset complete!")
    print("Creating default admin user...")
    
    # Create admin user
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        admin = models.User(
            email="admin@hotel.com",
            full_name="Admin User",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        db.commit()
        print("Admin user created: admin@hotel.com / admin123")
    except Exception as e:
        print(f"Error creating admin: {e}")
    finally:
        db.close()
    
    print("\nDatabase is ready!")

if __name__ == "__main__":
    response = input("This will delete all data and recreate the database. Continue? (yes/no): ")
    if response.lower() == "yes":
        reset_database()
    else:
        print("Operation cancelled")
