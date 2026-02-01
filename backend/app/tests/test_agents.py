import unittest
from backend.app.ai.agents.base_agent import BaseAgent
from backend.app.ai.agents.summary_agent import SummaryAgent
from backend.app.ai.agents.skill_agent import SkillAgent
from backend.app.ai.agents.gap_agent import GapAgent
from backend.app.models.chat import ChatMessage
from backend.app.storage.temp_memory import TempMemory

class TestAgents(unittest.TestCase):

    def setUp(self):
        # Sample chat messages
        self.messages = [
            ChatMessage(sender="Alice", content="What is API authentication?", timestamp=None),
            ChatMessage(sender="Bob", content="It's a method to secure endpoints.", timestamp=None),
            ChatMessage(sender="Charlie", content="I still don't get OAuth flow.", timestamp=None)
        ]
        self.temp_memory = TempMemory()

    def test_temp_memory(self):
        # Add messages
        ids = [self.temp_memory.add_message(m) for m in self.messages]
        self.assertEqual(len(self.temp_memory.get_all_messages()), 3)
        # Delete one message
        self.temp_memory.delete_message(ids[0])
        self.assertEqual(len(self.temp_memory.get_all_messages()), 2)
        # Clear memory
        self.temp_memory.clear_memory()
        self.assertEqual(len(self.temp_memory.get_all_messages()), 0)

    def test_base_agent(self):
        agent = BaseAgent()
        result = agent.process_text("Hello World")
        self.assertIsInstance(result, str)
        self.assertIn("Processed:", result)

    def test_summary_agent(self):
        summary_agent = SummaryAgent()
        summary = summary_agent.create_summary(self.messages)
        self.assertIsInstance(summary, str)
        self.assertIn("Summary", summary)

    def test_skill_agent(self):
        skill_agent = SkillAgent()
        skills = skill_agent.extract_skills(self.messages)
        self.assertIsInstance(skills, list)

    def test_gap_agent(self):
        gap_agent = GapAgent()
        gaps = gap_agent.detect_gaps(self.messages)
        self.assertIsInstance(gaps, list)
        self.assertIn("Unanswered question detected: I still don't get OAuth flow.", gaps)

if __name__ == "__main__":
    unittest.main()
