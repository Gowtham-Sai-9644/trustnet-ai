import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import uuid

from app.core.database import get_db

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)
from app.schemas.analyze_schema import (
    URLAnalysisRequest, URLAnalysisResponse,
    MessageAnalysisRequest, MessageAnalysisResponse,
    FusionAnalysisRequest, FusionAnalysisResponse,
    CalibrationResult, DeterministicExplainability, ThreatIntelligence,
    LinkedInAnalysisRequest, LinkedInAnalysisResponse,
    QRAnalysisRequest, QRAnalysisResponse
)
from app.schemas.experiment_schema import ExplainabilityResponse
from app.services.ml_service import ml_pipeline
from app.services.explain_service import explain_service
from app.services.graph_service import graph_service
from app.api.v1.endpoints.unified_query_builder import build_unified_rag_query
from app.schemas.analyze_schema import ThreatIntelligence
from app.services.rag.rag_service import rag_service

router = APIRouter()

@router.post("/url", response_model=URLAnalysisResponse)
async def analyze_url(payload: URLAnalysisRequest):
    prob, features, input_type = ml_pipeline.predict_url(payload.url)
    risk_level = "CRITICAL" if prob >= 0.8 else "HIGH" if prob >= 0.5 else "MEDIUM" if prob >= 0.3 else "LOW"
    
    detection_details = {
        "risk_score": prob,
        "risk_level": risk_level,
        "category": "Suspicious URL/Domain/IP"
    }
    
    rich_query = build_unified_rag_query(input_type, detection_details, features)
    rag_resp = rag_service.explain_threat_scam(rich_query, detection_details) if rich_query else {}
    
    threat_intel = dict(
        retrieval_status=rag_resp.get("retrieval_status", "NO_RELEVANT_DOCUMENT"),
        query=rag_resp.get("query", rich_query or "None"),
        retrieved_documents=rag_resp.get("retrieved_documents", []),
        retrieved_evidence=rag_resp.get("retrieved_evidence", []),
        evidence_strength=rag_resp.get("evidence_strength", "none"),
        fused_probability=prob,
        calibration={"calibrated_probability": prob, "confidence_score": prob, "method": "heuristic"},
        detection_evidence={"feature_attribution": features, "evidence_trace": []}
    )
    
    return URLAnalysisResponse(
        url=payload.url,
        prediction_probability=prob,
        lexical_features=features,
        input_type=input_type,
        risk_level=risk_level,
        threat_intelligence=threat_intel,
        detection_evidence={"feature_attribution": features},
        llm_explanation=rag_resp.get("explanation", "")
    )

@router.post("/message", response_model=MessageAnalysisResponse)
async def analyze_message(payload: MessageAnalysisRequest):
    pred_cat, probs_info = ml_pipeline.predict_message(payload.message_text)
    probs = probs_info.get("probabilities", {})
    safe_prob = probs.get("Safe Communication", 0.0)
    risk_score = 1.0 - safe_prob if safe_prob < 0.50 else 0.0
    risk_level = "CRITICAL" if risk_score >= 0.8 else "HIGH" if risk_score >= 0.5 else "MEDIUM" if risk_score >= 0.3 else "LOW"

    detection_details = {
        "risk_score": risk_score,
        "input_features": {"message": payload.message_text},
        "risk_level": risk_level,
        "category": pred_cat
    }
    
    rich_query = build_unified_rag_query("MESSAGE", detection_details)
    rag_resp = rag_service.explain_threat_scam(rich_query, detection_details) if rich_query else {}
    
    threat_intel = dict(
        retrieval_status=rag_resp.get("retrieval_status", "NO_RELEVANT_DOCUMENT"),
        query=rag_resp.get("query", rich_query or "None"),
        retrieved_documents=rag_resp.get("retrieved_documents", []),
        retrieved_evidence=rag_resp.get("retrieved_evidence", []),
        evidence_strength=rag_resp.get("evidence_strength", "none"),
        fused_probability=risk_score,
        calibration={"calibrated_probability": risk_score, "confidence_score": risk_score, "method": "heuristic"},
        detection_evidence={"feature_attribution": probs, "evidence_trace": []}
    )
    
    return MessageAnalysisResponse(
        raw_text=payload.message_text,
        category_probabilities=probs,
        predicted_category=pred_cat,
        input_type="MESSAGE",
        risk_level=risk_level,
        threat_intelligence=threat_intel,
        detection_evidence={"feature_attribution": probs},
        llm_explanation=rag_resp.get("explanation", "")
    )

