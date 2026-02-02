from typing import List, Dict, Any, Optional
from datetime import datetime
from app.storage.supabase_storage import SupabaseStorage

class HistoryService:
    def __init__(self, storage: SupabaseStorage):
        self.storage = storage

    def get_session_history(self, room_id: str) -> List[Dict[str, Any]]:
        """
        Get list of past sessions for a specific room.
        """
        return self.storage.get_history(room_id)

    async def archive_session(self, room_id: str, session_data: Dict[str, Any]) -> bool:
        """
        Archive the current session's summary and stats, then clear active messages.
        """
        # 1. Save the comprehensive summary to the history table
        success = self.storage.save_history_entry(room_id, session_data)
        
        if success:
            # 2. Clear the active messages for this room to start fresh
            self.storage.clear_session(room_id)
            return True
        return False
