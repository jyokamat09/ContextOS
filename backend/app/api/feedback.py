from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.feedback import Feedback
from pydantic import BaseModel

router = APIRouter()

class FeedbackRequest(BaseModel):
    user_id: int
    document_id: int
    question: str
    answer: str
    rating: str  # "up" or "down"

@router.post("/submit")
def submit_feedback(request: FeedbackRequest, db: Session = Depends(get_db)):
    feedback = Feedback(
        user_id=request.user_id,
        document_id=request.document_id,
        question=request.question,
        answer=request.answer,
        rating=request.rating
    )
    db.add(feedback)
    db.commit()
    return {"message": "Feedback recorded", "rating": request.rating}

@router.get("/document/{document_id}")
def get_feedback(document_id: int, db: Session = Depends(get_db)):
    feedback = db.query(Feedback).filter(Feedback.document_id == document_id).all()
    return feedback