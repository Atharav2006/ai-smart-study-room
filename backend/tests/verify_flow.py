import asyncio
import httpx
import sys

async def test_summary_flow():
    base_url = "http://127.0.0.1:8000/api/v1"
    session_id = "test-session-123"
    
    print(f"--- Starting verification for session {session_id} ---")
    
    # 1. Add some messages
    print("1. Adding messages...")
    async with httpx.AsyncClient() as client:
        for i in range(3):
            await client.post(f"{base_url}/chat/send", json={
                "session_id": session_id,
                "user_id": "user1",
                "content": f"Test message {i+1}",
                "role": "user"
            })
            
        # 2. Verify stats while session is active
        print("2. Verifying stats (live)...")
        res = await client.get(f"{base_url}/analytics/stats/{session_id}")
        try:
            stats = res.json()
            print(f"Live stats: {stats}")
            assert stats["message_count"] >= 3
        except Exception as e:
            print(f"Failed to parse JSON: {e}")
            print(f"Status Code: {res.status_code}")
            print(f"Response Body: {res.text}")
            raise e
        
        # 3. Generate and save summary
        print("3. Generating and saving summary...")
        gen_res = await client.post(f"{base_url}/summary/generate", json={
            "session_id": session_id
        })
        analysis_data = gen_res.json()
        print(f"Generated Analysis Keys: {analysis_data.keys()}")
        assert "stats" in analysis_data
        assert "skills" in analysis_data
        
        save_res = await client.post(f"{base_url}/summary/save", json={
            "session_id": session_id,
            "analysis_data": analysis_data
        })
        print(f"Save Result: {save_res.json()}")
        
        # 4. Verify signals/stats after clearing (fallback)
        print("4. Verifying fallback analytics...")
        
        # Verify stats
        stats_res = await client.get(f"{base_url}/analytics/stats/{session_id}")
        persisted_stats = stats_res.json()
        print(f"Persisted stats: {persisted_stats}")
        assert persisted_stats["message_count"] >= 3
        
        # Verify signals
        skills_res = await client.get(f"{base_url}/analytics/signals/{session_id}")
        persisted_skills = skills_res.json()
        print(f"Persisted skills: {persisted_skills}")
        assert len(persisted_skills.get("signals", [])) > 0
        
        print("--- Verification SUCCESSFUL ---")

if __name__ == "__main__":
    try:
        asyncio.run(test_summary_flow())
    except Exception as e:
        print(f"!!! Verification FAILED: {e}")
        sys.exit(1)
