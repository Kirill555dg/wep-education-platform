"""
API v1 endpoints
"""
from fastapi import APIRouter

from app.api.v1 import (
    health,
    auth,
    classrooms,
    lessons,
    homework,
    testing,
    statistics,
)

api_router = APIRouter()

# Include route modules
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(classrooms.router, prefix="/classrooms", tags=["Classrooms"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["Lessons"])
api_router.include_router(homework.router, prefix="/homework", tags=["Homework"])
api_router.include_router(testing.router, prefix="/testing", tags=["Testing"])
api_router.include_router(statistics.router, prefix="/statistics", tags=["Statistics"])

