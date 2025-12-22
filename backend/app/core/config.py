"""
Application configuration settings
"""

import pydantic_settings


class Settings(pydantic_settings.BaseSettings):
    """Application settings"""

    # Application
    APP_NAME: str = "Web Education Platform API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # API
    API_V1_PREFIX: str = "/api/v1"

    # Pagination
    PAGINATION_DEFAULT_SKIP: int = 0
    PAGINATION_DEFAULT_LIMIT: int = 100
    PAGINATION_MAX_LIMIT: int = 100

    # Database
    # Используем 127.0.0.1 вместо localhost для избежания GSSAPI auth проблем на macOS
    DATABASE_URL: str = "postgresql://wep_user:wep_password@127.0.0.1:5433/wep_education"

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",  # Frontend dev server
        "http://localhost:3000",
    ]

    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Logging
    # - Local dev: colored key=value logs by default (DEBUG=True)
    # - Server: JSON logs without ANSI by default (DEBUG=False)
    LOG_LEVEL: str | None = None  # e.g. "DEBUG", "INFO"
    LOG_JSON: bool | None = None
    LOG_COLOR: bool | None = None
    SERVICE_NAME: str = "wep-backend"

    # Realtime
    # For WebSocket chat fanout in multi-instance deployments.
    # Example: "redis://redis:6379/0" (docker-compose) or "redis://127.0.0.1:6379/0" (local)
    REDIS_URL: str | None = None
    CHAT_PRESENCE_TTL_SECONDS: int = 60
    CHAT_PRESENCE_REFRESH_SECONDS: int = 20
    CHAT_TYPING_TTL_SECONDS: int = 6

    model_config = pydantic_settings.SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
