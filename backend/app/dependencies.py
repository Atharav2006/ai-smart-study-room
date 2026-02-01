from fastapi import Depends
from app.storage.temp_memory import TempMemory
from app.storage.supabase_storage import SupabaseStorage
from app.storage.knowledge_store import KnowledgeStore
from app.ai.llm_client import LLMClient
from app.services.chat_service import ChatService
from app.services.summary_service import SummaryService
from app.services.analytics_service import AnalyticsService
from app.services.quiz_service import QuizService
from app.config import settings

# -----------------------------
# Storage singletons
# -----------------------------
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    _temp_memory = SupabaseStorage()
    _knowledge_store = _temp_memory # Unified Supabase storage
else:
    _temp_memory = TempMemory()
    _knowledge_store = KnowledgeStore()



def get_temp_memory():
    """
    Dependency: provide TempMemory instance
    """
    return _temp_memory

def get_knowledge_store():
    """
    Dependency: provide KnowledgeStore instance
    """
    return _knowledge_store

# -----------------------------
# LLM Client singleton
# -----------------------------
_llm_client = LLMClient()

def get_llm_client():
    """
    Dependency: provide LLM client instance
    """
    return _llm_client

# -----------------------------
# Services
# -----------------------------
_chat_service = ChatService(temp_memory=_temp_memory)
_analytics_service = AnalyticsService(
    temp_memory=_temp_memory,
    knowledge_store=_knowledge_store
)
_summary_service = SummaryService(
    temp_memory=_temp_memory,
    knowledge_store=_knowledge_store,
    llm_client=_llm_client,
    analytics_service=_analytics_service
)
_quiz_service = QuizService(
    temp_memory=_temp_memory,
    llm_client=_llm_client
)

def get_chat_service():
    return _chat_service

def get_summary_service():
    return _summary_service

def get_analytics_service():
    return _analytics_service

def get_quiz_service():
    return _quiz_service
