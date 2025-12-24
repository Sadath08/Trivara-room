from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, database, crud, auth, models

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

@router.post("/", response_model=schemas.BookingResponse)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    try:
        # Log the user making the booking for debugging
        print(f"Creating booking for user: {current_user.email}")
        print(f"Booking data: {booking.model_dump()}")
        
        room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        if not room.is_available:
             raise HTTPException(status_code=400, detail="Room is not available")

        # Dynamic Pricing Logic
        delta = booking.end_date - booking.start_date
        days = delta.days
        if days <= 0:
             raise HTTPException(status_code=400, detail="Invalid booking dates")
        
        total_price = days * room.price

        # Mock Payment Processing
        # In production, integrate with actual payment gateway
        
        # Determine payment and booking status based on payment method
        if booking.payment_method == "qr_code":
            # For QR code payments, mark as pending until payment is confirmed
            # In production, integrate with UPI payment gateway
            payment_status = "pending"
            booking_status = "pending"
        elif booking.payment_method == "pay_on_site":
            # For pay on site, booking is confirmed but payment is pending
            payment_status = "pending"
            booking_status = "confirmed"
        else:
            # Default to pending for unknown payment methods
            payment_status = "pending"
            booking_status = "pending"
        
        result = crud.create_booking(
            db=db, 
            booking=booking, 
            user_id=current_user.id, 
            total_price=total_price,
            payment_status=payment_status,
            booking_status=booking_status
        )
        
        print(f"Booking created successfully: ID {result.id}")
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the actual error
        print(f"ERROR creating booking: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/", response_model=List[schemas.BookingResponse])
def read_bookings(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
     return crud.get_user_bookings(db, user_id=current_user.id)
