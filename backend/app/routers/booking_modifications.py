"""
Router for Booking Modifications & Cancellations
Handles date changes, guest count updates, and cancellations with refund calculation
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
from .. import models, schemas_extended
from ..database import get_db
from .. import auth

router = APIRouter(prefix="/bookings/modifications", tags=["booking-modifications"])

def calculate_refund(booking: models.Booking, cancellation_date: datetime) -> float:
    """Calculate refund based on cancellation policy"""
    days_until_checkin = (booking.start_date - cancellation_date).days
    
    if booking.cancellation_policy == "flexible":
        # Full refund if cancelled 24+ hours before check-in
        if days_until_checkin >= 1:
            return booking.total_price
        else:
            return booking.total_price * 0.5  # 50% refund
    
    elif booking.cancellation_policy == "moderate":
        # Full refund if cancelled 5+ days before
        if days_until_checkin >= 5:
            return booking.total_price
        elif days_until_checkin >= 1:
            return booking.total_price * 0.5
        else:
            return 0.0
    
    elif booking.cancellation_policy == "strict":
        # Full refund if cancelled 14+ days before
        if days_until_checkin >= 14:
            return booking.total_price
        elif days_until_checkin >= 7:
            return booking.total_price * 0.5
        else:
            return 0.0
    
    return 0.0

@router.put("/{booking_id}/modify", response_model=schemas_extended.BookingModificationResponse)
def modify_booking(
    booking_id: int,
    modification: schemas_extended.BookingModificationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Modify an existing booking (dates or guests)"""
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.user_id == current_user.id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot modify cancelled booking")
    
    # Store old values
    old_start = booking.start_date
    old_end = booking.end_date
    old_guests = booking.guests
    old_price = booking.total_price
    
    # Calculate new price
    new_start = modification.new_start_date or booking.start_date
    new_end = modification.new_end_date or booking.end_date
    new_guests = modification.new_guests or booking.guests
    
    # Get room to calculate new price
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    nights = (new_end - new_start).days
    new_price = room.price * nights
    price_diff = new_price - old_price
    
    # Create modification record
    mod_record = models.BookingModification(
        booking_id=booking_id,
        old_start_date=old_start,
        old_end_date=old_end,
        new_start_date=new_start,
        new_end_date=new_end,
        old_guests=old_guests,
        new_guests=new_guests,
        old_price=old_price,
        new_price=new_price,
        price_difference=price_diff,
        modification_reason=modification.modification_reason,
        modified_by_user_id=current_user.id
    )
    
    # Update booking
    booking.start_date = new_start
    booking.end_date = new_end
    booking.guests = new_guests
    booking.total_price = new_price
    booking.status = "modified"
    booking.updated_at = datetime.utcnow()
    
    db.add(mod_record)
    db.commit()
    db.refresh(mod_record)
    
    return mod_record

@router.post("/{booking_id}/cancel", response_model=schemas_extended.CancellationResponse)
def cancel_booking(
    booking_id: int,
    cancellation: schemas_extended.BookingCancellation,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Cancel a booking with policy-based refund"""
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.user_id == current_user.id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Booking already cancelled")
    
    # Calculate refund
    refund = calculate_refund(booking, datetime.utcnow())
    
    # Update booking
    booking.status = "cancelled"
    booking.cancelled_at = datetime.utcnow()
    booking.cancellation_reason = cancellation.cancellation_reason
    booking.refund_amount = refund
    
    db.commit()
    
    return schemas_extended.CancellationResponse(
        booking_id=booking_id,
        status="cancelled",
        refund_amount=refund,
        cancellation_policy=booking.cancellation_policy,
        message=f"Booking cancelled. Refund amount: ₹{refund}"
    )

@router.get("/{booking_id}/history", response_model=List[schemas_extended.BookingModificationResponse])
def get_booking_history(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get modification history for a booking"""
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.user_id == current_user.id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    modifications = db.query(models.BookingModification).filter(
        models.BookingModification.booking_id == booking_id
    ).all()
    
    return modifications
