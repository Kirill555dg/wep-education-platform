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

    model_config = pydantic_settings.SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
