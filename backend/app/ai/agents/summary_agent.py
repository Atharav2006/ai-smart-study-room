from typing import Any, Dict, List
from app.ai.agents.base_agent import BaseAgent

SUMMARY_SYSTEM_PROMPT = """
You are an AI Study Summary Agent.
Your task is to analyze a group study discussion and generate a structured summary including:
- Key topics covered
- Important concepts and definitions
- Key explanations provided during the discussion
- Action items or next steps for the group
- Revision notes for later study

Focus on educational value. Be concise but comprehensive.
"""

class SummaryAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="summary_agent",
            system_prompt=SUMMARY_SYSTEM_PROMPT,
            temperature=0.3,
        )

    def build_prompt(
        self,
        messages: List[Dict[str, Any]],
        metadata: Dict[str, Any] | None = None,
    ) -> str:
        chat_text = self.format_chat_for_prompt(messages)

        return f"""
Analyze the following group discussion and generate a structured study summary.

{self.safe_json_hint()}

Required JSON structure:
{{
  "topics_covered": [string],
  "key_concepts": [
    {{
      "concept": "Name",
      "definition": "Description"
    }}
  ],
  "important_explanations": [string],
  "action_items": [string],
  "revision_notes": [string]
}}

Discussion:
----------------
{chat_text}
----------------
"""
