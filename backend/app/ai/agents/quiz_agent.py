from typing import Any, Dict, List
from app.ai.agents.base_agent import BaseAgent

QUIZ_SYSTEM_PROMPT = """
You are an AI Quiz Generator Agent.
Your task is to create educational assessment materials (MCQs, Flashcards, Short Questions) based on the topics discussed in a study session.

Focus on clarity and accuracy. Ensure the level of difficulty matches the discussion.
"""

class QuizAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="quiz_agent",
            system_prompt=QUIZ_SYSTEM_PROMPT,
            temperature=0.4,
        )

    def build_prompt(
        self,
        messages: List[Dict[str, Any]],
        metadata: Dict[str, Any] | None = None,
    ) -> str:
        chat_text = self.format_chat_for_prompt(messages)

        return f"""
Based on the following discussion, generate a set of assessment questions.

{self.safe_json_hint()}

Required JSON structure:
{{
  "mcqs": [
    {{
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "string",
      "explanation": "string"
    }}
  ],
  "flashcards": [
    {{
      "front": "Question/Term",
      "back": "Answer/Definition"
    }}
  ],
  "short_questions": [
     {{
       "question": "string",
       "ideal_answer": "string"
     }}
  ]
}}

Discussion:
----------------
{chat_text}
----------------
"""
