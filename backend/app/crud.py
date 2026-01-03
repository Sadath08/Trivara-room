from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_room(db: Session, room: schemas.RoomCreate, image_url: str = None, host_id: int = None):
    db_room = models.Room(**room.model_dump(), image_url=image_url, host_id=host_id)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def update_room(db: Session, room_id: int, room_update: schemas.RoomUpdate):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        return None
    
    update_data = room_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_room, key, value)
    
    db.commit()
    db.refresh(db_room)
    return db_room

def delete_room(db: Session, room_id: int):
    # Soft delete
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        return None
    
    db_room.is_deleted = True
    db.commit()
    return db_room

def get_rooms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Room).filter(models.Room.is_deleted == False).offset(skip).limit(limit).all()

def get_all_rooms_admin(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Room).filter(models.Room.is_deleted == False).offset(skip).limit(limit).all()

def get_user_bookings(db: Session, user_id: int):
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()

def create_booking(
    db: Session, 
    booking: schemas.BookingCreate, 
    user_id: int, 
    total_price: float,
    payment_status: str = "pending",
    booking_status: str = "pending"
):
    db_booking = models.Booking(
        user_id=user_id,
        room_id=booking.room_id,
        start_date=booking.start_date,
        end_date=booking.end_date,
        guests=booking.guests,
        total_price=total_price,
        status=booking_status,
        payment_method=booking.payment_method,
        payment_status=payment_status
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking
