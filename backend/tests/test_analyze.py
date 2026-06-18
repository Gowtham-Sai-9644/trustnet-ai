from fastapi.testclient import TestClient

def test_analyze_url_endpoint(client: TestClient):
    response = client.post("/api/v1/analyze/url", json={
        "url": "https://secure-login-claim.net/rewards"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["url"] == "https://secure-login-claim.net/rewards"
    assert "prediction_probability" in data
    assert "lexical_features" in data

def test_analyze_message_endpoint(client: TestClient):
    response = client.post("/api/v1/analyze/message", json={
        "message_text": "Urgent lottery prize claims. Transfer processing fee Rs.2000 to win."
    })
    assert response.status_code == 200
    data = response.json()
    assert "category_probabilities" in data
    assert data["predicted_category"] == "Lottery Scam"

def test_analyze_fusion_endpoint(client: TestClient):
    response = client.post("/api/v1/analyze/fusion", json={
        "url": "https://secure-login-claim.net/rewards",
        "upi": "winlotto@ybl",
        "message_text": "Urgent lottery prize claims."
    })
    assert response.status_code == 200
    data = response.json()
    assert "scan_id" in data
    assert "fused_probability" in data
    assert "calibration" in data
    assert "explainability" in data
