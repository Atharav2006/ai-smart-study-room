from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# API routers
from app.api.v1.chat import router as chat_router
from app.api.v1.summary import router as summary_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.quiz import router as quiz_router

# App initialization
app = FastAPI(
    title="AI Smart Study Collaboration Room",
    description="Privacy-first AI-powered collaborative learning platform",
    version="0.1.0"
)

# CORS (for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check (important for demo & debugging)
@app.get("/")
def root():
    return {
        "status": "running",
        "message": "AI Smart Study Collaboration Room API is live"
    }

# Include API routers
app.include_router(chat_router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(summary_router, prefix="/api/v1/summary", tags=["Summary"])
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(quiz_router, prefix="/api/v1/quiz", tags=["Quiz"])
