from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, DateTime, Text, JSON, Date, Enum
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime
import enum

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user") # 'admin' or 'user'
    is_active = Column(Boolean, default=True)

    bookings = relationship("Booking", back_populates="user")

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    
    # Pricing
    price = Column(Float, nullable=False) # Per night price
    original_price = Column(Float, nullable=True) # Original/MRP price
    
    # Location
    location = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)  # For map-based discovery
    longitude = Column(Float, nullable=True)
    
    # Property Details
    property_type = Column(String, nullable=True, default="room") # house, apartment, room, guest_house
    bedrooms = Column(Integer, nullable=True, default=1)
    beds = Column(Integer, nullable=True, default=1)
    bathrooms = Column(Integer, nullable=True, default=1)
    max_guests = Column(Integer, nullable=True, default=2)
    
    # Amenities (stored as JSON array)
    amenities = Column(JSON, nullable=True, default=list) # ["wifi", "ac", "parking", "pool", etc.]
    
    # Booking Options (stored as JSON array)
    booking_options = Column(JSON, nullable=True, default=list) # ["instant_book", "self_checkin", "allows_pets"]
    
    # Special Categories
    is_guest_favourite = Column(Boolean, default=False)
    is_luxe = Column(Boolean, default=False)
    
    # Images
    image_url = Column(String, nullable=True)
    images = Column(JSON, nullable=True, default=list) # Array of image URLs
    
    # Status
    is_available = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)
    
    # Host
    host_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    host = relationship("User", foreign_keys=[host_id])

    bookings = relationship("Booking", back_populates="room")
    reviews = relationship("Review", back_populates="room")
    availability = relationship("RoomAvailability", back_populates="room")

# Enums for status
class BookingStatusEnum(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    MODIFIED = "modified"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, default="pending") # pending, confirmed, modified, cancelled, completed
    guests = Column(Integer, default=1)
    
    # Payment fields
    payment_method = Column(String, nullable=True) # "qr_code", "pay_on_site"
    payment_status = Column(String, default="pending") # "pending", "completed", "failed"
    transaction_id = Column(String, nullable=True) # For tracking UPI transactions
    
    # Cancellation policy
    cancellation_policy = Column(String, default="flexible") # flexible, moderate, strict
    cancelled_at = Column(DateTime, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    refund_amount = Column(Float, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
    modifications = relationship("BookingModification", back_populates="booking")
    review = relationship("Review", back_populates="booking", uselist=False)

class BookingModification(Base):
    """Track booking modifications history"""
    __tablename__ = "booking_modifications"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    
    # Old vs New values
    old_start_date = Column(DateTime)
    old_end_date = Column(DateTime)
    new_start_date = Column(DateTime)
    new_end_date = Column(DateTime)
    
    old_guests = Column(Integer)
    new_guests = Column(Integer)
    
    old_price = Column(Float)
    new_price = Column(Float)
    price_difference = Column(Float)  # positive = user pays more, negative = refund
    
    modification_reason = Column(Text, nullable=True)
    modified_at = Column(DateTime, default=datetime.utcnow)
    modified_by_user_id = Column(Integer, ForeignKey("users.id"))
    
    booking = relationship("Booking", back_populates="modifications")

class Review(Base):
    """Reviews and ratings for rooms"""
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True)  # One review per booking
    user_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    
    # Moderation
    is_verified = Column(Boolean, default=True)  # Auto-verified if from confirmed booking
    is_approved = Column(Boolean, default=True)  # For admin moderation
    is_flagged = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User")
    room = relationship("Room", back_populates="reviews")
    booking = relationship("Booking", back_populates="review")

class RoomAvailability(Base):
    """Calendar-based availability and pricing"""
    __tablename__ = "room_availability"
    
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    date = Column(Date, nullable=False)
    
    is_available = Column(Boolean, default=True)
    price_override = Column(Float, nullable=True)  # Override default room price for this date
    
    # For host to add notes
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    room = relationship("Room", back_populates="availability")

