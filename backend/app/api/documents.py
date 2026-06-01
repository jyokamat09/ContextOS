from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.document import Document, DocumentChunk
from app.schemas.document import DocumentResponse
from app.services.pdf_service import extract_text_from_pdf, chunk_text
import shutil
import os

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
def upload_pdf(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text = extract_text_from_pdf(file_path)
    chunks = chunk_text(text)
    
    document = Document(filename=file.filename, content=text, user_id=user_id)
    db.add(document)
    db.commit()
    db.refresh(document)
    
    for i, chunk in enumerate(chunks):
        db_chunk = DocumentChunk(document_id=document.id, chunk_index=i, content=chunk)
        db.add(db_chunk)
    db.commit()
    
    return document

@router.get("/list")
def list_documents(user_id: int, db: Session = Depends(get_db)):
    documents = db.query(Document).filter(Document.user_id == user_id).all()
    return documents