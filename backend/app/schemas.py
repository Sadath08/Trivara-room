from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
import re

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# User
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    full_name: Optional[str] = None
    role: str = "user"
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)')
        return v

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    full_name: Optional[str] = None
    is_active: bool
    role: str

    class Config:
        from_attributes = True

# Room
class RoomBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    location: Optional[str] = None
    property_type: Optional[str] = "room"
    bedrooms: Optional[int] = 1
    beds: Optional[int] = 1
    bathrooms: Optional[int] = 1
    max_guests: Optional[int] = 2
    amenities: Optional[List[str]] = []
    booking_options: Optional[List[str]] = []
    is_guest_favourite: Optional[bool] = False
    is_luxe: Optional[bool] = False
    is_available: bool = True

class RoomCreate(RoomBase):
    pass

class RoomUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    bedrooms: Optional[int] = None
    beds: Optional[int] = None
    bathrooms: Optional[int] = None
    max_guests: Optional[int] = None
    amenities: Optional[List[str]] = None
    booking_options: Optional[List[str]] = None
    is_guest_favourite: Optional[bool] = None
    is_luxe: Optional[bool] = None
    is_available: Optional[bool] = None

class RoomResponse(RoomBase):
    id: int
    image_url: Optional[str] = None
    images: Optional[List[str]] = []
    host_id: Optional[int] = None

    class Config:
        from_attributes = True

# Booking
class BookingBase(BaseModel):
    room_id: int
    start_date: datetime
    end_date: datetime
    guests: Optional[int] = 1

class BookingCreate(BookingBase):
    payment_method: Optional[str] = "pay_on_site"

class BookingResponse(BookingBase):
    id: int
    user_id: int
    total_price: float
    status: str
    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    transaction_id: Optional[str] = None

    class Config:
        from_attributes = True
