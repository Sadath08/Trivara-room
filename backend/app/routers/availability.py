"""
Router for Room Availability & Calendar Management
Host calendar for setting blocked dates and per-date pricing
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import List
from .. import models, schemas_extended
from ..database import get_db
from .. import auth

router = APIRouter(prefix="/api/availability", tags=["calendar"])

@router.post("", response_model=schemas_extended.RoomAvailabilityResponse)
def set_room_availability(
    availability: schemas_extended.RoomAvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Set availability for a specific date (host only)"""
    # Verify user is host of this room
    room = db.query(models.Room).filter(
        models.Room.id == availability.room_id,
        models.Room.host_id == current_user.id
    ).first()
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or you're not the host")
    
    # Check if availability already exists for this date
    existing = db.query(models.RoomAvailability).filter(
        models.RoomAvailability.room_id == availability.room_id,
        models.RoomAvailability.date == availability.date
    ).first()
    
    if existing:
        # Update existing
        existing.is_available = availability.is_available
        existing.price_override = availability.price_override
        existing.notes = availability.notes
        db.commit()
        db.refresh(existing)
        return existing
    
    # Create new
    db_availability = models.RoomAvailability(**availability.dict())
    db.add(db_availability)
    db.commit()
    db.refresh(db_availability)
    
    return db_availability

@router.get("/room/{room_id}", response_model=List[schemas_extended.RoomAvailabilityResponse])
def get_room_availability(
    room_id: int,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    """Get availability for a room within a date range"""
    availability = db.query(models.RoomAvailability).filter(
        models.RoomAvailability.room_id == room_id,
        models.RoomAvailability.date >= start_date,
        models.RoomAvailability.date <= end_date
    ).all()
    
    return availability

@router.put("/room/{room_id}/date/{target_date}", response_model=schemas_extended.RoomAvailabilityResponse)
def update_date_availability(
    room_id: int,
    target_date: date,
    update: schemas_extended.RoomAvailabilityUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Update availability for a specific date (host only)"""
    # Verify host
    room = db.query(models.Room).filter(
        models.Room.id == room_id,
        models.Room.host_id == current_user.id
    ).first()
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or you're not the host")
    
    availability = db.query(models.RoomAvailability).filter(
        models.RoomAvailability.room_id == room_id,
        models.RoomAvailability.date == target_date
  ).first()
    
    if not availability:
        raise HTTPException(status_code=404, detail="Availability record not found")
    
    # Update fields
    if update.is_available is not None:
        availability.is_available = update.is_available
    if update.price_override is not None:
        availability.price_override = update.price_override
    if update.notes is not None:
        availability.notes = update.notes
    
    db.commit()
    db.refresh(availability)
    
    return availability

@router.post("/room/{room_id}/block-dates")
def block_dates_bulk(
    room_id: int,
    start_date: date,
    end_date: date,
    notes: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Block multiple dates at once (host only)"""
    # Verify host
    room = db.query(models.Room).filter(
        models.Room.id == room_id,
        models.Room.host_id == current_user.id
    ).first()
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or you're not the host")
    
    # Create availability records for each date
    current_date = start_date
    created_count = 0
    
    while current_date <= end_date:
        # Check if exists
        existing = db.query(models.RoomAvailability).filter(
            models.RoomAvailability.room_id == room_id,
            models.RoomAvailability.date == current_date
        ).first()
        
        if existing:
            existing.is_available = False
            existing.notes = notes
        else:
            new_availability = models.RoomAvailability(
                room_id=room_id,
                date=current_date,
                is_available=False,
                notes=notes
            )
            db.add(new_availability)
            created_count += 1
        
        current_date += timedelta(days=1)
    
    db.commit()
    
    return {"message": f"Blocked {(end_date - start_date).days + 1} dates", "created": created_count}
