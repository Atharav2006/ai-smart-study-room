import google.generativeai as genai
from app.config import settings

class LLMClient:
    """
    Standardized client for interacting with Large Language Models.
    Updated for Google Gemini API.
    """
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.LLM_MODEL
        self.temperature = settings.LLM_TEMPERATURE
        
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
        else:
            self.model = None

    async def generate_response(
        self, 
        prompt: str, 
        system_prompt: str = "You are a helpful assistant.",
        temperature: float | None = None,
        max_tokens: int = 2000
    ) -> str:
        """
        Generate a text response from the LLM.
        """
        if not self.model:
            return "Error: Gemini API Key not configured."

        try:
            # Gemini handles system prompts by prepending to user message
            # or via model configuration
            full_prompt = f"{system_prompt}\n\n{prompt}"
            
            # Configure generation parameters
            generation_config = genai.GenerationConfig(
                temperature=temperature or self.temperature,
                max_output_tokens=max_tokens,
            )
            
            # Generate response
            response = await self.model.generate_content_async(
                full_prompt,
                generation_config=generation_config
            )
            
            return response.text
        except Exception as e:
            return f"Error communicating with LLM: {str(e)}"
