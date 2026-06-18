from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

from backend.app.services.rag.rag_service import rag_service

router = APIRouter()

# Schema structures
class RAGQueryRequest(BaseModel):
    query: str = Field(..., description="The question or search query for the scam knowledge assistant")

class RAGQueryResponse(BaseModel):
    answer: str
    sources: List[str]
    metrics: Optional[Dict[str, float]] = None

class RAGExplainRequest(BaseModel):
    risk_score: float = Field(..., ge=0, le=100)
    scam_type: str = Field(...)
    evidence: Optional[List[str]] = Field(default=[])

class RAGExplainResponse(BaseModel):
    explanation: str
    prevention_steps: List[str]
    references: List[str]
    metrics: Optional[Dict[str, float]] = None

@router.post("/query", response_model=RAGQueryResponse)
async def query_knowledge_assistant(payload: RAGQueryRequest):
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query text cannot be empty.")
    res = rag_service.query_assistant(payload.query)
    return RAGQueryResponse(
        answer=res["answer"],
        sources=res["sources"],
        metrics=res.get("metrics")
    )

@router.post("/explain-scam", response_model=RAGExplainResponse)
async def explain_scam_threat(payload: RAGExplainRequest):
    res = rag_service.explain_threat_scam(payload.scam_type)
    return RAGExplainResponse(
        explanation=res["explanation"],
        prevention_steps=res["prevention_steps"],
        references=res["references"],
        metrics=res.get("metrics")
    )

