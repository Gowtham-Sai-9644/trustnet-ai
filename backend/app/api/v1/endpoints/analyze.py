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
    CalibrationResult, ShapAttributions,
    LinkedInAnalysisRequest, LinkedInAnalysisResponse,
    QRAnalysisRequest, QRAnalysisResponse
)
from app.schemas.experiment_schema import ExplainabilityResponse
from app.services.ml_service import ml_pipeline
from app.services.explain_service import explain_service
from app.services.graph_service import graph_service

router = APIRouter()

@router.post("/url", response_model=URLAnalysisResponse)
async def analyze_url(payload: URLAnalysisRequest):
    prob, features = ml_pipeline.predict_url(payload.url)
    return URLAnalysisResponse(
        url=payload.url,
        prediction_probability=prob,
        lexical_features=features
    )

@router.post("/message", response_model=MessageAnalysisResponse)
async def analyze_message(payload: MessageAnalysisRequest):
    pred_cat, probs = ml_pipeline.predict_message(payload.message_text)
    return MessageAnalysisResponse(
        raw_text=payload.message_text,
        category_probabilities=probs,
        predicted_category=pred_cat
    )

@router.post("/fusion", response_model=FusionAnalysisResponse)
async def analyze_fusion(payload: FusionAnalysisRequest, db: AsyncSession = Depends(get_db)):
    url_prob = 0.0
    nlp_prob = 0.0
    graph_prob = 0.0
    
    if payload.url:
        url_prob, _ = ml_pipeline.predict_url(payload.url)
    if payload.message_text:
        pred_cat, probs = ml_pipeline.predict_message(payload.message_text)
        nlp_prob = probs.get(pred_cat, 0.0)
    if payload.upi or payload.phone:
        graph_prob = ml_pipeline.predict_graph(payload.upi, payload.phone)
        
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
    explanation = explain_service.generate_explanation(shap_vals, trace)
    
    # Assign category
    pred_category = "General Threat"
    if payload.message_text:
        pred_category, _ = ml_pipeline.predict_message(payload.message_text)
    elif payload.url:
        if fused_raw > 0.50:
            pred_category = "Phishing / Credential Theft"
        else:
            pred_category = "Safe Domain"
        
    scan_id = str(uuid.uuid4())
    
    logger.info(f"[Fusion Analysis] Target: {payload.url or payload.message_text or payload.phone or payload.upi}")
    logger.info(f"    - Extracted Probabilities -> URL: {url_prob:.3f}, NLP: {nlp_prob:.3f}, Graph: {graph_prob:.3f}")
    logger.info(f"    - Feature Attributes -> {shap_vals}")
    logger.info(f"    - Prediction Results -> Fused: {fused_raw:.3f}, Calibrated: {calib_prob:.3f} (Conf: {confidence:.3f})")
    logger.info(f"    - Final Classification: {pred_category}")
    logger.info(f"    - Explanation Generated: {explanation}")
    
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
        explainability=ShapAttributions(
            shap_values=shap_vals,
            evidence_trace=trace,
            human_readable_explanation=explanation
        ),
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
    res = ml_pipeline.predict_qr(
        qr_payload=payload.qr_payload,
        qr_image_b64=payload.qr_image_b64
    )
    return QRAnalysisResponse(**res)

