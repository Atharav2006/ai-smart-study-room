import asyncio
import os
import sys

# Add app to path
sys.path.append(os.getcwd())

from app.ai.llm_client import LLMClient
from app.config import settings

async def test_llm():
    print(f"Testing LLM Client with API Key: {settings.GEMINI_API_KEY[:5]}...")
    client = LLMClient()
    
    if not client.model:
        print("Model is None! (API Key likely missing)")
        return

    try:
        print("Listing available models...")
        # Note: list method might be synchronous or async depending on SDK version
        # Try async first if available, else sync wrapper
        # The SDK structure is client.models.list() usually
        
        # Using synchronous client for listing to be safe/simple if aio is not clear
        # But LLMClient uses async client. Let's try to access the sync client if stored?
        # LLMClient only stores self.client which is genai.Client()
        
        # The new SDK genai.Client has .models.list()
        
        # The genai library doesn't expose a simple list models on the model object easily
        # We can just skip listing or use genai.list_models() if we import it
        import google.generativeai as genai
        if client.api_key:
            genai.configure(api_key=client.api_key)
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    print(f"- {m.name}")
            
    except Exception as e:
        print(f"List models failed: {e}")
        
    # Also try generating with a fallback model if list works or fails
    try:
        print("\nTrying generate with 'gemini-1.5-flash' again to confirm error...")
        response = await client.generate_response("Test", max_tokens=5)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Generate failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_llm())
