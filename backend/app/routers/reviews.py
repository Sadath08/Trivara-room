"""
Router for Reviews & Ratings
Handles review submission, retrieval, and moderate
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas_extended, auth
from ..database import get_db

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

@router.post("", response_model=schemas_extended.ReviewResponse)
def create_review(
    review: schemas_extended.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Create a review for a room after completing a booking"""
    # Verify booking exists and belongs to current user
    booking = db.query(models.Booking).filter(
        models.Booking.id == review.booking_id,
        models.Booking.user_id == current_user.id,
        models.Booking.status == "completed"
    ).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found or not eligible for review"
        )
    
    # Check if review already exists
    existing_review = db.query(models.Review).filter(
        models.Review.booking_id == review.booking_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review already submitted for this booking"
        )
    
    # Create review
    db_review = models.Review(
        booking_id=review.booking_id,
        user_id=current_user.id,
        room_id=review.room_id,
        rating=review.rating,
        comment=review.comment,
        is_verified=True  # Auto-verify since it's from confirmed booking
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return db_review

@router.get("/room/{room_id}", response_model=List[schemas_extended.ReviewWithUser])
def get_room_reviews(
    room_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get all approved reviews for a specific room"""
    reviews = db.query(models.Review).filter(
        models.Review.room_id == room_id,
        models.Review.is_approved == True
    ).offset(skip).limit(limit).all()
    
    # Enhance with user info
    result = []
    for review in reviews:
        user = db.query(models.User).filter(models.User.id == review.user_id).first()
        review_dict = {
            **review.__dict__,
            "user_name": user.full_name if user else "Anonymous",
            "user_email": user.email if user else None
        }
        result.append(review_dict)
    
    return result

@router.get("/user/my-reviews", response_model=List[schemas_extended.ReviewResponse])
def get_my_reviews(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get all reviews submitted by current user"""
    reviews = db.query(models.Review).filter(
        models.Review.user_id == current_user.id
    ).all()
    
    return reviews

@router.put("/{review_id}/moderate")
def moderate_review(
    review_id: int,
    is_approved: bool,
    is_flagged: bool = False,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Moderate a review (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can moderate reviews"
        )
    
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.is_approved = is_approved
    review.is_flagged = is_flagged
    db.commit()
    
    return {"message": "Review moderated successfully"}
