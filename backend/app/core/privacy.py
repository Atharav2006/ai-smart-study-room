from typing import List, Dict
from datetime import datetime, timedelta
from app.core.constants import TEMP_MEMORY_RETENTION

class TempMemory:
    """
    Stores temporary chat messages before host approval.
    Auto-deletes messages older than TEMP_MEMORY_RETENTION.
    """

    def __init__(self):
        self.messages: List[Dict] = []

    def add_message(self, message: Dict):
        """
        Add a new chat message with timestamp.
        """
        message["received_at"] = datetime.utcnow()
        self.messages.append(message)
        self.cleanup()

    def get_all_messages(self) -> List[Dict]:
        """
        Retrieve all messages that are still valid.
        """
        self.cleanup()
        return self.messages

    def clear_messages(self):
        """
        Clear all temporary messages (e.g., after approval or host cancel).
        """
        self.messages = []

    def cleanup(self):
        """
        Remove messages older than retention time.
        """
        now = datetime.utcnow()
        self.messages = [
            msg for msg in self.messages
            if now - msg["received_at"] <= timedelta(seconds=TEMP_MEMORY_RETENTION)
        ]
