from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    rating = Column(String, nullable=False)  # "up" or "down"
    created_at = Column(DateTime(timezone=True), server_default=func.now())