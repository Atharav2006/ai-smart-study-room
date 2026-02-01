from typing import Any, Dict, List
from app.storage.temp_memory import TempMemory
from app.storage.knowledge_store import KnowledgeStore
from app.ai.llm_client import LLMClient
from app.ai.orchestrator import AIOrchestrator
from app.services.analytics_service import AnalyticsService

class SummaryService:
    """
    Handles generation and storage of study summaries and session insights.
    """
    def __init__(
        self, 
        temp_memory: TempMemory, 
        knowledge_store: KnowledgeStore, 
        llm_client: LLMClient,
        analytics_service: AnalyticsService
    ):
        self.temp_memory = temp_memory
        self.knowledge_store = knowledge_store
        self.orchestrator = AIOrchestrator(llm_client)
        self.analytics_service = analytics_service

    async def generate_session_analysis(
        self, 
        session_id: str, 
        target_language: str = "English"
    ) -> Dict[str, Any]:
        """
        Retrieve chat history and run full AI analysis.
        """
        messages = self.temp_memory.get_session_messages(session_id)
        if not messages:
            return {"error": "No messages found for this session"}

        # Filter for only user and assistant messages for analysis
        analysis_messages = [
            m for m in messages 
            if m.get("role") in ["user", "assistant"]
        ]

        analysis_result = await self.orchestrator.analyze_session(
            messages=analysis_messages,
            target_language=target_language
        )

        # CAPTURE ANALYTICS BEFORE CLEARING
        # This ensures the summary contains the stats/skills even after messages are deleted
        stats = self.analytics_service.get_session_stats(session_id)
        skills = self.analytics_service.get_skill_signals(session_id)
        
        analysis_result["stats"] = stats
        analysis_result["skills"] = skills.get("signals", [])
        
        # Add convenience keys for frontend display
        if "topics_covered" in analysis_result:
            topics = ", ".join(analysis_result.get("topics_covered", []))
            concepts = len(analysis_result.get("key_concepts", []))
            analysis_result["summary_text"] = f"This session covered {topics}. We explored {concepts} key concepts and addressed various questions."
        
        # Aggregate gaps for "suggested_topics"
        gaps = analysis_result.get("conceptual_gaps", []) + analysis_result.get("uncertain_topics", [])
        analysis_result["suggested_topics"] = gaps if gaps else ["No specific gaps detected. Great job!"]
        
        return analysis_result


    def get_summary(self, session_id: str) -> Dict[str, Any]:
        """
        Retrieve the latest summary for a session.
        """
        return self.knowledge_store.get_summary(session_id) or {}


    def save_summary(self, session_id: str, analysis_data: Dict[str, Any]) -> None:
        """
        Permanently store the analysis data if the host approves.
        """
        # In a real app, this would save to a database
        # For now, we use our simple knowledge store
        self.knowledge_store.save_summary(session_id, analysis_data)

        
        # Once saved to knowledge store, we can clear the temporary chat memory
        # as per the "privacy-first" requirement.
        self.temp_memory.clear_session(session_id)
