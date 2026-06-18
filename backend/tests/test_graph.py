from fastapi.testclient import TestClient
import pytest
from unittest.mock import AsyncMock
from app.services.graph_service import graph_service
from app.core.neo4j_conn import neo4j_client

def test_get_graph_entity_details(client: TestClient):
    response = client.get("/api/v1/research/graph/entity", params={
        "entity_value": "scammer@upi"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["entity"] == "scammer@upi"
    assert "pagerank" in data
    assert "degree_centrality" in data
    assert "relationships" in data

@pytest.mark.anyio
async def test_graph_service_methods():
    # Mock return values for lookup and fetch
    neo4j_client.execute_query = AsyncMock(return_value=[
        {"n": {"phone_number": "+919876543210"}, "r": {"type": "ASSOCIATED_WITH"}, "m": {"upi_id": "scammer@upi"}}
    ])
    
    # 1. create_entity_node
    await graph_service.create_entity_node("Phone", "+919876543210", {"risk_score": 0.85})
    assert neo4j_client.execute_query.called
    
    # 2. create_relationship
    await graph_service.create_relationship("Phone", "+919876543210", "UPI", "scammer@upi", "ASSOCIATED_WITH")
    assert neo4j_client.execute_query.called
    
    # 3. lookup_entity
    res = await graph_service.lookup_entity("Phone", "+919876543210")
    assert len(res) == 1
    
    # 4. fetch_neighborhood
    neighbors = await graph_service.fetch_neighborhood("+919876543210")
    assert len(neighbors) == 1
    
    # 5. fetch_centrality_metrics
    neo4j_client.execute_query = AsyncMock(return_value=[
        {"pagerank": 0.42, "degree_centrality": 5, "nearby_reports_count": 3}
    ])
    centrality = await graph_service.fetch_centrality_metrics("scammer@upi")
    assert centrality["pagerank"] == 0.42
    assert centrality["degree_centrality"] == 5
    
    # 6. fetch_centrality_metrics empty return fallback
    neo4j_client.execute_query = AsyncMock(return_value=[])
    centrality_empty = await graph_service.fetch_centrality_metrics("scammer@upi")
    assert centrality_empty["pagerank"] == 0.15
    assert centrality_empty["degree_centrality"] == 0
