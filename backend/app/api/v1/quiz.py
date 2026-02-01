from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.dependencies import get_quiz_service
from app.services.quiz_service import QuizService

router = APIRouter()

class QuizRequest(BaseModel):
    session_id: str

@router.post("/generate")
async def generate_quiz(
    req: QuizRequest,
    service: QuizService = Depends(get_quiz_service)
):
    """
    Generate assessment materials (MCQs, Flashcards) from the session.
    """
    return await service.generate_quiz(req.session_id)
