from typing import Any, Dict, List
from app.storage.temp_memory import TempMemory

class ChatService:
    """
    Handles real-time chat logic, message storage in temporary memory, and room management.
    """
    def __init__(self, temp_memory: TempMemory):
        self.temp_memory = temp_memory

    def post_message(
        self, 
        session_id: str, 
        user_id: str, 
        role: str, 
        content: str
    ) -> Dict[str, Any]:
        """
        Add a new message to the session's temporary memory.
        """
        return self.temp_memory.add_message(
            session_id=session_id,
            user_id=user_id,
            role=role,
            content=content
        )

    def get_history(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Get all messages for a specific session.
        """
        return self.temp_memory.get_session_messages(session_id)

    def clear_session(self, session_id: str) -> None:
        """
        Delete all messages for a session (privacy-first).
        """
        self.temp_memory.clear_session(session_id)
