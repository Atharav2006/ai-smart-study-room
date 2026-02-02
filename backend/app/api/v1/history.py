from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel
from app.dependencies import get_supabase_storage, get_summary_service
from app.storage.supabase_storage import SupabaseStorage
from app.services.summary_service import SummaryService
from app.services.history_service import HistoryService

router = APIRouter()

def get_history_service(storage: SupabaseStorage = Depends(get_supabase_storage)) -> HistoryService:
    return HistoryService(storage)

class EndSessionRequest(BaseModel):
    room_id: str

@router.get("/sessions/{room_id}")
async def get_session_history(
    room_id: str,
    history_service: HistoryService = Depends(get_history_service)
):
    """
    Get a list of past sessions for a specific room.
    """
    return history_service.get_session_history(room_id)

@router.post("/end")
async def end_session(
    req: EndSessionRequest,
    summary_service: SummaryService = Depends(get_summary_service),
    history_service: HistoryService = Depends(get_history_service)
):
    """
    End the current session:
    1. Generate final summary
    2. Archive the session to history
    3. Clear the active room messages
    """
    # 1. Generate final analysis
    analysis = await summary_service.generate_session_analysis(req.room_id)
    
    if "error" in analysis:
        # If generation fails (e.g. no messages), we might still want to clear?
        # But usually we'd want to warn.
        # However, for "End Session", if there are no messages, we just clear and return empty.
        # But let's proceed with archiving whatever we have or just skipping archival if empty.
        pass

    # 2. Archive
    # We always archive, even if it was short, to verify "Session Ended".
    # Only skip if totally empty/error?
    # Let's archive if we have valid analysis data, even if minimal.
    
    success = await history_service.archive_session(req.room_id, analysis)
    
    if not success:
        # It might fail if table doesn't exist, but we still return the analysis so frontend can show summary.
        # We also cleared the session in 'archive_session' only if save was successful.
        # If save failed, we might NOT want to clear, to prevent data loss.
        # But if the user really wants to end... 
        pass

    return {
        "status": "success",
        "analysis": analysis,
        "archived": success
    }
