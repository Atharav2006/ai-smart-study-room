from typing import Any, Dict, List

from app.ai.agents.base_agent import BaseAgent


GAP_SYSTEM_PROMPT = """
You are an AI Learning Gap Analysis Agent.

Your task is to analyze a group discussion and identify:
- Conceptual gaps
- Misunderstandings
- Missing prerequisites
- Topics participants struggled with or were unsure about

Only infer gaps from the discussion itself.
Do not invent gaps.
Be educational, neutral, and concise.
"""


class GapAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="gap_agent",
            system_prompt=GAP_SYSTEM_PROMPT,
            temperature=0.3,
        )

    def build_prompt(
        self,
        messages: List[Dict[str, Any]],
        metadata: Dict[str, Any] | None = None,
    ) -> str:
        chat_text = self.format_chat_for_prompt(messages)

        return f"""
Analyze the following discussion to identify learning gaps.

{self.safe_json_hint()}

Return the output strictly in this JSON format:
{{
  "conceptual_gaps": [string],
  "misunderstandings": [string],
  "missing_prerequisites": [string],
  "uncertain_topics": [string]
}}

Discussion:
----------------
{chat_text}
----------------
"""

    def parse_response(self, response: str) -> Dict[str, List[str]]:
        try:
            import json
            return json.loads(response)
        except Exception:
            return {
                "conceptual_gaps": [],
                "misunderstandings": [],
                "missing_prerequisites": [],
                "uncertain_topics": [],
                "raw_response": response,
            }
