from typing import Dict, Any, List

def build_unified_rag_query(input_type: str, detection_details: Dict[str, Any], features: Dict[str, Any] = None) -> str:
    query_parts = []
    risk_score = detection_details.get("risk_score", 0.0)
    
    if risk_score < 0.30:
        return "" # Safe or unknown

    if input_type == "URL":
        query_parts.append("suspicious URL")
        if features:
            if features.get("is_typosquat"): query_parts.append("typosquatting brand impersonation")
            if features.get("has_scam"): query_parts.append("phishing scam reward lure")
            if features.get("has_urgency"): query_parts.append("urgent action credential theft")
    
    elif input_type == "DOMAIN":
        query_parts.append("malicious domain")
        if features and features.get("suspicious_tld"):
            query_parts.append("suspicious TLD high risk domain")
            
    elif input_type == "IP":
        query_parts.append("malicious raw IP address host")
        
    elif input_type == "PHONE":
        query_parts.append("phone scam")
        if features:
            if features.get("suspicious_country_code"): query_parts.append("international fraud SMS routing")
            if features.get("sequential_digits"): query_parts.append("burner phone virtual number")
            
    elif input_type == "UPI":
        query_parts.append("UPI payment scam")
        if features:
            if features.get("refund_lure"): query_parts.append("refund cashback fraud")
            if features.get("suspicious_vpa"): query_parts.append("suspicious payment handle")
            
    elif input_type == "MESSAGE":
        query_parts.append("social engineering fraud SMS")
        text = detection_details.get("input_features", {}).get("message", "").lower()
        if "kyc" in text or "suspend" in text or "block" in text:
            query_parts.append("account suspension KYC verification OTP fraud")
        if "job" in text or "part-time" in text:
            query_parts.append("fake job scam recruitment fraud")
            
    return " ".join(query_parts).strip()
