"""
Database migration script to add latitude and longitude columns to rooms table
"""
from sqlalchemy import text
from app.database import engine

def add_missing_columns():
    with engine.connect() as conn:
        try:
            # Add latitude column if it doesn't exist
            conn.execute(text("""
                ALTER TABLE rooms 
                ADD COLUMN IF NOT EXISTS latitude FLOAT;
            """))
            conn.commit()
            print("✓ Added latitude column")
        except Exception as e:
            print(f"Error adding latitude: {e}")
        
        try:
            # Add longitude column if it doesn't exist
            conn.execute(text("""
                ALTER TABLE rooms 
                ADD COLUMN IF NOT EXISTS longitude FLOAT;
            """))
            conn.commit()
            print("✓ Added longitude column")
        except Exception as e:
            print(f"Error adding longitude: {e}")

if __name__ == "__main__":
    print("Adding missing columns to rooms table...")
    add_missing_columns()
    print("Migration complete!")
