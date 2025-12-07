"""
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1 import api_router

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

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
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
def on_startup():
    """
    Initialize database on application startup
    """
    from app.db.session import engine, Base
    
    # Create all tables
    # В продакшене используйте Alembic для миграций
    Base.metadata.create_all(bind=engine)
    
    print(f"✓ {settings.APP_NAME} started successfully")
    print(f"✓ Debug mode: {settings.DEBUG}")
    print(f"✓ Database: {settings.DATABASE_URL}")


@app.on_event("shutdown")
def on_shutdown():
    """
    Cleanup on application shutdown
    """
    print(f"✗ {settings.APP_NAME} shutting down...")

