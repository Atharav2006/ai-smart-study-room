from typing import List, Dict, Any, Optional

class KnowledgeStore:
    """
    Simple persistent storage for approved study materials.
    In a production-ready system, this would interface with PostgreSQL/Supabase.
    """
    def __init__(self):
        # session_id -> summary_data
        self._summaries: Dict[str, Any] = {}
        # session_id -> quiz_data
        self._quizzes: Dict[str, Any] = {}

    def save_summary(self, session_id: str, data: Any):
        """Save an approved study summary."""
        self._summaries[session_id] = data

    def save_quiz(self, session_id: str, data: Any):
        """Save generated assessment materials."""
        self._quizzes[session_id] = data

    def get_summary(self, session_id: str) -> Optional[Any]:
        return self._summaries.get(session_id)

    def get_quiz(self, session_id: str) -> Optional[Any]:
        return self._quizzes.get(session_id)

    def get_all_summaries(self) -> List[Any]:
        return list(self._summaries.values())
