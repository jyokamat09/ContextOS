from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.rag_service import ask_question
from pydantic import BaseModel

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str
    document_id: int

@router.post("/ask")
def ask(request: QuestionRequest, db: Session = Depends(get_db)):
    result = ask_question(request.question, request.document_id, db)
    return result