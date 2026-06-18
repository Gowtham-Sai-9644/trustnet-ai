from fastapi.testclient import TestClient
import os
import shutil
from app.services.rag.embedder import local_embedder
from app.services.rag.retriever import local_retriever
from app.services.rag.prompt_builder import prompt_builder
from app.services.rag.knowledge_ingestion import ingest_knowledge_files
from app.services.rag.rag_service import rag_service

def test_rag_query_endpoint(client: TestClient):
    response = client.post("/api/v1/rag/query", json={
        "query": "What is a fake KYC scam?"
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "sources" in data
    assert "metrics" in data
    assert "precision_k" in data["metrics"]

def test_rag_explain_scam_endpoint(client: TestClient):
    response = client.post("/api/v1/rag/explain-scam", json={
        "risk_score": 92.0,
        "scam_type": "Fake KYC Scam"
    })
    assert response.status_code == 200
    data = response.json()
    assert "explanation" in data
    assert "prevention_steps" in data
    assert "references" in data
    assert "metrics" in data

def test_embedder():
    emb = local_embedder.embed_query("test query")
    assert len(emb) == 384
    embs = local_embedder.embed_documents(["doc1", "doc2"])
    assert len(embs) == 2
    assert len(embs[0]) == 384

def test_retriever_persistent_fallback():
    # Remove existing store if any to test init
    if os.path.exists(local_retriever.local_json_path):
        try:
            os.remove(local_retriever.local_json_path)
        except Exception:
            pass
            
    local_retriever._initialized = False
    local_retriever.initialize_chromadb(
        texts=["This is a KYC Block Scam alert", "Never share OTP with lottery claims"],
        metadatas=[{"source": "test_kyc.md"}, {"source": "test_lottery.md"}]
    )
    assert local_retriever._initialized == True
    
    # Retrieve
    results = local_retriever.retrieve_similar_docs("KYC Block", k=1)
    assert len(results) == 1
    assert "KYC" in results[0]["text"]
    assert results[0]["metadata"]["source"] == "test_kyc.md"

def test_prompt_builder():
    docs = [
        {
            "text": "# KYC Block Advisory\n\nOverview\nScammers claim your KYC expires and block account.\n\nWarning Signs\n* Message says account is blocked.\n* High urgency request.\n\nPrevention Guidance\n* Never share OTP.\n* Call official bank support.",
            "metadata": {"source": "test_kyc.md"}
        }
    ]
    ans = prompt_builder.build_qa_response("KYC Block", docs)
    assert "KYC Block Advisory" not in ans # Title is skipped
    assert "Context & Luring Mechanism" in ans
    assert "Key Threat Indicators" in ans
    assert "Official Safety Advisories" in ans
    assert "test_kyc.md" in ans
    
    empty_ans = prompt_builder.build_qa_response("Something else", [])
    assert "No official advisories" in empty_ans
    
    explanation = prompt_builder.build_scam_explanation_response("KYC Block", docs)
    assert "explanation" in explanation
    assert "prevention_steps" in explanation
    assert len(explanation["references"]) > 0

def test_knowledge_ingestion():
    test_kb_dir = "test_knowledge_base"
    os.makedirs(test_kb_dir, exist_ok=True)
    with open(os.path.join(test_kb_dir, "test_doc.md"), "w", encoding="utf-8") as f:
        f.write("# Lottery Scam\n\nOverview\nLottery scam details.\n\nWarning Signs\n* You won lottery.\n\nPrevention Guidance\n* Don't pay transfer fees.")
        
    ingest_knowledge_files(kb_dir=test_kb_dir)
    
    # Clean up test kb directory
    shutil.rmtree(test_kb_dir, ignore_errors=True)
