# AI Smart Study Collaboration Room

A privacy-first, AI-powered collaborative learning platform designed for students and life-long learners.

## Features

- **Privacy-First Design**: Ephemeral chat history, localized AI processing when possible.
- **AI Study Companion**: Real-time AI analysis of study discussions.
- **Collaboration Rooms**: Shared spaces for group study sessions.
- **Smart Summaries**: AI-generated structured summaries of learning sessions.
- **Learning Analysis**: Tracks skill signals and identifies knowledge gaps.
- **Interactive Quizzes**: Auto-generated quizzes based on your study sessions.

## Tech Stack

- **Backend**: FastAPI (Python), OpenAI GPT-4o-mini
- **Frontend**: React (Vite), Framer Motion, Axios, Tailwind CSS
- **AI/ML**: LangChain (planned), Sentence-Transformers, OpenAI

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- Python (3.11+)
- OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-smart-study-room
   ```

2. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env` and add your `OPENAI_API_KEY`.

3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Alternatively, run locally:
   - **Backend**: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`
   - **Frontend**: `cd frontend && npm install && npm run dev`
