from groq import Groq
from sqlalchemy.orm import Session
from app.models.document import DocumentChunk
import os
from dotenv import load_dotenv

load_dotenv()

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

def ask_question(question: str, document_id: int, db: Session) -> dict:
    relevant_chunks = find_relevant_chunks(question, document_id, db)
    
    if not relevant_chunks:
        return {"answer": "No relevant content found in the document.", "sources": []}
    
    context = "\n\n".join(relevant_chunks)
    
    prompt = f"""You are a helpful assistant. Answer the question based only on the context below.
If the answer is not in the context, say "I cannot find the answer in this document."

Context:
{context}

Question: {question}

Answer:"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500
    )
    
    return {
        "answer": response.choices[0].message.content,
        "sources": relevant_chunks
    }