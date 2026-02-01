from pydantic import BaseModel
from typing import List, Dict

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class QuizRequest(BaseModel):
    chat_messages: List[dict]

class QuizResponse(BaseModel):
    quiz: List[QuizQuestion]
