import asyncio
import os
import sys

# Add app to path
sys.path.append(os.getcwd())

from app.services.summary_service import SummaryService
from app.storage.temp_memory import TempMemory
from app.storage.knowledge_store import KnowledgeStore
from app.storage.supabase_storage import SupabaseStorage
from app.ai.llm_client import LLMClient
from app.services.analytics_service import AnalyticsService

async def test_summary_gen():
    print("Initializing services...")
    # Mock dependencies
    temp_memory = TempMemory()
    knowledge_store = KnowledgeStore()
    llm_client = LLMClient()
    analytics_service = AnalyticsService(temp_memory, knowledge_store)
    
    service = SummaryService(
        temp_memory=temp_memory, 
        knowledge_store=knowledge_store,
        llm_client=llm_client,
        analytics_service=analytics_service
    )
    
    session_id = "test_session_123"
    
    # Add dummy messages
    print("Adding mock messages...")
    temp_memory.add_message(session_id, "user1", "user", "What is the capital of France?")
    temp_memory.add_message(session_id, "assistant", "assistant", "The capital of France is Paris.")
    temp_memory.add_message(session_id, "user1", "user", "Great, thanks! I demonstrated good research here.")
    
    print("Generating summary...")
    try:
        result = await service.generate_session_analysis(session_id)
        import json
        print("\n--- Result ---")
        print(json.dumps(result, indent=2))
        
        if "error" in result:
             print("\nFAILED: Error in result")
        else:
             print("\nSUCCESS: Summary generated")
             
    except Exception as e:
        print(f"\nCRITICAL FAILURE: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_summary_gen())
