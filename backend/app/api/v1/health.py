"""
Health check endpoints
"""

import typing as tp
from datetime import datetime

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
def health_check() -> tp.Dict[str, tp.Any]:
    """
    Health check endpoint

    Returns:
        dict: Application health status
    """
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "timestamp": datetime.utcnow().isoformat(),
    }


@router.get("/ping")
def ping() -> tp.Dict[str, str]:
    """
    Simple ping endpoint

    Returns:
        dict: Pong response
    """
    return {"message": "pong"}
