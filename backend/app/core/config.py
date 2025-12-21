"""
Application configuration settings
"""

import typing as tp

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings"""

    # Application
    APP_NAME: str = "Web Education Platform API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # API
    API_V1_PREFIX: str = "/api/v1"

    # Database
    # Используем 127.0.0.1 вместо localhost для избежания GSSAPI auth проблем на macOS
    # gssencmode=disable отключает Kerberos authentication
    DATABASE_URL: str = "sqlite:///./wep_education.db"
    # Для PostgreSQL используйте, например:
    # DATABASE_URL = "postgresql://wep_user:wep_password@127.0.0.1:5432/wep_education?gssencmode=disable"

    # CORS
    BACKEND_CORS_ORIGINS: tp.List[str] = [
        "http://localhost:5173",  # Frontend dev server
        "http://localhost:3000",
    ]

    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")


settings = Settings()
