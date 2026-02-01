from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    full_name: Optional[str] = None
    role: str  # host, participant, mentor
    email: Optional[str] = None
