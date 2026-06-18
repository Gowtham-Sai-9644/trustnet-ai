from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Dict

# URL Analysis
class URLAnalysisRequest(BaseModel):
    url: str = Field(..., description="Target website URL to analyze for phishing characteristics")

class URLAnalysisResponse(BaseModel):
    url: str
    prediction_probability: float
    lexical_features: Dict[str, float]


# Message Analysis
class MessageAnalysisRequest(BaseModel):
    message_text: str = Field(..., min_length=10, description="The message content to check for fraud indicators")

class MessageAnalysisResponse(BaseModel):
    raw_text: str
    category_probabilities: Dict[str, float]
    predicted_category: str


# Fused Multi-Modal Analysis
class FusionAnalysisRequest(BaseModel):
    url: Optional[str] = None
    phone: Optional[str] = None
    upi: Optional[str] = None
    message_text: Optional[str] = None

class CalibrationResult(BaseModel):
    calibrated_probability: float
    confidence_score: float
    method: str

class ShapAttributions(BaseModel):
    shap_values: Dict[str, float]
    evidence_trace: list
    human_readable_explanation: str

class FusionAnalysisResponse(BaseModel):
    scan_id: str
    timestamp: str
    scam_category: str
    raw_probabilities: Dict[str, float]
    fused_probability: float
    calibration: CalibrationResult
    explainability: ShapAttributions
    graph_available: bool
