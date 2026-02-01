from typing import Any, Dict, List
from app.ai.agents.base_agent import BaseAgent

LANGUAGE_SYSTEM_PROMPT = """
You are an AI Multilingual Translation Agent specializing in educational content.
Your task is to translate study summaries and insights into a target language while preserving technical accuracy.

Keep industrial/technical terms in English if appropriate, but translate the explanations and context.
Supported languages: English, Hindi, Gujarati, Spanish, French, etc.
"""

class LanguageAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="language_agent",
            system_prompt=LANGUAGE_SYSTEM_PROMPT,
            temperature=0.1,
        )

    def build_prompt(
        self,
        content: Any,
        target_language: str = "English",
        metadata: Dict[str, Any] | None = None,
    ) -> str:
        return f"""
Translate the following structured educational content into {target_language}.
Maintain the JSON structure. Only translate the string values.

{self.safe_json_hint()}

Content to translate:
{content}
"""