@router.post("/fusion", response_model=FusionAnalysisResponse)
async def analyze_fusion(payload: FusionAnalysisRequest, db: AsyncSession = Depends(get_db)):
    url_prob = 0.0
    nlp_prob = 0.0
    graph_prob = 0.0
    
    if payload.url:
        url_prob, url_features, url_input_type = ml_pipeline.predict_url(payload.url)
    if payload.message_text:
        pred_cat, probs_info = ml_pipeline.predict_message(payload.message_text)
        probs = probs_info.get("probabilities", {})
        # Fix: nlp_prob should be the probability of it being a SCAM. 
        # If the category is Safe Communication, the risk is 1.0 - safe_prob.
        safe_prob = probs.get("Safe Communication", 0.0)
        nlp_prob = 1.0 - safe_prob if safe_prob < 0.50 else 0.0
    if payload.upi or payload.phone:
        graph_prob, _, graph_features = ml_pipeline.predict_graph(payload.upi, payload.phone)
        
    fused_raw = ml_pipeline.predict_fusion(
        url_prob, nlp_prob, graph_prob,
        has_url=bool(payload.url),
        has_nlp=bool(payload.message_text),
        has_graph=bool(payload.upi or payload.phone)
    )
    calib_prob, confidence, method = ml_pipeline.calibrate_probability(fused_raw)
    
    # Check if Neo4j is available
    from app.core.neo4j_conn import neo4j_client
    graph_available = await neo4j_client.check_health()

    # Assign category
    pred_category = "General Threat"
    if payload.message_text:
        pred_category, _ = ml_pipeline.predict_message(payload.message_text)
    elif payload.url:
        if fused_raw > 0.50:
            pred_category = "Phishing / Credential Theft"
        else:
            pred_category = "Safe Domain"
    elif payload.upi:
        pred_category = "UPI Payment Scam"

    # Get explanation traces
    target_entity = payload.upi or payload.phone or payload.url or ""
    raw_hops = []
    if target_entity and graph_available:
        raw_hops = await graph_service.fetch_neighborhood(target_entity)
        
    trace = explain_service.format_evidence_path(raw_hops)
    shap_vals = explain_service.calculate_feature_attribution(
        url_prob=url_prob if payload.url else 0.0,
        nlp_prob=nlp_prob if payload.message_text else 0.0,
        graph_prob=graph_prob if (payload.upi or payload.phone) else 0.0
    )
    
    # Build detection details for RAG context
    detection_details = {
        "input_features": {
            "url": payload.url,
            "message": payload.message_text,
            "upi": payload.upi,
            "phone": payload.phone
        },
        "risk_score": fused_raw,
        "risk_level": "CRITICAL" if fused_raw >= 0.8 else "HIGH" if fused_raw >= 0.5 else "MEDIUM" if fused_raw >= 0.3 else "LOW",
        "category": pred_category,
        "feature_attribution": shap_vals
    }
    
    # Construct a rich query from detected features using Unified Builder
    query_parts = []
    if payload.url:
        query_parts.append(build_unified_rag_query(url_input_type if 'url_input_type' in locals() else "URL", detection_details, url_features if 'url_features' in locals() else {}))
    if payload.upi:
        query_parts.append(build_unified_rag_query("UPI", detection_details, graph_features if 'graph_features' in locals() else {}))
    if payload.phone:
        query_parts.append(build_unified_rag_query("PHONE", detection_details, graph_features if 'graph_features' in locals() else {}))
    if payload.message_text:
        query_parts.append(build_unified_rag_query("MESSAGE", detection_details))
        
    rich_query = " ".join(filter(None, query_parts)).strip()
    
    # Use RAG Service to fetch a deep contextual explanation
    from app.services.rag.rag_service import rag_service
    rag_resp = rag_service.explain_threat_scam(rich_query, detection_details)
        
    scan_id = str(uuid.uuid4())
    
    logger.info(f"[Fusion Analysis] Target: {payload.url or payload.message_text or payload.phone or payload.upi}")
    logger.info(f"    - Extracted Probabilities -> URL: {url_prob:.3f}, NLP: {nlp_prob:.3f}, Graph: {graph_prob:.3f}")
    logger.info(f"    - Feature Attributes -> {shap_vals}")
    logger.info(f"    - Prediction Results -> Fused: {fused_raw:.3f}, Calibrated: {calib_prob:.3f} (Conf: {confidence:.3f})")
    logger.info(f"    - Final Classification: {pred_category}")
    
    return FusionAnalysisResponse(
        scan_id=scan_id,
        timestamp=datetime.utcnow().isoformat() + "Z",
        scam_category=pred_category,
        raw_probabilities={
            "url_model": url_prob,
            "nlp_model": nlp_prob,
            "graph_model": graph_prob
        },
        fused_probability=fused_raw,
        calibration=CalibrationResult(
            calibrated_probability=calib_prob,
            confidence_score=confidence,
            method=method
        ),
        detection_evidence=DeterministicExplainability(
            feature_attribution=shap_vals,
            evidence_trace=trace
        ),
        threat_intelligence=ThreatIntelligence(
            retrieval_status=rag_resp.get("retrieval_status", "NO_RELEVANT_DOCUMENT"),
            query=rag_resp.get("query", rich_query),
            retrieved_documents=rag_resp.get("retrieved_documents", []),
            retrieved_evidence=rag_resp.get("retrieved_evidence", []),
            evidence_strength=rag_resp.get("evidence_strength", "none")
        ),
        llm_explanation=rag_resp.get("explanation", ""),
        graph_available=graph_available
    )

