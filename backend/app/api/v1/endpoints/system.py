from fastapi import APIRouter
from datetime import datetime
import os

from app.core.database import check_postgres_health
from app.core.neo4j_conn import neo4j_client
from app.services.rag.retriever import local_retriever

router = APIRouter()

@router.get("/health")
async def get_system_health():
    # 1. API Health is always True if this endpoint runs
    api_ok = True
    
    # 2. Check Postgres Health
    postgres_ok = await check_postgres_health()
    
    # 3. Check Neo4j Health
    neo4j_ok = await neo4j_client.check_health()
    
    # 4. Check RAG Health
    rag_ok = False
    try:
        # ChromaDB vector store initialized
        has_chroma = local_retriever._vector_store is not None
        # TF-IDF fallback initialized
        has_json = os.path.exists(local_retriever.local_json_path)
        # Any initialization complete
        rag_ok = local_retriever._initialized or has_chroma or has_json
    except Exception:
        rag_ok = False

    return {
        "api": api_ok,
        "postgres": postgres_ok,
        "neo4j": neo4j_ok,
        "rag": rag_ok,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
