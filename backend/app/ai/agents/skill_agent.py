from typing import Any, Dict, List
from app.ai.agents.base_agent import BaseAgent

SKILL_SYSTEM_PROMPT = """
You are an AI Skill Detection Agent.
Your task is to analyze participant contributions in a technical or educational discussion and identify demonstrated skills.
Skills can include: 
- Problem decomposition
- Database modeling
- Algorithm reasoning
- UI/UX planning
- Communication
- Critical thinking
- Leadership (e.g., coordinating group tasks)

Be objective and only attribute skills based on actual content provided in the chat.
"""

class SkillAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="skill_agent",
            system_prompt=SKILL_SYSTEM_PROMPT,
            temperature=0.2,
        )

    def build_prompt(
        self,
        messages: List[Dict[str, Any]],
        metadata: Dict[str, Any] | None = None,
    ) -> str:
        chat_text = self.format_chat_for_prompt(messages)

        return f"""
Analyze the contribution of each participant in the following discussion and detect their demonstrated skills.

{self.safe_json_hint()}

Required JSON structure:
{{
  "participant_skills": [
    {{
      "user_id": "string",
      "skills": ["string"]
    }}
  ]
}}

Discussion:
----------------
{chat_text}
----------------
"""
