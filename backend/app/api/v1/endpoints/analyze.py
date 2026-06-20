from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import uuid

from app.core.database import get_db
from app.schemas.analyze_schema import (
    URLAnalysisRequest, URLAnalysisResponse,
    MessageAnalysisRequest, MessageAnalysisResponse,
    FusionAnalysisRequest, FusionAnalysisResponse,
    CalibrationResult, ShapAttributions
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
    shap_vals = explain_service.get_mock_shap_values(
        url_prob=url_prob if payload.url else 0.0,
        nlp_prob=nlp_prob if payload.message_text else 0.0,
        graph_prob=graph_prob if (payload.upi or payload.phone) else 0.0
    )
    explanation = explain_service.generate_explanation(shap_vals, trace)
    
    # Assign category
    pred_category = "Advance Payment Scam"
    if payload.message_text:
        pred_category, _ = ml_pipeline.predict_message(payload.message_text)
    elif payload.url and fused_raw > 0.50:
        pred_category = "Phishing / Credential Theft"
        
    scan_id = str(uuid.uuid4())
    
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
async def get_explainability(scan_id: str = Query(..., description="ID of the scan transaction to explain")):
    # Returns mock explainability vectors for visual rendering
    shap_vals = {"url_lexical_risk": 0.12, "nlp_lure_risk": 0.45, "graph_centrality_risk": 0.38}
    hops = ["olxdeals@upi -[ASSOCIATED_WITH]-> +919876543210"]
    narrative = explain_service.generate_explanation(shap_vals, hops)
    
    return ExplainabilityResponse(
        scan_id=scan_id,
        shap_attributions=shap_vals,
        evidence_hops=hops,
        natural_language_explanation=narrative
    )