@router.get("/explainability", response_model=ExplainabilityResponse)
async def get_explainability(
    scan_id: str = Query(..., description="ID of the scan transaction to explain"),
    url_prob: float = Query(0.0),
    nlp_prob: float = Query(0.0),
    graph_prob: float = Query(0.0)
):
    # Generates deterministic explainability based on provided probabilities
    shap_vals = explain_service.calculate_feature_attribution(url_prob, nlp_prob, graph_prob)
    hops = [] # Trace visualization requires actual graph entity queries
    narrative = explain_service.generate_explanation(shap_vals, hops)
    
    logger.info(f"[Explainability] Generated for scan {scan_id}")
    
    return ExplainabilityResponse(
        scan_id=scan_id,
        shap_attributions=shap_vals,
        evidence_hops=hops,
        natural_language_explanation=narrative
    )

@router.post("/linkedin", response_model=LinkedInAnalysisResponse)
async def analyze_linkedin(payload: LinkedInAnalysisRequest):
    res = ml_pipeline.predict_linkedin(
        profile_url=payload.profile_url,
        profile_text=payload.profile_text,
        claimed_company=payload.claimed_company
    )
    return LinkedInAnalysisResponse(**res)

@router.post("/qr", response_model=QRAnalysisResponse)
async def analyze_qr(payload: QRAnalysisRequest):
    # 1. Deterministic Analysis
    res = ml_pipeline.predict_qr(
        qr_payload=payload.qr_payload,
        qr_image_b64=payload.qr_image_b64
    )
    
    # 2. Extract evidence & build query
    detection_details = {
        "input_features": {
            "qr_decoded": res.get("decoded_content"),
            "payload_type": res.get("payload_type")
        },
        "risk_score": res.get("risk_score"),
        "risk_level": res.get("risk_level"),
        "category": "QR/Image Scam",
        "feature_attribution": {}
    }
    
    query_parts = ["QR Code Scam"]
    payload_type = res.get("payload_type", "")
    risk_score = res.get("risk_score", 0.0)
    
    if payload_type == "UPI_PAYMENT_SCAM" and risk_score > 0.3:
        query_parts.append("UPI payment scam refund urgency suspicious payment handle quishing")
    elif payload_type == "PHISHING_URL" and risk_score > 0.3:
        query_parts.append("phishing credential theft brand impersonation suspicious URL quishing")
        
    rich_query = " ".join(query_parts)
    
    # 3. Retrieve RAG Evidence
    from app.services.rag.rag_service import rag_service
    rag_resp = rag_service.explain_threat_scam(rich_query, detection_details)
    
    # 4. Integrate into response
    threat_intel = dict(
        retrieval_status=rag_resp.get("retrieval_status", "NO_RELEVANT_DOCUMENT"),
        query=rag_resp.get("query", rich_query),
        retrieved_documents=rag_resp.get("retrieved_documents", []),
        retrieved_evidence=rag_resp.get("retrieved_evidence", []),
        evidence_strength=rag_resp.get("evidence_strength", "none")
    )
    
    res["threat_intelligence"] = threat_intel
    res["detection_evidence"] = {"evidence_trace": res.get("risk_indicators", [])}
    # Update the explanation to use grounded LLM text if available
    res["explanation"] = rag_resp.get("explanation", res.get("explanation", ""))
    
    return QRAnalysisResponse(**res)


