from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ChatMessage(BaseModel):
    user: str
    message: str = Field(..., max_length=2000)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    message_id: Optional[str] = None  # unique id if needed
