from fastapi.testclient import TestClient

def test_submit_report_success(client: TestClient):
    response = client.post("/api/v1/reports", json={
        "reported_phone": "+919876543210",
        "reported_upi": "scammer@upi",
        "reported_url": "https://suspicious-store.com",
        "scam_category": "Marketplace Scam",
        "description": "Seller took deposit money and blocked my WhatsApp contact.",
        "loss_amount": 5000.0
    })
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "success"
    assert "report_id" in data

def test_submit_report_missing_coordinates(client: TestClient):
    # Missing all entity check values (phone, upi, url)
    response = client.post("/api/v1/reports", json={
        "scam_category": "Marketplace Scam",
        "description": "Seller took deposit money and blocked my WhatsApp contact.",
        "loss_amount": 5000.0
    })
    assert response.status_code == 400
    assert "At least one identifier" in response.json()["detail"]
