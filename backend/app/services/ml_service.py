import hashlib
from typing import Dict, Any, Tuple
from app.schemas.analyze_schema import CalibrationResult, DeterministicExplainability

class MLService:
    def evaluate_evidence_hierarchy(self, structural_flags: int, contextual_flags: int, direct_match: bool) -> Tuple[float, str]:
        """
        Calculates risk score based on the strict Evidence Hierarchy.
        Level 1: Direct evidence (threat intelligence match) -> 0.90+
        Level 2: Strong behavioral indicators (structural + contextual) -> 0.60-0.85
        Level 3: Weak indicators (single keyword or structure) -> 0.20-0.45
        Level 4: Unknown / Insufficient Evidence -> 0.05
        """
        if direct_match:
            return 0.95, "Level 1 - Direct Evidence"
        if structural_flags >= 1 and contextual_flags >= 1:
            score = min(0.60 + (structural_flags * 0.1) + (contextual_flags * 0.05), 0.85)
            return round(score, 3), "Level 2 - Strong Indicators"
        if structural_flags >= 1 or contextual_flags >= 1:
            score = min(0.20 + (structural_flags * 0.1) + (contextual_flags * 0.05), 0.45)
            return round(score, 3), "Level 3 - Weak Indicators"
        return 0.05, "Level 4 - Insufficient Evidence"

    def predict_url(self, url: str) -> Tuple[float, Dict[str, Any], str]:
        url_lower = url.lower().strip()
        domain_part = url_lower.replace("http://", "").replace("https://", "").split("/")[0]
        
        safe_domains = [
            "google.com", "microsoft.com", "amazon.in", "amazon.com", "github.com",
            "wikipedia.org", "linkedin.com", "facebook.com", "twitter.com", "x.com",
            "instagram.com", "apple.com", "netflix.com", "yahoo.com", "youtube.com",
            "reddit.com", "flipkart.com", "irctc.co.in", "onlinesbi.sbi"
        ]
        
        if any(domain_part == safe or domain_part.endswith("." + safe) for safe in safe_domains):
            return 0.05, {"is_safe": 1.0, "evidence_strength": "Level 4 - Insufficient Evidence", "risk_factors": 0.0}, "DOMAIN" 

        brand_targets = ["sbi", "hdfc", "icici", "axis", "paytm", "phonepe", "gpay", "google", "amazon", "flipkart", "apple", "netflix"]
        urgency_kws = ["login", "verify", "verification", "secure", "account", "update", "kyc", "otp", "password", "auth"]
        scam_kws = ["reward", "lottery", "refund", "prize", "claim", "urgent", "winner", "cashback"]
        suspicious_tlds = [".xyz", ".win", ".cfd", ".top", ".click", ".loan", ".gq", ".tk"]
        
        import re
        import math
        
        structural_flags = 0
        contextual_flags = 0
        direct_match = False
        
        if re.match(r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$", domain_part.split(':')[0]):
            structural_flags += 2
        if any(domain_part.endswith(tld) for tld in suspicious_tlds):
            structural_flags += 1
            
        entropy = sum(- (domain_part.count(c) / len(domain_part)) * math.log2(domain_part.count(c) / len(domain_part)) for c in set(domain_part))
        if entropy > 4.0:
            structural_flags += 1
            
        dash_count = domain_part.count("-")
        dot_count = domain_part.count(".")
        if dash_count >= 2: structural_flags += 1
        if dot_count >= 3: structural_flags += 1
            
        has_brand = any(brand in domain_part for brand in brand_targets)
        has_urgency = any(urg in url_lower for urg in urgency_kws)
        has_scam = any(scam in url_lower for scam in scam_kws)
        
        if has_brand: contextual_flags += 1
        if has_urgency: contextual_flags += 1
        if has_scam: contextual_flags += 2
        
        risk_score, strength = self.evaluate_evidence_hierarchy(structural_flags, contextual_flags, direct_match)
        
        input_type = "URL"
        if re.match(r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$", domain_part.split(':')[0]):
            input_type = "IP"
        elif "/" not in url.replace("http://", "").replace("https://", ""):
            input_type = "DOMAIN"
            
        features = {
            "length": float(len(url)),
            "entropy": round(entropy, 2),
            "evidence_strength": strength,
            "structural_flags": structural_flags,
            "contextual_flags": contextual_flags,
            "is_typosquat": dash_count >= 2,
            "has_scam": has_scam,
            "has_urgency": has_urgency,
            "suspicious_tld": any(domain_part.endswith(tld) for tld in suspicious_tlds)
        }
        return risk_score, features, input_type

    def predict_message(self, text: str) -> Tuple[str, Dict[str, Any]]:
        categories = [
            "Fake Job Scam", "Fake KYC Scam", "Lottery Scam", 
            "Marketplace Scam", "Investment Scam", "Advance Payment Scam",
            "Safe Communication"
        ]
        
        text_lower = text.lower()
        contextual_flags = 0
        structural_flags = 0
        
        if any(kw in text_lower for kw in ["kyc", "account suspended", "blocked", "update account"]): contextual_flags += 2
        if any(kw in text_lower for kw in ["lottery", "won", "prize", "free gift"]): contextual_flags += 2
        if any(kw in text_lower for kw in ["part-time", "work from home", "salary"]): contextual_flags += 1
        if any(kw in text_lower for kw in ["investment", "profit", "crypto", "returns"]): contextual_flags += 1
        
        # Urgency + Action combination
        has_urgency = any(kw in text_lower for kw in ["urgent", "immediately", "today", "within 24 hours"])
        has_action = any(kw in text_lower for kw in ["pay", "click", "otp", "password", "pin", "verify"])
        
        if has_urgency: structural_flags += 1
        if has_action: structural_flags += 1
        
        # Contextual negations (legitimate context)
        if "delivery" in text_lower or "bill" in text_lower or "meeting" in text_lower or "coffee" in text_lower:
            contextual_flags = 0
            structural_flags = 0
            
        risk_score, strength = self.evaluate_evidence_hierarchy(structural_flags, contextual_flags, False)
        
        scores = {cat: 0.05 for cat in categories}
        if risk_score > 0.40:
            if "kyc" in text_lower or "account" in text_lower: scores["Fake KYC Scam"] = risk_score
            elif "lottery" in text_lower or "prize" in text_lower: scores["Lottery Scam"] = risk_score
            elif "job" in text_lower or "part-time" in text_lower: scores["Fake Job Scam"] = risk_score
            elif "investment" in text_lower: scores["Investment Scam"] = risk_score
            else: scores["Advance Payment Scam"] = risk_score
        else:
            scores["Safe Communication"] = 0.90
            
        total = sum(scores.values())
        probs = {cat: round(score / total, 3) for cat, score in scores.items()}
        pred = max(probs, key=probs.get)
        
        return pred, {"probabilities": probs, "evidence_strength": strength}

    def predict_graph(self, upi: str, phone: str) -> Tuple[float, str, Dict[str, Any]]:
        if not upi and not phone:
            return 0.05, "Level 4 - Insufficient Evidence", {}
            
        structural_flags = 0
        contextual_flags = 0
        features = {}
        
        if phone:
            if phone.startswith("+2") or phone.startswith("+3") or phone.startswith("+8") or phone.startswith("+44"):
                structural_flags += 2
                features["suspicious_country_code"] = True
            if "0000" in phone or "9999" in phone:
                structural_flags += 1
                features["sequential_digits"] = True
                
        if upi:
            upi_lower = upi.lower()
            suspicious_upi_terms = ["refund", "claim", "prize", "cashback", "support", "kyc", "verify", "offer"]
            
            username_part = upi_lower.split("@")[0] if "@" in upi_lower else upi_lower
            if any(term in username_part for term in suspicious_upi_terms):
                contextual_flags += 1
                features["refund_lure"] = True
                
            handle = upi_lower.split("@")[1] if "@" in upi_lower else ""
            if "." in handle and not handle.endswith("sbi") and not handle.endswith("icici"):
                if handle.endswith(".cfd") or handle.endswith(".top") or handle.endswith(".xyz"):
                    structural_flags += 2
                    features["suspicious_vpa"] = True
                
        score, strength = self.evaluate_evidence_hierarchy(structural_flags, contextual_flags, False)
        return score, strength, features

    def predict_fusion(self, url_prob: float, nlp_prob: float, graph_prob: float, has_url: bool, has_nlp: bool, has_graph: bool) -> float:
        """
        Cross-Modality Correlation: If multiple modalities trigger Level 2+, amplify risk.
        """
        scores = []
        if has_url: scores.append(url_prob)
        if has_nlp: scores.append(nlp_prob)
        if has_graph: scores.append(graph_prob)
        
        if not scores: return 0.05
        
        base_fusion = sum(scores) / len(scores)
        strong_signals = sum(1 for s in scores if s >= 0.60)
        
        if strong_signals >= 2:
            return min(base_fusion + 0.20, 0.99) # Amplification due to cross-modality correlation
        return base_fusion

    def calibrate_probability(self, raw_prob: float) -> Tuple[float, float, str]:
        """
        No ML calibration model is currently trained, so we return the raw probability.
        Confidence is explicitly set to 0.0 to prevent hallucinated frontend stats.
        """
        return float(raw_prob), 0.0, "not_calibrated"

    def predict_linkedin(self, profile_url: str = None, profile_text: str = None, claimed_company: str = None) -> Dict[str, Any]:
        import datetime
        import numpy as np
        
        url = (profile_url or "").strip()
        text = (profile_text or "").strip()
        company = (claimed_company or "").strip()
        
        target = url or company or "LinkedIn Target Profile"
        
        # 1. Feature Extraction for Random Forest
        url_lower = url.lower()
        text_lower = text.lower()
        
        is_official = False
        if "linkedin.com/in/" in url_lower or "linkedin.com/jobs/" in url_lower or "linkedin.com/company/" in url_lower:
            is_official = True
            
        typosquat_patterns = ["linkedn", "linked-in", "linkedin-auth", "linkedin-verify", "linkedin-jobs", "lnkedin", "linkdin"]
        suspicious_tlds = [".top", ".cfd", ".xyz", ".click", ".win", ".gq", ".tk", ".site"]
        
        f_typosquat = 1 if any(p in url_lower for p in typosquat_patterns) else 0
        f_sus_tld = 1 if any(url_lower.endswith(tld) or (tld + "/") in url_lower for tld in suspicious_tlds) else 0
        f_text_vol = min(1.0, len(text) / 500.0) # Normalize up to 500 chars
        
        lure_keywords = {
            "hr_recruiter_fake": ["hr manager", "talent acquisition", "urgent hiring", "part-time job", "work from home"],
            "financial_lure": ["$500/day", "daily payout", "earn $", "no experience required", "crypto investment"],
            "off_platform": ["whatsapp me", "telegram me", "contact on whatsapp", "send money", "registration fee", "processing fee"],
            "urgency": ["immediate joining", "limited spots", "apply within 1 hour", "offer expires"]
        }
        
        f_off_platform = 1 if any(kw in text_lower for kw in lure_keywords["off_platform"]) else 0
        f_financial = 1 if any(kw in text_lower for kw in lure_keywords["financial_lure"]) else 0
        f_urgency = 1 if any(kw in text_lower for kw in lure_keywords["urgency"]) else 0
        f_fake_hr = 1 if any(kw in text_lower for kw in lure_keywords["hr_recruiter_fake"]) else 0
        
        # Extract matches for explanations
        detected_lures = []
        for kws in lure_keywords.values():
            detected_lures.extend([kw for kw in kws if kw in text_lower])
        
        # 2. Heuristic Scoring (Replacing missing RF model)
        risk_score = 0.15 # base
        if f_typosquat: risk_score += 0.40
        if f_sus_tld: risk_score += 0.35
        if f_off_platform: risk_score += 0.25
        if f_financial: risk_score += 0.30
        if f_urgency: risk_score += 0.20
        if f_fake_hr: risk_score += 0.25
        
        # 3. Explainability - Feature Contributions
        risk_indicators = []
        if f_typosquat: risk_indicators.append("Typosquatting LinkedIn domain detected")
        if f_sus_tld: risk_indicators.append("High-risk TLD detected in profile link")
        if f_off_platform: risk_indicators.append("Off-platform redirection lure detected")
        if f_financial: risk_indicators.append("Unrealistic financial/job lure detected")
        if f_fake_hr: risk_indicators.append("Generic fake recruiter bait detected")
        if f_urgency: risk_indicators.append("Coercive urgency tactics detected")
        if f_text_vol < 0.2 and risk_score > 0.4: risk_indicators.append("Suspiciously sparse profile text")
        
        # Calibration bounds
        risk_score = round(min(max(risk_score, 0.05), 0.98), 3)
        
        if risk_score >= 0.80:
            risk_level = "CRITICAL"
        elif risk_score >= 0.50:
            risk_level = "HIGH"
        elif risk_score >= 0.30:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
            
        is_suspicious = risk_score >= 0.45
        
        explanation = (
            f"Heuristic Detection Engine evaluated target '{target}' at a {int(risk_score * 100)}% risk probability ({risk_level}). "
            + (f"Key heuristic triggers: {'; '.join(risk_indicators)}." if risk_indicators else "No high-risk ML features detected.")
        )
        
        return {
            "scan_id": f"LN-{int(now.timestamp())}",
            "target": target,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "is_suspicious": is_suspicious,
            "domain_analysis": {"is_official": is_official, "is_typosquat": f_typosquat, "url": url},
            "lure_analysis": {"detected_lures": detected_lures, "text_length": len(text)},
            "risk_indicators": risk_indicators or ["No critical risk markers found"],
            "explanation": explanation,
            "forensic_timeline": [],
            "evidence_locker": []
        }

    def predict_qr(self, qr_payload: str = None, qr_image_b64: str = None) -> Dict[str, Any]:
        import base64
        import datetime
        import urllib.parse
        import re
        
        now = datetime.datetime.utcnow()
        decoded_text = (qr_payload or "").strip()
        
        if qr_image_b64 and not decoded_text:
            import cv2
            import numpy as np
            try:
                raw_bytes = base64.b64decode(qr_image_b64.split(",")[-1])
                nparr = np.frombuffer(raw_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                detector = cv2.QRCodeDetector()
                data, bbox, _ = detector.detectAndDecode(img)
                if data:
                    decoded_text = data
                else:
                    decoded_text = ""
            except Exception:
                decoded_text = ""

        if not decoded_text:
            # Return a graceful failure if no QR code could be read
            now = datetime.datetime.utcnow()
            return {
                "scan_id": f"QR-{int(now.timestamp())}",
                "target": "Unreadable / Empty QR Code",
                "payload_type": "UNKNOWN",
                "decoded_content": "",
                "risk_level": "LOW",
                "risk_score": 0.0,
                "is_suspicious": False,
                "upi_details": None,
                "url_details": None,
                "risk_indicators": ["Failed to detect or decode QR code from the provided image."],
                "explanation": "The image provided did not contain a readable QR code. Analysis could not be performed.",
                "forensic_timeline": [],
                "evidence_locker": []
            }

        target = decoded_text[:40] + ("..." if len(decoded_text) > 40 else "")
        risk_score = 0.15
        risk_indicators = []
        payload_type = "UNKNOWN"
        upi_details = None
        url_details = None
        
        decoded_lower = decoded_text.lower()
        
        if decoded_lower.startswith("upi://pay") or "pa=" in decoded_lower:
            payload_type = "UPI_PAYMENT_SCAM"
            parsed = urllib.parse.parse_qs(urllib.parse.urlparse(decoded_text).query)
            pa = parsed.get("pa", ["unknown@upi"])[0]
            pn = parsed.get("pn", ["Merchant"])[0]
            am = parsed.get("am", ["0"])[0]
            tn = parsed.get("tn", [""])[0]
            
            upi_details = {"vpa": pa, "payee_name": pn, "amount": am, "note": tn}
            
            scam_claims = ["refund", "receive", "cashback", "bonus", "reward", "prize", "claim", "credit", "gov", "subsidy"]
            combined_text = (pn + " " + tn).lower()
            
            if any(claim in combined_text for claim in scam_claims):
                risk_score += 0.70
                risk_indicators.append(f"Reverse UPI Payment Fraud: QR code uses debit URI 'upi://pay' while claiming '{pn or tn}' to trick victim into approving payment")
            try:
                if float(am) > 2000:
                    risk_score += 0.20
                    risk_indicators.append(f"High-value unverified payment request (₹{am})")
            except Exception:
                pass
            if "mule" in pa.lower() or "scam" in pa.lower() or pa.endswith(".cfd") or pa.endswith(".top"):
                risk_score += 0.30
                risk_indicators.append(f"Suspicious VPA handle structure: {pa}")
                
        elif decoded_lower.startswith("http://") or decoded_lower.startswith("https://"):
            payload_type = "PHISHING_URL"
            url_prob, lexical, _ = self.predict_url(decoded_text)
            risk_score = max(risk_score, url_prob)
            url_details = {"url": decoded_text, "lexical": lexical}
            if url_prob > 0.5:
                risk_indicators.append(f"Quishing attack: QR links to high-risk phishing URL ({decoded_text})")
            else:
                risk_indicators.append("QR code contains external Web URL")
        else:
            payload_type = "SAFE_TEXT"
            risk_indicators.append("Standard text QR payload")
            
        risk_score = round(min(max(risk_score, 0.05), 0.99), 3)
        
        if risk_score >= 0.80:
            risk_level = "CRITICAL"
        elif risk_score >= 0.50:
            risk_level = "HIGH"
        elif risk_score >= 0.30:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
            
        is_suspicious = risk_score >= 0.45
        
        explanation = (
            f"QR Code investigation ({payload_type}) evaluated risk score at {int(risk_score * 100)}% ({risk_level}). "
            + (f"Triggers: {'; '.join(risk_indicators)}." if risk_indicators else "No high-risk payload anomalies found.")
        )
        
        return {
            "scan_id": f"QR-{int(now.timestamp())}",
            "target": target,
            "payload_type": payload_type,
            "decoded_content": decoded_text,
            "risk_level": risk_level,
            "risk_score": risk_score,
            "is_suspicious": is_suspicious,
            "upi_details": upi_details,
            "url_details": url_details,
            "risk_indicators": risk_indicators or ["Standard QR payload, no threat indicators detected."],
            "explanation": explanation,
            "forensic_timeline": [],
            "evidence_locker": []
        }

ml_pipeline = MLService()
