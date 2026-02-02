import os
from typing import List, Dict, Any, Optional
from supabase import create_client, Client
from datetime import datetime
import uuid

class SupabaseStorage:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        if not self.url or not self.key:
            # Fallback or warning
            self.client = None
            print("WARNING: Supabase URL or Key not found in environment.")
        else:
            self.client: Client = create_client(self.url, self.key)

    def add_message(
        self,
        session_id: str,
        user_id: str,
        role: str,
        content: str,
        language: str | None = None,
    ) -> Dict[str, Any]:
        """
        Store a chat message in Supabase.
        """
        message = {
            "session_id": session_id,
            "user_id": user_id,
            "role": role,
            "content": content,
            "language": language,
            "timestamp": datetime.utcnow().isoformat(),
        }

        if self.client:
            try:
                # Map session_id to room_id for DB compatibility
                # Only include columns that actually exist in the table
                db_message = {
                    "room_id": session_id,
                    "user_id": user_id,
                    "role": role,
                    "content": content,
                    # "payload": {"language": language} if language else {} 
                }
                
                res = self.client.table("messages").insert(db_message).execute()
                return res.data[0] if res.data else message
            except Exception as e:
                print(f"Error storing message in Supabase: {e}")
                return message
        return message

    def get_session_messages(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Retrieve full chat history for a session from Supabase.
        """
        if self.client:
            try:
                res = self.client.table("messages").select("*").eq("room_id", session_id).order("created_at").execute()
                return res.data
            except Exception as e:
                print(f"Error fetching messages from Supabase: {e}")
                return []
        return []

    def clear_session(self, session_id: str) -> None:
        """
        Delete all messages for a session in Supabase.
        """
        if self.client:
            try:
                self.client.table("messages").delete().eq("room_id", session_id).execute()
            except Exception as e:
                print(f"Error clearing session in Supabase: {e}")

    def get_user_messages(self, session_id: str) -> List[str]:
        """
        Returns only user messages for analysis.
        """
        messages = self.get_session_messages(session_id)
        return [m["content"] for m in messages if m["role"] == "user"]

    def get_last_n_messages(self, session_id: str, n: int = 10) -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("messages").select("*").eq("room_id", session_id).order("timestamp", desc=True).limit(n).execute()
                return sorted(res.data, key=lambda x: x["timestamp"])
            except Exception as e:
                print(f"Error fetching last N messages: {e}")
                return []
        return []

    def get_user_message_count(self, session_id: str) -> int:
        if self.client:
            try:
                res = self.client.table("messages").select("id", count="exact").eq("room_id", session_id).eq("role", "user").execute()
                return res.count if res.count is not None else 0
            except Exception as e:
                print(f"Error getting user message count: {e}")
                return 0
        return 0

    def get_time_gaps(self, session_id: str) -> List[float]:
        messages = self.get_session_messages(session_id)
        gaps = []
        for i in range(1, len(messages)):
            t1 = datetime.fromisoformat(messages[i - 1]["timestamp"].replace('Z', '+00:00'))
            t2 = datetime.fromisoformat(messages[i]["timestamp"].replace('Z', '+00:00'))
            gaps.append((t2 - t1).total_seconds())
        return gaps

    def clear_all(self) -> None:
        if self.client:
            try:
                # Be careful with this, usually only for testing
                self.client.table("messages").delete().neq("room_id", "keep").execute()
            except Exception as e:
                print(f"Error clearing all messages: {e}")

    def save_summary(self, session_id: str, data: Any) -> None:
        """
        Store an analysis summary in Supabase.
        """
        if self.client:
            try:
                payload = {
                    "session_id": session_id,
                    "summary": data,
                    "timestamp": datetime.utcnow().isoformat()
                }
                self.client.table("summaries").upsert(payload, on_conflict="session_id").execute()
            except Exception as e:
                print(f"Error saving summary to Supabase: {e}")

    def get_summary(self, session_id: str) -> Optional[Any]:
        """
        Retrieve summary from Supabase.
        """
        if self.client:
            try:
                res = self.client.table("summaries").select("summary").eq("session_id", session_id).execute()
                return res.data[0]["summary"] if res.data else None
            except Exception as e:
                print(f"Error fetching summary: {e}")
                return None
        return None


    def save_history_entry(self, room_id: str, session_data: Dict[str, Any]) -> bool:
        """
        Save a completed session to the history table.
        """
        if self.client:
            try:
                # Check if we should use a new UUID for this specific historical session record
                history_id = str(uuid.uuid4())
                
                payload = {
                    "id": history_id,
                    "room_id": room_id,
                    "summary_data": session_data,
                    "created_at": datetime.utcnow().isoformat(),
                    "topic": session_data.get("summary", {}).get("topics_covered", ["General Study"])[0] if isinstance(session_data.get("summary", {}).get("topics_covered"), list) and session_data.get("summary", {}).get("topics_covered") else "General Study"
                }
                
                self.client.table("session_history").insert(payload).execute()
                return True
            except Exception as e:
                print(f"Error saving history entry: {e}")
                return False
        return False

    def get_history(self, room_id: str) -> List[Dict[str, Any]]:
        """
        Retrieve list of past sessions for a room.
        """
        if self.client:
            try:
                res = self.client.table("session_history")\
                    .select("id, room_id, created_at, topic, summary_data")\
                    .eq("room_id", room_id)\
                    .order("created_at", desc=True)\
                    .execute()
                return res.data
            except Exception as e:
                print(f"Error fetching history: {e}")
                return []
        return []


