import os
from typing import Dict, Any, List
from app.services.rag.knowledge_ingestion import ingest_knowledge_files
from app.services.rag.retriever import local_retriever
from app.services.rag.prompt_builder import prompt_builder

class RAGService:
    def __init__(self):
        self._bootstrapped = False

    def bootstrap(self):
        if not self._bootstrapped:
            ingest_knowledge_files()
            self._bootstrapped = True

    def explain_threat_scam(self, search_query: str, detection_details: Dict[str, Any]) -> Dict[str, Any]:
        self.bootstrap()
        
        # Retrieve docs using configured similarity threshold
        docs = local_retriever.retrieve_similar_docs(search_query, k=3)
        
        # Call LLM prompt builder
        explanation_res = prompt_builder.build_scam_explanation_response(search_query, detection_details, docs)
        
        explanation_res["evaluation_available"] = False
        
        # Format traceability according to exact requested structure
        retrieval_status = "FOUND" if docs else "NO_RELEVANT_DOCUMENT"
        
        formatted_docs = []
        for d in docs:
            formatted_docs.append({
                "id": d["metadata"].get("source", "unknown"),
                "source": d["metadata"].get("source", "unknown"),
                "relevance_score": d.get("relevance_score", 0.0)
            })
            
        return {
            "retrieval_status": retrieval_status,
            "query": search_query,
            "retrieved_documents": formatted_docs,
            "retrieved_evidence": [d["text"] for d in docs],
            "evidence_strength": "strong" if docs else "none",
            "explanation": explanation_res.get("explanation", ""),
            "prevention_steps": explanation_res.get("prevention_steps", []),
            "references": explanation_res.get("references", []),
            "evaluation_available": False
        }

rag_service = RAGService()
