from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from .. import schemas, database, crud, auth, models
import shutil
import os
import uuid
import json

router = APIRouter(
    prefix="/rooms",
    tags=["rooms"]
)

IMAGEDIR = "static/images/"

@router.get("/", response_model=List[schemas.RoomResponse])
def read_rooms(
    skip: int = 0,
    limit: int = 100,
    # Filters
    property_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    bedrooms: Optional[int] = Query(None),
    beds: Optional[int] = Query(None),
    bathrooms: Optional[int] = Query(None),
    amenities: Optional[str] = Query(None),  # Comma-separated list
    booking_options: Optional[str] = Query(None),  # Comma-separated list
    is_guest_favourite: Optional[bool] = Query(None),
    is_luxe: Optional[bool] = Query(None),
    db: Session = Depends(database.get_db)
):
    """
    Get rooms with optional filters:
    - property_type: house, apartment, room, guest_house
    - min_price, max_price: price range
    - bedrooms, beds, bathrooms: minimum count
    - amenities: comma-separated (e.g., "wifi,pool,ac")
    - booking_options: comma-separated (e.g., "instant_book,self_checkin")
    - is_guest_favourite, is_luxe: special categories
    """
    query = db.query(models.Room).filter(models.Room.is_deleted == False)
    
    # Apply filters
    if property_type:
        query = query.filter(models.Room.property_type == property_type)
    
    if min_price is not None:
        query = query.filter(models.Room.price >= min_price)
    
    if max_price is not None:
        query = query.filter(models.Room.price <= max_price)
    
    if bedrooms is not None:
        query = query.filter(models.Room.bedrooms >= bedrooms)
    
    if beds is not None:
        query = query.filter(models.Room.beds >= beds)
    
    if bathrooms is not None:
        query = query.filter(models.Room.bathrooms >= bathrooms)
    
    if is_guest_favourite is not None:
        query = query.filter(models.Room.is_guest_favourite == is_guest_favourite)
    
    if is_luxe is not None:
        query = query.filter(models.Room.is_luxe == is_luxe)
    
    # Get results
    rooms = query.offset(skip).limit(limit).all()
    
    # Filter by amenities and booking options in Python (since JSON filtering in SQLite is limited)
    if amenities:
        required_amenities = set(amenities.split(','))
        rooms = [room for room in rooms if room.amenities and required_amenities.issubset(set(room.amenities))]
    
    if booking_options:
        required_options = set(booking_options.split(','))
        rooms = [room for room in rooms if room.booking_options and required_options.issubset(set(room.booking_options))]
    
    return rooms

@router.get("/{room_id}", response_model=schemas.RoomResponse)
def read_room(room_id: int, db: Session = Depends(database.get_db)):
    room = db.query(models.Room).filter(
        models.Room.id == room_id,
        models.Room.is_deleted == False
    ).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.post("/", response_model=schemas.RoomResponse)
async def create_room(
    title: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    original_price: float = Form(None),
    location: str = Form(None),
    property_type: str = Form("room"),
    bedrooms: int = Form(1),
    beds: int = Form(1),
    bathrooms: int = Form(1),
    max_guests: int = Form(2),
    amenities: str = Form("[]"),  # JSON string
    booking_options: str = Form("[]"),  # JSON string
    is_guest_favourite: str = Form("false"),  # Changed to str for FormData
    is_luxe: str = Form("false"),  # Changed to str for FormData
    file: UploadFile = File(None),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    try:
        image_url = None
        if file:
            # Preserve file extension (jpg, jpeg, png)
            file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else 'jpg'
            if file_ext not in ['jpg', 'jpeg', 'png']:
                file_ext = 'jpg'  # Default to jpg for unsupported types
            file.filename = f"{uuid.uuid4()}.{file_ext}"
            contents = await file.read()
            
            os.makedirs(IMAGEDIR, exist_ok=True)
            
            with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
                f.write(contents)
            image_url = f"/static/images/{file.filename}"

        # Parse JSON strings
        amenities_list = json.loads(amenities) if amenities else []
        booking_options_list = json.loads(booking_options) if booking_options else []
        
        # Convert string booleans to actual booleans
        is_guest_favourite_bool = is_guest_favourite.lower() in ('true', '1', 'yes')
        is_luxe_bool = is_luxe.lower() in ('true', '1', 'yes')

        room_data = schemas.RoomCreate(
            title=title,
            description=description,
            price=price,
            original_price=original_price,
            location=location,
            property_type=property_type,
            bedrooms=bedrooms,
            beds=beds,
            bathrooms=bathrooms,
            max_guests=max_guests,
            amenities=amenities_list,
            booking_options=booking_options_list,
            is_guest_favourite=is_guest_favourite_bool,
            is_luxe=is_luxe_bool
        )
        return crud.create_room(db=db, room=room_data, image_url=image_url, host_id=current_user.id)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON in amenities or booking_options: {str(e)}")
    except Exception as e:
        print(f"Error creating room: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/{room_id}", response_model=schemas.RoomResponse)
async def update_room(
    room_id: int,
    title: str = Form(None),
    description: str = Form(None),
    price: float = Form(None),
    original_price: float = Form(None),
    location: str = Form(None),
    property_type: str = Form(None),
    bedrooms: int = Form(None),
    beds: int = Form(None),
    bathrooms: int = Form(None),
    max_guests: int = Form(None),
    amenities: str = Form(None),
    booking_options: str = Form(None),
    is_guest_favourite: bool = Form(None),
    is_luxe: bool = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    # Get existing room
    db_room = db.query(models.Room).filter(
        models.Room.id == room_id,
        models.Room.is_deleted == False
    ).first()
    
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Handle image upload if provided
    if file and file.filename:
        file.filename = f"{uuid.uuid4()}.jpg"
        contents = await file.read()
        os.makedirs(IMAGEDIR, exist_ok=True)
        with open(f"{IMAGEDIR}{file.filename}", "wb") as f:
            f.write(contents)
        db_room.image_url = f"/static/images/{file.filename}"
    
    # Update fields if provided
    if title is not None:
        db_room.title = title
    if description is not None:
        db_room.description = description
    if price is not None:
        db_room.price = price
    if original_price is not None:
        db_room.original_price = original_price
    if location is not None:
        db_room.location = location
    if property_type is not None:
        db_room.property_type = property_type
    if bedrooms is not None:
        db_room.bedrooms = bedrooms
    if beds is not None:
        db_room.beds = beds
    if bathrooms is not None:
        db_room.bathrooms = bathrooms
    if max_guests is not None:
        db_room.max_guests = max_guests
    if amenities is not None:
        db_room.amenities = json.loads(amenities) if amenities else []
    if booking_options is not None:
        db_room.booking_options = json.loads(booking_options) if booking_options else []
    if is_guest_favourite is not None:
        db_room.is_guest_favourite = is_guest_favourite
    if is_luxe is not None:
        db_room.is_luxe = is_luxe
    
    db.commit()
    db.refresh(db_room)
    return db_room

@router.delete("/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_admin_user)
):
    db_room = crud.delete_room(db, room_id=room_id)
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"message": "Room deleted successfully"}
