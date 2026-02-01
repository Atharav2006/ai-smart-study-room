from pydantic import BaseModel
from typing import List, Optional

class SummaryRequest(BaseModel):
    chat_messages: List[dict]
    host_approved: bool = True
    preferred_language: str = "en"

class SummaryResponse(BaseModel):
    topics_covered: List[str]
    key_concepts: List[str]
    important_explanations: List[str]
    final_decisions: List[str]
    agreements: List[str]
    disagreements: List[str]
    open_questions: List[str]
    action_items: List[str]
    learning_gaps: List[str]
    skill_signals: List[str]
    revision_notes: List[str]
    language: str
    approved_by_host: bool
