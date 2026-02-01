from typing import Any, Dict, List
import asyncio
from app.ai.llm_client import LLMClient
from app.ai.agents.summary_agent import SummaryAgent
from app.ai.agents.decision_agent import DecisionAgent
from app.ai.agents.gap_agent import GapAgent
from app.ai.agents.skill_agent import SkillAgent
from app.ai.agents.quiz_agent import QuizAgent
from app.ai.agents.language_agent import LanguageAgent

class AIOrchestrator:
    """
    Coordinates multiple AI agents to perform a comprehensive analysis of a study session.
    """
    def __init__(self, llm_client: LLMClient):
        self.llm = llm_client
        self.agents = {
            "summary": SummaryAgent(),
            "decision": DecisionAgent(),
            "gap": GapAgent(),
            "skill": SkillAgent(),
            "quiz": QuizAgent(),
            "language": LanguageAgent()
        }

    async def analyze_session(
        self, 
        messages: List[Dict[str, Any]], 
        target_language: str = "English"
    ) -> Dict[str, Any]:
        """
        Run all analysis agents in parallel and aggregate results.
        """
        if not messages:
            return {"error": "No messages to analyze"}

        # Task list for parallel execution
        tasks = [
            self._run_agent("summary", messages),
            self._run_agent("decision", messages),
            self._run_agent("gap", messages),
            self._run_agent("skill", messages),
            self._run_agent("quiz", messages)
        ]

        results = await asyncio.gather(*tasks)
        
        # Combine results
        analysis = {}
        for res in results:
            analysis.update(res)

        # If language is not English, translate the combined results
        if target_language.lower() != "english":
            translation = await self._run_translation(analysis, target_language)
            analysis["translated"] = translation

        return analysis

    async def _run_agent(self, agent_name: str, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        agent = self.agents[agent_name]
        prompt = agent.build_prompt(messages)
        response = await self.llm.generate_response(
            prompt=prompt, 
            system_prompt=agent.system_prompt,
            temperature=agent.temperature
        )
        return agent.parse_response(response)

    async def _run_translation(self, content: Dict[str, Any], target_language: str) -> Dict[str, Any]:
        agent = self.agents["language"]
        prompt = agent.build_prompt(content, target_language=target_language)
        response = await self.llm.generate_response(
            prompt=prompt,
            system_prompt=agent.system_prompt,
            temperature=agent.temperature
        )
        return agent.parse_response(response)
