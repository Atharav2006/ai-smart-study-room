from typing import Any, Dict, List
import json

class BaseAgent:
    """
    Abstract base class for all AI agents in the system.
    Provides common utilities for prompting and response handling.
    """
    def __init__(self, name: str, system_prompt: str, temperature: float = 0.3):
        self.name = name
        self.system_prompt = system_prompt
        self.temperature = temperature

    def build_prompt(self, messages: List[Dict[str, Any]], metadata: Dict[str, Any] | None = None) -> str:
        """
        Override this to build a specific prompt for the agent.
        """
        raise NotImplementedError

    def format_chat_for_prompt(self, messages: List[Dict[str, Any]]) -> str:
        """
        Convert structured message list into a readable string for prompts.
        """
        formatted_chat = []
        for msg in messages:
            role = msg.get("role", "unknown")
            user_id = msg.get("user_id", "anonymous")
            content = msg.get("content", "")
            formatted_chat.append(f"[{role}] {user_id}: {content}")
        
        return "\n".join(formatted_chat)

    def safe_json_hint(self) -> str:
        """
        A reusable hint for ensuring JSON output.
        """
        return "CRITICAL: Return ONLY valid JSON. No preamble, no markdown formatting blocks, just the raw JSON string."

    def parse_response(self, response: str) -> Dict[str, Any]:
        """
        Utility to safely parse JSON responses from LLM.
        """
        try:
            # Try to strip markdown code blocks if present
            clean_response = response.strip()
            if clean_response.startswith("```"):
                lines = clean_response.split("\n")
                if lines[0].startswith("```json"):
                    clean_response = "\n".join(lines[1:-1])
                elif lines[0].startswith("```"):
                    clean_response = "\n".join(lines[1:-1])

            return json.loads(clean_response)
        except Exception:
            return {"error": "Failed to parse AI response", "raw": response}
