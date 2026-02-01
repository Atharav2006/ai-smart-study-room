from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ChatMessageCreate(BaseModel):
    user: str
    message: str = Field(..., max_length=2000)

class ChatMessageResponse(BaseModel):
    user: str
    message: str
    timestamp: datetime
    message_id: Optional[str]
