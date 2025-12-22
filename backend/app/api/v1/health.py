"""
Health check endpoints
"""

import typing as tp

import datetime as dt
import fastapi

from app.core import config as core_config

router = fastapi.APIRouter()


@router.get("/health")
def health_check() -> dict[str, tp.Any]:
    """
    Health check endpoint

    Returns:
        dict: Application health status
    """
    return {
        "status": "healthy",
        "app_name": core_config.settings.APP_NAME,
        "version": core_config.settings.APP_VERSION,
        "timestamp": dt.datetime.utcnow().isoformat(),
    }


@router.get("/ping")
def ping() -> dict[str, str]:
    """
    Simple ping endpoint

    Returns:
        dict: Pong response
    """
    return {"message": "pong"}
