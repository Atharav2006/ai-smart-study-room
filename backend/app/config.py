from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_NAME: str = "AI Smart Study Collaboration Room"
    DEBUG: bool = True

    # API
    API_V1_PREFIX: str = "/api/v1"

    # LLM / AI
    GEMINI_API_KEY: str | None = None
    LLM_MODEL: str = "gemini-1.5-flash"
    LLM_TEMPERATURE: float = 0.3

    # Privacy / Memory
    TEMP_MEMORY_TTL_SECONDS: int = 3600  # 1 hour
    AUTO_DELETE_UNAPPROVED: bool = True

    # Supabase
    SUPABASE_URL: str | None = None
    SUPABASE_KEY: str | None = None


    # CORS
    ALLOWED_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


# Singleton settings object
settings = Settings()
