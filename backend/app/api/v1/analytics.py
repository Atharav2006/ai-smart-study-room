from fastapi import APIRouter, Depends
from app.dependencies import get_analytics_service
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/signals/{session_id}")
async def get_skill_signals(
    session_id: str,
    service: AnalyticsService = Depends(get_analytics_service)
):
    """
    Fetch skill signals and knowledge levels.
    """
    return service.get_skill_signals(session_id)

@router.get("/stats/{session_id}")
async def get_session_stats(
    session_id: str,
    service: AnalyticsService = Depends(get_analytics_service)
):
    """
    Fetch high-level session statistics.
    """
    return service.get_session_stats(session_id)

@router.get("/engagement/{session_id}")
async def get_session_analytics(
    session_id: str,
    service: AnalyticsService = Depends(get_analytics_service)
):
    """
    Fetch detailed engagement analytics.
    """
    return service.get_session_analytics(session_id)
