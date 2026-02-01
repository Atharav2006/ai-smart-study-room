from typing import Dict, List
from backend.app.models.chat import ChatMessage

class SessionStore:
    def __init__(self):
        # key: session_id, value: dict with participants and messages
        self._sessions: Dict[str, Dict] = {}

    def create_session(self, session_id: str, participants: List[str]):
        self._sessions[session_id] = {
            "participants": participants,
            "messages": []
        }

    def add_message(self, session_id: str, message: ChatMessage):
        if session_id in self._sessions:
            self._sessions[session_id]["messages"].append(message)

    def get_messages(self, session_id: str) -> List[ChatMessage]:
        return self._sessions.get(session_id, {}).get("messages", [])

    def get_participants(self, session_id: str) -> List[str]:
        return self._sessions.get(session_id, {}).get("participants", [])

    def delete_session(self, session_id: str):
        if session_id in self._sessions:
            del self._sessions[session_id]
