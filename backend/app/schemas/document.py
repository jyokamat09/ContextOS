from pydantic import BaseModel

class DocumentResponse(BaseModel):
    id: int
    filename: str
    user_id: int

    class Config:
        from_attributes = True

class ChunkResponse(BaseModel):
    id: int
    document_id: int
    chunk_index: int
    content: str

    class Config:
        from_attributes = True