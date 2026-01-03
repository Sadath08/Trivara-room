import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

# Add current dir to path to find app
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Checking connection to: {DATABASE_URL}")

def check_static_dir():
    static_images = os.path.join(os.path.dirname(__file__), "static", "images")
    if not os.path.exists(static_images):
        print(f"Creating directory: {static_images}")
        os.makedirs(static_images)
    else:
        print(f"Static directory exists: {static_images}")

def check_db():
    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        print("Successfully connected to the database!")
        connection.close()
        return True
    except OperationalError as e:
        print("Error connecting to the database!")
        print(e)
        print("\nPossible fix: Check if PostgreSQL is running and the port (5432 vs 5173) is correct in .env")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

if __name__ == "__main__":
    check_static_dir()
    if check_db():
        print("\nYou can now start the server with:")
        print("cd backend")
        print("uvicorn app.main:app --reload")
        sys.exit(0)  # Success
    else:
        sys.exit(1)  # Failure
