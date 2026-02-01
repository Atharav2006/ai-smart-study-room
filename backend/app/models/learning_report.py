from pydantic import BaseModel
from typing import List, Dict

class LearningReport(BaseModel):
    user: str
    topics_mastered: List[str]
    topics_confused: List[str]
    skills_demonstrated: List[str]
    contribution_score: float  # e.g., 0-100
    unanswered_questions: List[str]
