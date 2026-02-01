from typing import Any, Dict, List
from app.storage.temp_memory import TempMemory
from app.ai.llm_client import LLMClient
from app.ai.agents.quiz_agent import QuizAgent

class QuizService:
    """
    Handles generation of quizzes and assessments from study sessions.
    """
    def __init__(self, temp_memory: TempMemory, llm_client: LLMClient):
        self.temp_memory = temp_memory
        self.llm = llm_client
        self.quiz_agent = QuizAgent()

    async def generate_quiz(self, session_id: str) -> Dict[str, Any]:
        """
        Produce a set of questions from the chat history.
        """
        messages = self.temp_memory.get_session_messages(session_id)
        if not messages:
            return {"error": "No messages to generate quiz from"}

        prompt = self.quiz_agent.build_prompt(messages)
        response = await self.llm.generate_response(
            prompt=prompt,
            system_prompt=self.quiz_agent.system_prompt,
            temperature=self.quiz_agent.temperature
        )
        
        return self.quiz_agent.parse_response(response)
