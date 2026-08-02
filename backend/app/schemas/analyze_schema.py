from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Dict, Any, List

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


# LinkedIn Analysis
class LinkedInAnalysisRequest(BaseModel):
    profile_url: Optional[str] = Field(None, description="LinkedIn profile URL or job offer URL to analyze")
    profile_text: Optional[str] = Field(None, description="Bio text, message text, or job description")
    claimed_company: Optional[str] = Field(None, description="Claimed company or employer name")

class LinkedInAnalysisResponse(BaseModel):
    scan_id: str
    target: str
    risk_level: str
    risk_score: float
    is_suspicious: bool
    domain_analysis: Dict[str, Any]
    lure_analysis: Dict[str, Any]
    risk_indicators: List[str]
    explanation: str
    forensic_timeline: List[Dict[str, Any]]
    evidence_locker: List[Dict[str, Any]]


# QR Code Analysis
class QRAnalysisRequest(BaseModel):
    qr_payload: Optional[str] = Field(None, description="Decoded QR payload string or URL")
    qr_image_b64: Optional[str] = Field(None, description="Base64 encoded QR image")

class QRAnalysisResponse(BaseModel):
    scan_id: str
    target: str
    payload_type: str
    decoded_content: str
    risk_level: str
    risk_score: float
    is_suspicious: bool
    upi_details: Optional[Dict[str, Any]] = None
    url_details: Optional[Dict[str, Any]] = None
    risk_indicators: List[str]
    explanation: str
    forensic_timeline: List[Dict[str, Any]]
    evidence_locker: List[Dict[str, Any]]


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

