# API Verification Audit Report

FastAPI router endpoints verification checklist under simulated clients.

| Endpoint Name | Method | Path | Response Status | Latency | Sample Response |
|---|---|---|---|---|---|
| Health Check | GET | `/health` | 200 | 10.48 ms | `{   "status": "healthy",   "service": "TrustNet AI",   "connections": {     "postgres": "configured",     "neo4j": "connected"   } }` |
| Analyze URL | POST | `/api/v1/analyze/url` | 200 | 6.25 ms | `{   "url": "https://cheap-deals-verify-reward.xyz/lotto",   "prediction_probability": 0.024,   "lexical_features": {     "length": 43.0,     "dots_count": 1.0,     "digits_ratio": 0.0,     "entropy": 3.8   } }` |
| Analyze Message | POST | `/api/v1/analyze/message` | 200 | 4.68 ms | `{   "raw_text": "Verify your KYC blocker now on paytm, click link http://block-kyc.cfd",   "category_probabilities": {     "Fake Job Scam": 0.05,     "Fake KYC Scam": 0.75,     "Lottery Scam": 0.05,  ...` |
| Analyze Fusion | POST | `/api/v1/analyze/fusion` | 200 | 5.93 ms | `{   "scan_id": "655803de-63fd-42e5-a054-75ba34c582d4",   "timestamp": "2026-06-18T01:29:13.523963Z",   "scam_category": "Fake KYC Scam",   "raw_probabilities": {     "url_model": 0.024,     "nlp_model...` |
| Submit Report | POST | `/api/v1/reports` | 201 | 6.90 ms | `{   "report_id": "806f4a5f-d9da-4ff4-ac89-d46a8560e837",   "status": "success",   "message": "Incident report processed and injected into cyber intelligence graph." }` |
| Graph Dashboard | GET | `/api/v1/research/graph/dashboard` | 200 | 4.31 ms | `{   "node_count": 500,   "edge_count": 500,   "communities_count": 12,   "latency_ms": 1.48,   "top_risk_entities": [     {       "entity": "merchant-scam-address-24@ybl",       "pagerank": 0.842,    ...` |
| Graph Entity Details | GET | `/api/v1/research/graph/entity?entity_value=scammer@upi` | 200 | 4.22 ms | `{   "entity": "scammer@upi",   "label": "UPI",   "pagerank": 0.25,   "degree_centrality": 2,   "relationships": [     {       "type": "ASSOCIATED_WITH",       "target_node": "+919876543210",       "ta...` |
| Research Experiments | GET | `/api/v1/research/experiments` | 200 | 5.39 ms | `[   {     "experiment_id": "exp_url_metrics",     "name": "url_lexical_comparisons",     "category": "url_benchmark",     "parameters": {       "test_split": 0.2,       "random_state": 42     },     "...` |
| RAG Query Assistant | POST | `/api/v1/rag/query` | 200 | 839.63 ms | `{   "answer": "### Cyber Threat Advisory Analysis\n\nBased on research logs retrieved from `kyc_scams.md`:\n\n*Disclaimer: This information is sourced from certified guidelines to assist users in iden...` |
| RAG Explain Scam | POST | `/api/v1/rag/explain-scam` | 200 | 7.05 ms | `{   "explanation": "### Cyber Threat Advisory Analysis\n\nBased on research logs retrieved from `kyc_scams.md`:\n\n*Disclaimer: This information is sourced from certified guidelines to assist users in...` |
