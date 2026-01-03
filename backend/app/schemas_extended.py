"""
Extended schemas for Phase 1 OTA features:
- Reviews & Ratings
- Booking Modifications
- Room Availability (Calendar)
"""
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime, date

# Review Schemas
class ReviewBase(BaseModel):
    rating: int  # 1-5
    comment: Optional[str] = None
    
    @validator('rating')
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

class ReviewCreate(ReviewBase):
    room_id: int
    booking_id: int

class ReviewResponse(ReviewBase):
    id: int
    user_id: int
    room_id: int
    booking_id: int
    is_verified: bool
    is_approved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReviewWithUser(ReviewResponse):
    """Review with user information"""
    user_name: Optional[str] = None
    user_email: Optional[str] = None

# Room Availability Schemas
class RoomAvailabilityBase(BaseModel):
    date: date
    is_available: bool = True
    price_override: Optional[float] = None
    notes: Optional[str] = None

class RoomAvailabilityCreate(RoomAvailabilityBase):
    room_id: int

class RoomAvailabilityUpdate(BaseModel):
    is_available: Optional[bool] = None
    price_override: Optional[float] = None
    notes: Optional[str] = None

class RoomAvailabilityResponse(RoomAvailabilityBase):
    id: int
    room_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Booking Modification Schemas
class BookingModificationCreate(BaseModel):
    new_start_date: Optional[datetime] = None
    new_end_date: Optional[datetime] = None
    new_guests: Optional[int] = None
    modification_reason: Optional[str] = None

class BookingModificationResponse(BaseModel):
    id: int
    booking_id: int
    old_start_date: datetime
    old_end_date: datetime
    new_start_date: datetime
    new_end_date: datetime
    old_guests: int
    new_guests: int
    old_price: float
    new_price: float
    price_difference: float
    modification_reason: Optional[str] = None
    modified_at: datetime
    
    class Config:
        from_attributes = True

# Booking Cancellation Schema
class BookingCancellation(BaseModel):
    cancellation_reason: Optional[str] = None

class CancellationResponse(BaseModel):
    booking_id: int
    status: str
    refund_amount: float
    cancellation_policy: str
    message: str

# Extended Room Schema with coordinates
class RoomCreateExtended(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
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

class RoomResponseExtended(RoomCreateExtended):
    id: int
    image_url: Optional[str] = None
    images: Optional[List[str]] = []
    host_id: Optional[int] = None
    average_rating: Optional[float] = None
    review_count: Optional[int] = None
    
    class Config:
        from_attributes = True

# Search Autocomplete Schema
class SearchSuggestion(BaseModel):
    type: str  # "location", "property", "destination"
    value: str
    display_text: str
    metadata: Optional[dict] = None
