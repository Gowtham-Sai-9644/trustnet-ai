import pytest
import numpy as np
from backend.app.services.ml_service import ml_pipeline
from backend.app.services.explain_service import explain_service

def test_url_lexical_feature_extraction():
    url = "https://win-lotto-free-rewards.cfd/verify"
    prob, features = ml_pipeline.predict_url(url)
    assert 0.0 <= prob <= 1.0
    assert "length" in features
    assert "entropy" in features
    assert features["dots_count"] == 1.0

def test_multilingual_message_keyword_classification():
    # 1. Lottery Scam
    scam_text = "Congratulations! You have won Rs 50,000 lottery cash prize."
    pred_cat, probs = ml_pipeline.predict_message(scam_text)
    assert pred_cat == "Lottery Scam"
    assert probs["Lottery Scam"] == 0.75
    
    # 2. Fake KYC Scam
    pred_cat, _ = ml_pipeline.predict_message("Please verify your KYC immediately or your Paytm account will be blocked.")
    assert pred_cat == "Fake KYC Scam"
    
    # 3. Fake Job Scam
    pred_cat, _ = ml_pipeline.predict_message("Part-time job offer: earn 5000 Rs daily salary.")
    assert pred_cat == "Fake Job Scam"
    
    # 4. Marketplace Scam
    pred_cat, _ = ml_pipeline.predict_message("Please buy this on OLX and pay advance shipping fee.")
    assert pred_cat == "Marketplace Scam"
    
    # 5. Investment Scam
    pred_cat, _ = ml_pipeline.predict_message("Guaranteed high returns investment scheme with 200% profit.")
    assert pred_cat == "Investment Scam"
    
    # 6. Advance Payment Scam
    pred_cat, _ = ml_pipeline.predict_message("Send security deposit to claim your package.")
    assert pred_cat == "Advance Payment Scam"

def test_predict_graph():
    prob = ml_pipeline.predict_graph("test@upi", "9876543210")
    assert 0.0 <= prob <= 1.0

def test_predict_fusion():
    prob = ml_pipeline.predict_fusion(0.5, 0.6, 0.7)
    assert 0.0 <= prob <= 1.0

def test_probability_calibration():
    raw_val = 0.85
    calibrated, confidence, method = ml_pipeline.calibrate_probability(raw_val)
    assert calibrated < raw_val
    assert 0.0 <= confidence <= 1.0
    assert method == "isotonic"
    
    # Test low probability calibration branch
    calibrated_low, _, _ = ml_pipeline.calibrate_probability(0.2)
    assert calibrated_low < 0.2

def test_shap_explanation_translation():
    # Test reasons matching
    shap_vals = {"nlp_lure_risk": 0.35, "graph_centrality_risk": 0.28, "url_lexical_risk": 0.15}
    evidence = ["winlotto@upi -> REPORTED_AS -> Report #1"]
    explanation = explain_service.generate_explanation(shap_vals, evidence)
    assert "lottery" in explanation.lower()
    assert "scam" in explanation.lower()
    assert "lexical" in explanation.lower()
    
    # Test no reasons matching branch
    empty_shap = {}
    explanation_empty = explain_service.generate_explanation(empty_shap, [])
    assert "no significant scam signatures" in explanation_empty.lower()

def test_format_evidence_path():
    raw = [
        {
            "n": {"upi_id": "test@upi"},
            "m": {"report_id": "rep_123"},
            "r": {"type": "REPORTED_AS"}
        }
    ]
    paths = explain_service.format_evidence_path(raw)
    assert len(paths) == 1
    assert "test@upi -[REPORTED_AS]-> rep_123" in paths[0]
