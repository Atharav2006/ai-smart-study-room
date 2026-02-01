# backend/app/storage/memory.py

from collections import defaultdict, deque
from datetime import datetime
from typing import List, Dict, Any
import uuid


class TempMemory:
    """
    In-memory session-based chat memory.
    Used by agents, analytics, and summary services.
    """

    def __init__(self, max_messages: int = 500):
        self.max_messages = max_messages

        # session_id -> deque(messages)
        self._sessions: Dict[str, deque] = defaultdict(
            lambda: deque(maxlen=self.max_messages)
        )

    # -----------------------------
    # Core Memory Operations
    # -----------------------------

    def add_message(
        self,
        session_id: str,
        user_id: str,
        role: str,
        content: str,
        language: str | None = None,
    ) -> Dict[str, Any]:
        """
        Store a chat message in memory.
        """

        message = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "user_id": user_id,
            "role": role,                 # user | assistant | system
            "content": content,
            "language": language,
            "timestamp": datetime.utcnow().isoformat(),
        }

        self._sessions[session_id].append(message)
        return message

    def get_session_messages(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Retrieve full chat history for a session.
        """
        return list(self._sessions.get(session_id, []))

    def get_last_n_messages(self, session_id: str, n: int = 10) -> List[Dict[str, Any]]:
        """
        Retrieve last N messages of a session.
        """
        messages = self._sessions.get(session_id, [])
        return list(messages)[-n:]

    # -----------------------------
    # Analytics / Agent Helpers
    # -----------------------------

    def get_user_messages(self, session_id: str) -> List[str]:
        """
        Returns only user messages (for dependency, gaps, skills).
        """
        return [
            m["content"]
            for m in self._sessions.get(session_id, [])
            if m["role"] == "user"
        ]

    def get_message_count(self, session_id: str) -> int:
        return len(self._sessions.get(session_id, []))

    def get_user_message_count(self, session_id: str) -> int:
        return len(
            [m for m in self._sessions.get(session_id, []) if m["role"] == "user"]
        )

    def get_time_gaps(self, session_id: str) -> List[float]:
        """
        Time gaps (in seconds) between consecutive messages.
        Useful for engagement & dependency analysis.
        """
        messages = self._sessions.get(session_id, [])
        gaps = []

        for i in range(1, len(messages)):
            t1 = datetime.fromisoformat(messages[i - 1]["timestamp"])
            t2 = datetime.fromisoformat(messages[i]["timestamp"])
            gaps.append((t2 - t1).total_seconds())

        return gaps

    # -----------------------------
    # Privacy / Cleanup
    # -----------------------------

    def clear_session(self, session_id: str) -> None:
        """
        Completely delete a session's memory.
        Used when user leaves or privacy rules apply.
        """
        if session_id in self._sessions:
            del self._sessions[session_id]

    def clear_all(self) -> None:
        """
        Wipe all memory (admin / shutdown).
        """
        self._sessions.clear()


# -----------------------------
# Singleton Instance
# -----------------------------

chat_memory = TempMemory()

