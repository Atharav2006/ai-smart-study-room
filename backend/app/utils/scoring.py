from backend.app.models.chat import ChatMessage
from collections import Counter

def contribution_score(messages: list[ChatMessage], participant: str) -> int:
    """
    Simple scoring: count number of messages by participant
    """
    return sum(1 for m in messages if m.sender == participant)

def skill_score(skills_detected: dict, participant: str) -> int:
    """
    Score based on number of skills detected for a participant
    """
    return len(skills_detected.get(participant, []))

def participation_summary(messages: list[ChatMessage]) -> dict:
    """
    Return a dict of participants and their message count
    """
    senders = [m.sender for m in messages]
    return dict(Counter(senders))
