from pydantic import BaseModel
from typing import Dict, Any, List

class ExperimentRunResponse(BaseModel):
    experiment_id: str
    name: str
    category: str
    parameters: Dict[str, Any]
    metrics: Dict[str, Any]
    created_at: str

class ExplainabilityResponse(BaseModel):
    scan_id: str
    shap_attributions: Dict[str, float]
    evidence_hops: List[str]
    natural_language_explanation: str
