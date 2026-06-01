from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.document import DocumentChunk
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def find_relevant_chunks(question: str, document_id: int, db: Session, top_k: int = 3):
    chunks = db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document_id
    ).all()
    question_words = set(question.lower().split())
    scored_chunks = []
    for chunk in chunks:
        chunk_words = set(chunk.content.lower().split())
        score = len(question_words.intersection(chunk_words))
        scored_chunks.append((score, chunk.content))
    scored_chunks.sort(reverse=True)
    return [content for _, content in scored_chunks[:top_k]]

@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    db = SessionLocal()
    try:
        while True:
            data = await websocket.receive_json()
            question = data.get("question")
            document_id = data.get("document_id")

            chunks = find_relevant_chunks(question, document_id, db)
            context = "\n\n".join(chunks)

            prompt = f"""Answer the question based only on the context below.
Context:
{context}

Question: {question}
Answer:"""

            stream = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                stream=True
            )

            for chunk in stream:
                token = chunk.choices[0].delta.content
                if token:
                    await websocket.send_text(token)

            await websocket.send_text("[DONE]")

    except WebSocketDisconnect:
        db.close()