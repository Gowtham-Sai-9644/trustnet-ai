import time
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import router as api_router
from app.core.neo4j_conn import neo4j_client
from app.core.logging_setup import setup_logging

# Initialize Logging
setup_logging()

# OpenAPI Tag Descriptions
tags_metadata = [
    {
        "name": "Health",
        "description": "System health diagnostics and cluster connectivity status."
    },
    {
        "name": "Risk Analysis",
        "description": "Multi-modal scam threat engines: Lexical URL, NLP Message Lures, LinkedIn Profiles, and QR Scams."
    },
    {
        "name": "Scam Reports",
        "description": "Public community incident report submission and verification locker."
    },
    {
        "name": "Research Hub",
        "description": "Observability metrics, cross-validation model benchmarks, ROC curve evaluation vectors."
    },
    {
        "name": "RAG Knowledge Assistant",
        "description": "Retrieval-Augmented Generation assistant for scam taxonomy and defense guidelines."
    },
    {
        "name": "System Status",
        "description": "Cluster database and graph telemetry status."
    }
]

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="TrustNet AI — Real-time Multi-Modal Fraud Intelligence & Threat Resolution Engine.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=tags_metadata
)

# HTTP Request Logging & Performance Timing Middleware
@app.middleware("http")
async def log_and_time_requests(request: Request, call_next):
    start_time = time.time()
    logging.info(f"Incoming Request: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000 # in ms
        response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
        logging.info(f"Completed Request: {request.method} {request.url.path} - Status: {response.status_code} [{process_time:.2f}ms]")
        return response
    except Exception as e:
        process_time = (time.time() - start_time) * 1000
        logging.error(f"Failed Request: {request.method} {request.url.path} - Error: {e} [{process_time:.2f}ms]", exc_info=True)
        raise

# CORS Middleware Configuration
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
    logging.info("Starting up TrustNet AI engine backend services...")
    neo4j_client.connect()
    
    # Auto-seed Postgres and Neo4j databases asynchronously if enabled
    import asyncio
    import os
    
    if os.getenv("ENABLE_SEEDING") == "true":
        import sys
        parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
        if parent_dir not in sys.path:
            sys.path.insert(0, parent_dir)
        
        try:
            from seed_data.seed_postgres import seed_postgres_db
            from seed_data.seed_neo4j import seed_neo4j_graph
            
            asyncio.create_task(seed_postgres_db())
            asyncio.create_task(seed_neo4j_graph())
        except Exception as seed_err:
            logging.warning(f"Seeding tasks initialization notice: {seed_err}")

@app.on_event("shutdown")
async def shutdown_event():
    logging.info("Shutting down TrustNet AI backend services...")
    await neo4j_client.close()

# Health Check Route
@app.get("/health", tags=["Health"])
async def health_check():
    neo4j_status = "connected" if await neo4j_client.check_health() else "local_fallback"
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "connections": {
            "postgres": "ready",
            "neo4j": neo4j_status
        }
    }

# Register API Router
app.include_router(api_router, prefix=settings.API_V1_STR)
