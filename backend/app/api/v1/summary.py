from fastapi import APIRouter, Depends
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.dependencies import get_summary_service
from app.services.summary_service import SummaryService

router = APIRouter()

class SummaryRequest(BaseModel):
    session_id: str
    target_language: str = "English"

class SaveSummaryRequest(BaseModel):
    session_id: str
    analysis_data: Dict[str, Any]

@router.post("/generate")
async def generate_summary(
    req: SummaryRequest,
    service: SummaryService = Depends(get_summary_service)
):
    """
    Trigger AI analysis for the current session.
    """
    return await service.generate_session_analysis(
        session_id=req.session_id,
        target_language=req.target_language
    )

@router.get("/{session_id}")
async def get_summary(
    session_id: str,
    service: SummaryService = Depends(get_summary_service)
):
    """
    Retrieve the latest summary for a session.
    """
    return service.get_summary(session_id)

@router.post("/save")
async def save_summary(
    req: SaveSummaryRequest,
    service: SummaryService = Depends(get_summary_service)
):
    """
    Permanently save the approved summary and clear temporary memory.
    """
    service.save_summary(req.session_id, req.analysis_data)
    return {"status": "success", "message": "Summary saved and temporary session cleared"}
