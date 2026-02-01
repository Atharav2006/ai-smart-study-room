from typing import Any, Dict, List, Optional
from app.storage.temp_memory import TempMemory
from app.storage.knowledge_store import KnowledgeStore

class AnalyticsService:
    """
    Handles peer learning analytics and participant contribution metrics.
    """
    def __init__(self, temp_memory: TempMemory, knowledge_store: KnowledgeStore):
        self.temp_memory = temp_memory
        self.knowledge_store = knowledge_store

    def get_session_analytics(self, session_id: str) -> Dict[str, Any]:
        """
        Generate engagement and contribution metrics for a session.
        """
        messages = self.temp_memory.get_session_messages(session_id)
        if not messages:
            # Check if we have a saved summary with analytics
            summary = self.knowledge_store.get_summary(session_id)
            if summary and "stats" in summary:
                return summary.get("analytics", {"info": "Detailed engagement data not persisted in summary, but stats are available."})
            return {"error": "No data"}

        user_counts = {}
        total_user_msgs = 0

        for msg in messages:
            if msg.get("role") == "user":
                uid = msg.get("user_id", "anonymous")
                user_counts[uid] = user_counts.get(uid, 0) + 1
                total_user_msgs += 1

        # Calculate contribution scores
        contribution_scores = []
        for uid, count in user_counts.items():
            score = (count / total_user_msgs) * 100 if total_user_msgs > 0 else 0
            contribution_scores.append({
                "user_id": uid,
                "message_count": count,
                "contribution_percentage": round(score, 2)
            })

        return {
            "total_messages": len(messages),
            "user_messages": total_user_msgs,
            "participant_contributions": contribution_scores,
            "session_id": session_id
        }
    def get_session_stats(self, session_id: str) -> Dict[str, Any]:
        """
        Get high-level statistics for the session.
        """
        try:
            # Try temp memory first
            messages = self.temp_memory.get_session_messages(session_id)
            if not messages:
                # Fallback to persistent summary
                summary = self.knowledge_store.get_summary(session_id)
                if summary and "stats" in summary:
                    return summary["stats"]
                return {"message_count": 0, "user_message_count": 0, "insight_count": 0, "duration_mins": 0}

            msg_count = len(messages)
            user_msg_count = len([m for m in messages if m.get("role") == "user"])
            
            # Calculate approximate duration based on first and last message
            duration_mins = 0
            if len(messages) > 1:
                try:
                    from datetime import datetime
                    t1_str = messages[0].get("timestamp", "")
                    t2_str = messages[-1].get("timestamp", "")
                    if t1_str and t2_str:
                        t1 = datetime.fromisoformat(t1_str.replace('Z', '+00:00'))
                        t2 = datetime.fromisoformat(t2_str.replace('Z', '+00:00'))
                        duration_mins = round((t2 - t1).total_seconds() / 60)
                except Exception as e:
                    print(f"Error calculating duration: {e}")
                    pass

            return {
                "message_count": msg_count,
                "user_message_count": user_msg_count,
                "insight_count": msg_count - user_msg_count,
                "duration_mins": duration_mins or 1
            }
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise e

    def get_skill_signals(self, session_id: str) -> Dict[str, Any]:
        """
        Fetch skill signals. Fallback to persisted summary if messages are cleared.
        """
        try:
            # Try temp memory first
            messages = self.temp_memory.get_session_messages(session_id)
            if not messages:
                # Fallback to persistent summary
                summary = self.knowledge_store.get_summary(session_id)
                if summary and "skills" in summary:
                    return {"signals": summary["skills"]}
                return {"signals": []}

            user_msgs = len([m for m in messages if m.get("role") == "user"])
            
            return {
                "signals": [
                    {"name": "Critical Thinking", "level": min(5, (user_msgs // 5) + 1)},
                    {"name": "Collaboration", "level": min(5, (user_msgs // 10) + 1)},
                    {"name": "Research", "level": 2}
                ]
            }
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise e
