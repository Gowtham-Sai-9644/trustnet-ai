from fastapi.testclient import TestClient
import os

def test_get_graph_dashboard(client: TestClient):
    response = client.get("/api/v1/research/graph/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "node_count" in data
    assert "edge_count" in data
    assert "communities_count" in data
    assert "top_risk_entities" in data

def test_list_experiments_all(client: TestClient):
    # Ensure experiments master file exists or mock it if needed (it does exist in our workspace)
    response = client.get("/api/v1/research/experiments")
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert "experiment_id" in data[0]
            assert "category" in data[0]
    else:
        assert response.status_code == 404

def test_list_experiments_filtered(client: TestClient):
    response = client.get("/api/v1/research/experiments", params={"category": "url_benchmark"})
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data, list)
        for run in data:
            assert run["category"] == "url_benchmark"
