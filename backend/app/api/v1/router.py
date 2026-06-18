from fastapi import APIRouter
from app.api.v1.endpoints import analyze, reports, research, rag, system

api_router = APIRouter()

api_router.include_router(analyze.router, prefix="/analyze", tags=["Risk Analysis"])
api_router.include_router(reports.router, prefix="/reports", tags=["Scam Reports"])
api_router.include_router(research.router, prefix="/research", tags=["Research Hub"])
api_router.include_router(rag.router, prefix="/rag", tags=["RAG Knowledge Assistant"])
api_router.include_router(system.router, prefix="/system", tags=["System Status"])
