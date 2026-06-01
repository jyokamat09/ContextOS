from fastapi import FastAPI
from app.db.database import Base, engine
from app.models import user
from app.api import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/")
def root():
    return {"message": "ContextOS is alive"}

@app.get("/health")
def health():
    return {"status": "ok"}