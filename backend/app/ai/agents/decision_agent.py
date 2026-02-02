from typing import Any, Dict, List

from app.ai.agents.base_agent import BaseAgent


DECISION_SYSTEM_PROMPT = """
You are an AI Decision Analysis Agent for an educational collaboration platform.

Your task is to analyze group discussion and extract:
- Final decisions (if any)
- Points of agreement
- Points of disagreement
- Open or unresolved questions

Focus only on what was discussed.
Do not assume or invent decisions.
Be precise and concise.
"""


class DecisionAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="decision_agent",
            system_prompt=DECISION_SYSTEM_PROMPT,
            temperature=0.2,
        )

    def build_prompt(
        self,
        messages: List[Dict[str, Any]],
        metadata: Dict[str, Any] | None = None,
    ) -> str:
        chat_text = self.format_chat_for_prompt(messages)

        return f"""
Analyze the following group discussion and extract structured decisions.

{self.safe_json_hint()}

Required JSON structure:
{{
  "final_decisions": [string],
  "agreements": [string],
  "disagreements": [string],
  "open_questions": [string]
}}

Discussion:
----------------
{chat_text}
----------------
"""

    def parse_response(self, response: str) -> Dict[str, List[str]]:
        """
        The response is expected to already be valid JSON.
        In future, this can include strict validation.
        """
        try:
            import json
            return json.loads(response)
        except Exception:
            # Safe fallback to avoid system crash
            return {
                "final_decisions": [],
                "agreements": [],
                "disagreements": [],
                "open_questions": [],
                "raw_response": response,
            }
