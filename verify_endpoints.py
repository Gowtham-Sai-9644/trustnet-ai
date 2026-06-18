import os
import sys
import time
import json
from unittest.mock import MagicMock, AsyncMock

# Resolve path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Define the mock neo4j_client and its methods
mock_neo4j = MagicMock()
mock_neo4j.connect = MagicMock()
mock_neo4j.close = AsyncMock()
mock_neo4j.execute_query = AsyncMock(return_value=[
    {
        "pagerank": 0.25,
        "degree_centrality": 2,
        "nearby_reports_count": 1,
        "c": 500
    }
])
mock_driver = MagicMock()
mock_neo4j.get_driver = MagicMock(return_value=mock_driver)

# Patch the modules
sys.modules["backend.app.core.neo4j_conn"] = MagicMock(
    neo4j_client=mock_neo4j,
    get_neo4j=AsyncMock(return_value=mock_driver)
)

sys.modules["seed_data.seed_postgres"] = MagicMock(
    seed_postgres_db=AsyncMock()
)

sys.modules["seed_data.seed_neo4j"] = MagicMock(
    seed_neo4j_graph=AsyncMock()
)

from backend.app.main import app
from backend.app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.testclient import TestClient

# Mock DB Session
mock_db = AsyncMock(spec=AsyncSession)
mock_db.commit = AsyncMock()
mock_db.rollback = AsyncMock()
mock_db.close = AsyncMock()

def _get_db_override():
    yield mock_db

app.dependency_overrides[get_db] = _get_db_override

client = TestClient(app)
os.makedirs("verification", exist_ok=True)

endpoints = [
    {
        "name": "Health Check",
        "method": "GET",
        "path": "/health",
        "payload": None
    },
    {
        "name": "Analyze URL",
        "method": "POST",
        "path": "/api/v1/analyze/url",
        "payload": {"url": "https://cheap-deals-verify-reward.xyz/lotto"}
    },
    {
        "name": "Analyze Message",
        "method": "POST",
        "path": "/api/v1/analyze/message",
        "payload": {"message_text": "Verify your KYC blocker now on paytm, click link http://block-kyc.cfd"}
    },
    {
        "name": "Analyze Fusion",
        "method": "POST",
        "path": "/api/v1/analyze/fusion",
        "payload": {
            "url": "https://cheap-deals-verify-reward.xyz/lotto",
            "phone": "+919876543210",
            "upi": "scammer@upi",
            "message_text": "Verify your KYC blocker now on paytm"
        }
    },
    {
        "name": "Submit Report",
        "method": "POST",
        "path": "/api/v1/reports",
        "payload": {
            "reported_phone": "+919876543210",
            "reported_upi": "scammer@upi",
            "reported_url": "https://cheap-deals-verify-reward.xyz/lotto",
            "scam_category": "Fake KYC Scam",
            "description": "Caller claimed to be customer support.",
            "loss_amount": 5000.0
        }
    },
    {
        "name": "Graph Dashboard",
        "method": "GET",
        "path": "/api/v1/research/graph/dashboard",
        "payload": None
    },
    {
        "name": "Graph Entity Details",
        "method": "GET",
        "path": "/api/v1/research/graph/entity?entity_value=scammer@upi",
        "payload": None
    },
    {
        "name": "Research Experiments",
        "method": "GET",
        "path": "/api/v1/research/experiments",
        "payload": None
    },
    {
        "name": "RAG Query Assistant",
        "method": "POST",
        "path": "/api/v1/rag/query",
        "payload": {"query": "What is KYC scam?"}
    },
    {
        "name": "RAG Explain Scam",
        "method": "POST",
        "path": "/api/v1/rag/explain-scam",
        "payload": {
            "risk_score": 92.0,
            "scam_type": "Fake KYC Scam"
        }
    }
]

api_reports = []

for ep in endpoints:
    start_time = time.perf_counter()
    status = 500
    res_text = "Error"
    
    try:
        if ep["method"] == "GET":
            res = client.get(ep["path"])
        else:
            res = client.post(ep["path"], json=ep["payload"])
        status = res.status_code
        res_text = res.text
    except Exception as e:
        res_text = f"Request Failed: {e}"
        
    latency = (time.perf_counter() - start_time) * 1000
    
    # Try formatting sample payload response beautifully
    try:
        parsed_res = json.loads(res_text)
        res_summary = json.dumps(parsed_res, indent=2)[:200] + "..." if len(res_text) > 200 else json.dumps(parsed_res, indent=2)
    except Exception:
        res_summary = res_text[:200] + "..." if len(res_text) > 200 else res_text
        
    api_reports.append({
        "name": ep["name"],
        "method": ep["method"],
        "path": ep["path"],
        "status": status,
        "latency": f"{latency:.2f} ms",
        "response": res_summary
    })

# Write markdown report
with open("verification/api_verification_report.md", "w", encoding="utf-8") as f:
    f.write("# API Verification Audit Report\n\n")
    f.write("FastAPI router endpoints verification checklist under simulated clients.\n\n")
    f.write("| Endpoint Name | Method | Path | Response Status | Latency | Sample Response |\n")
    f.write("|---|---|---|---|---|---|\n")
    for r in api_reports:
        # Escape newlines for markdown table compatibility
        summary_escaped = r["response"].replace("\n", " ")
        f.write(f"| {r['name']} | {r['method']} | `{r['path']}` | {r['status']} | {r['latency']} | `{summary_escaped}` |\n")
        
print("Generated api_verification_report.md")
