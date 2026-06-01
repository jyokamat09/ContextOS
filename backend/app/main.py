from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.models import user, document, feedback
from app.api import auth, documents, chat, feedback, websocket

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(documents.router, prefix="/documents", tags=["documents"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(websocket.router, tags=["websocket"])

@app.get("/")
def root():
    return {"message": "ContextOS is alive"}

@app.get("/health")
def health():
    return {"status": "ok"}