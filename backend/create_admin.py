from app.database import SessionLocal
from app import models, auth, schemas

def create_admin():
    db = SessionLocal()
    email = "trivara.admin.11@gmail.com"
    password = "trivaraadmin1947"
    
    # Check if admin exists
    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        print(f"Admin user {email} already exists.")
        return

    hashed_password = auth.get_password_hash(password)
    db_user = models.User(email=email, hashed_password=hashed_password, role="admin")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    print(f"Admin user created: {email} / {password}")
    db.close()

if __name__ == "__main__":
    create_admin()
