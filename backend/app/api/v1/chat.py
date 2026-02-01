from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from app.dependencies import get_chat_service
from app.services.chat_service import ChatService

router = APIRouter()

class MessageCreate(BaseModel):
    session_id: str
    user_id: str
    role: str
    content: str

@router.post("/send")
async def send_message(
    msg: MessageCreate, 
    service: ChatService = Depends(get_chat_service)
):
    """
    Endpoint to send a message to a study room.
    """
    return service.post_message(
        session_id=msg.session_id,
        user_id=msg.user_id,
        role=msg.role,
        content=msg.content
    )

@router.get("/history/{session_id}")
async def get_chat_history(
    session_id: str, 
    service: ChatService = Depends(get_chat_service)
):
    """
    Endpoint to retrieve chat history for a session.
    """
    return service.get_history(session_id)

@router.delete("/clear/{session_id}")
async def clear_chat(
    session_id: str, 
    service: ChatService = Depends(get_chat_service)
):
    """
    Endpoint to clear session data (privacy-first).
    """
    service.clear_session(session_id)
    return {"status": "success", "message": f"Session {session_id} cleared"}
