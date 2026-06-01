from fastapi import FastAPI
from app.db.database import Base, engine
from app.models import user, document
from app.api import auth, documents, chat

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(documents.router, prefix="/documents", tags=["documents"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])

@app.get("/")
def root():
    return {"message": "ContextOS is alive"}

@app.get("/health")
def health():
    return {"status": "ok"}