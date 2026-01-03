import requests

BASE_URL = "http://localhost:8000"

def test_login():
    # 1. Register a new test user
    email = "test_debug_login@example.com"
    password = "password123"
    
    print(f"Attr: Registering {email}...")
    reg_response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": password,
        "role": "user"
    })
    
    if reg_response.status_code == 200:
        print("Registration successful.")
    elif reg_response.status_code == 400 and "already registered" in reg_response.text:
         print("User already exists, proceeding to login.")
    else:
        print(f"Registration failed: {reg_response.status_code} {reg_response.text}")
        return

    # 2. Login
    print("Attr: Logging in...")
    login_data = {
        "username": email,
        "password": password
    }
    
    login_response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    
    if login_response.status_code == 200:
        print("Login SUCCESS!")
        print(login_response.json())
    else:
        print(f"Login FAILED: {login_response.status_code}")
        print(login_response.text)

if __name__ == "__main__":
    try:
        test_login()
    except Exception as e:
        print(f"Error: {e}")
