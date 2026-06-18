from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.api.router import router as api_router
from backend.app.core.neo4j_conn import neo4j_client
from backend.app.core.logging_setup import setup_logging
import logging

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="TrustNet AI backend engine for transaction threat assessments and network entity intelligence.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# HTTP Request Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"HTTP Request: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        logging.info(f"HTTP Response: {request.method} {request.url.path} - Status: {response.status_code}")
        return response
    except Exception as e:
        logging.error(f"HTTP Request Failed: {request.method} {request.url.path} - Error: {e}", exc_info=True)
        raise


# CORS Middleware Configurations
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Connect to database dependencies during startup
@app.on_event("startup")
async def startup_event():
    neo4j_client.connect()
    
    # Auto-seed Postgres and Neo4j databases asynchronously if empty
    import asyncio
    from seed_data.seed_postgres import seed_postgres_db
    from seed_data.seed_neo4j import seed_neo4j_graph
    
    asyncio.create_task(seed_postgres_db())
    asyncio.create_task(seed_neo4j_graph())

@app.on_event("shutdown")
async def shutdown_event():
    await neo4j_client.close()

# Health Check Route
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "connections": {
            "postgres": "configured",
            "neo4j": "connected"
        }
    }

# Register API Router
app.include_router(api_router, prefix=settings.API_V1_STR)
