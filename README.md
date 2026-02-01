# ✨ AI Smart Study Room
> **The Future of Collaborative Learning, Augmented by Intelligence.**

A premium, privacy-first, AI-powered collaborative learning platform designed for students and life-long learners who demand excellence.

---

## 💎 Premium Features

- **🚀 Intelligent Collaboration**: Real-time shared spaces for group study with integrated AI oversight.
- **🧠 Neural Insights**: AI-driven analysis that identifies skill signals, knowledge gaps, and learning patterns.
- **📜 Session Masterpieces**: Auto-generated, high-fidelity summaries and key takeaways from every study session.
- **👤 Personalized Identity**: Customizable user profiles with avatar systems and session history.
- **📱 Fluid Responsiveness**: A state-of-the-art "God-Mode" UI that adapts perfectly from desktop monitors to mobile devices.
- **🔒 Privacy-Focused**: End-to-end data integrity with ephemeral session handling and secure authentication.

## 🛠️ Tech Stack & Architecture

- **Core Engine**: FastAPI (Python) - High performance, asynchronous backend.
- **Intelligence**: OpenAI GPT-4o Integration & LLM-powered analytics.
- **Interface**: React 18, Vite, Framer Motion (Modern Animations), Tailwind CSS.
- **Real-time & DB**: Supabase (PostgreSQL + Realtime Engine).
- **Icons**: Lucide React.
- **Design System**: Glassmorphism & Modern Dark UI.

## 🚀 Deployment & Setup

### Prerequisites
- **Docker** & Docker Compose
- **Node.js** (v18+)
- **Python** (3.11+)
- **OpenAI API Key**
- **Supabase Account**

### Immediate Launch (Docker)
1. Configure `.env` in `backend/` and `frontend/`.
2. Execute:
   ```bash
   docker-compose up --build
   ```

### Local Development
- **Backend Infrastructure**: 
  ```bash
  cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
  ```
- **Frontend Experience**:
  ```bash
  cd frontend && npm install && npm run dev
  ```

---
Built with ❤️ for the next generation of learners.

