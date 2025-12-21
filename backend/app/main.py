"""
FastAPI application entry point
"""

import typing as tp

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import api_router
from app.core.config import settings

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom validation error handler for better debugging
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """
    Custom handler for validation errors to provide detailed error messages
    """
    errors = exc.errors()
    body = exc.body if hasattr(exc, "body") else None

    print(f"❌ Validation error for {request.url.path}:")
    print(f"   Body: {body}")
    print(f"   Errors: {errors}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": errors,
            "body": body,
        },
    )


# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root() -> dict[str, tp.Any]:
    """
    Root endpoint

    Returns:
        dict: Welcome message
    """
    return {
        "message": "Web Education Platform API",
        "version": settings.APP_VERSION,
        "docs": "/api/docs",
    }


# Database initialization (create tables)
@app.on_event("startup")
def on_startup() -> None:
    """
    Initialize database on application startup
    """
    from app.db.session import Base, engine

    # Create all tables
    # В продакшене используйте Alembic для миграций
    Base.metadata.create_all(bind=engine)

    print(f"✓ {settings.APP_NAME} started successfully")
    print(f"✓ Debug mode: {settings.DEBUG}")
    print(f"✓ Database: {settings.DATABASE_URL}")


@app.on_event("shutdown")
def on_shutdown() -> None:
    """
    Cleanup on application shutdown
    """
    print(f"✗ {settings.APP_NAME} shutting down...")
