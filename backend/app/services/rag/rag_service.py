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

    def _calculate_metrics(self, query: str, docs: List[Dict[str, Any]], answer: str) -> Dict[str, float]:
        if not docs:
            return {
                "precision_k": 0.0,
                "recall_k": 0.0,
                "groundedness": 0.0,
                "citation_coverage": 0.0
            }
            
        query_words = set(query.lower().split())
        relevant_count = 0
        for doc in docs:
            doc_words = set(doc["text"].lower().split())
            if query_words.intersection(doc_words):
                relevant_count += 1
        precision = relevant_count / len(docs)
        recall = relevant_count / max(relevant_count + 1, 1.0)
        
        answer_words = [w for w in answer.lower().split() if len(w) > 4]
        retrieved_content = " ".join([d["text"].lower() for d in docs])
        grounded_count = sum(1 for w in answer_words if w in retrieved_content)
        groundedness = grounded_count / max(len(answer_words), 1)
        
        cited_sources = 0
        for doc in docs:
            src = doc["metadata"].get("source", "")
            if src and src in answer:
                cited_sources += 1
        citation_coverage = cited_sources / len(docs)
        
        return {
            "precision_k": round(precision, 3),
            "recall_k": round(recall, 3),
            "groundedness": round(groundedness, 3),
            "citation_coverage": round(citation_coverage, 3)
        }

    def query_assistant(self, query: str) -> Dict[str, Any]:
        self.bootstrap()
        # Retrieve top 2 similar documents
        docs = local_retriever.retrieve_similar_docs(query, k=2)
        answer = prompt_builder.build_qa_response(query, docs)
        
        sources = [doc["metadata"].get("source", "Advisory") for doc in docs]
        metrics = self._calculate_metrics(query, docs, answer)
        return {
            "answer": answer,
            "sources": list(set(sources)),
            "metrics": metrics
        }

    def explain_threat_scam(self, scam_type: str) -> Dict[str, Any]:
        self.bootstrap()
        docs = local_retriever.retrieve_similar_docs(scam_type, k=2)
        explanation_res = prompt_builder.build_scam_explanation_response(scam_type, docs)
        metrics = self._calculate_metrics(scam_type, docs, explanation_res["explanation"])
        explanation_res["metrics"] = metrics
        return explanation_res

rag_service = RAGService()

