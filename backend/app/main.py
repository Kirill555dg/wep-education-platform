"""
FastAPI application entry point
"""

import typing as tp

import fastapi
from fastapi import exceptions as fastapi_exceptions
from fastapi import responses as fastapi_responses
from fastapi import status as http_status
from fastapi.middleware import cors as fastapi_cors

from app.api import v1 as api_v1
from app.core import config as core_config
from app.db import session as db_session

# Create FastAPI application
app = fastapi.FastAPI(
    title=core_config.settings.APP_NAME,
    version=core_config.settings.APP_VERSION,
    debug=core_config.settings.DEBUG,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Configure CORS
app.add_middleware(
    fastapi_cors.CORSMiddleware,
    allow_origins=core_config.settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom validation error handler for better debugging
@app.exception_handler(fastapi_exceptions.RequestValidationError)
async def validation_exception_handler(
    request: fastapi.Request,
    exc: fastapi_exceptions.RequestValidationError,
) -> fastapi_responses.JSONResponse:
    """
    Custom handler for validation errors to provide detailed error messages
    """
    errors = exc.errors()
    body = exc.body if hasattr(exc, "body") else None

    print(f"   Validation error for {request.url.path}:")
    print(f"   Body: {body}")
    print(f"   Errors: {errors}")

    return fastapi_responses.JSONResponse(
        status_code=http_status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": errors,
            "body": body,
        },
    )


# Include API router
app.include_router(api_v1.api_router, prefix=core_config.settings.API_V1_PREFIX)


@app.get("/")
def root() -> dict[str, tp.Any]:
    """
    Root endpoint

    Returns:
        dict: Welcome message
    """
    return {
        "message": "Web Education Platform API",
        "version": core_config.settings.APP_VERSION,
        "docs": "/api/docs",
    }


# Database initialization (create tables)
@app.on_event("startup")
async def on_startup() -> None:
    """
    Initialize database on application startup
    """
    async with db_session.async_engine.begin() as connection:
        await connection.run_sync(db_session.Base.metadata.create_all)

    print(f"  {core_config.settings.APP_NAME} started successfully")
    print(f"  Debug mode: {core_config.settings.DEBUG}")
    print(f"  Database: {core_config.settings.DATABASE_URL}")


@app.on_event("shutdown")
def on_shutdown() -> None:
    """
    Cleanup on application shutdown
    """
    print(f"  {core_config.settings.APP_NAME} shutting down...")
