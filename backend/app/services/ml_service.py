import hashlib
from typing import Dict, Any, Tuple
from app.schemas.analyze_schema import CalibrationResult, ShapAttributions

class MLService:
    def predict_url(self, url: str) -> Tuple[float, Dict[str, float]]:
        """
        Input: 
            url (str): Target URL string.
        Output:
            Tuple containing:
            - probability (float): Model score between 0.0 and 1.0.
            - lexical_features (Dict[str, float]): Computed feature values.
        """
        length = float(len(url))
        dots = float(url.count('.'))
        digits = float(sum(c.isdigit() for c in url))
        entropy = 3.5 + (length % 5) / 10.0
        
        # Simple deterministic hash for mock probability
        hash_val = int(hashlib.md5(url.encode()).hexdigest(), 16)
        prob = (hash_val % 1000) / 1000.0
        
        features = {
            "length": length,
            "dots_count": dots,
            "digits_ratio": digits / max(length, 1.0),
            "entropy": entropy
        }
        return prob, features

    def predict_message(self, text: str) -> Tuple[str, Dict[str, float]]:
        """
        Input: 
            text (str): Incoming message lure string.
        Output:
            Tuple containing:
            - predicted_category (str): Target classification label.
            - probabilities (Dict[str, float]): Category distributions.
        """
        categories = [
            "Fake Job Scam", "Fake KYC Scam", "Lottery Scam", 
            "Marketplace Scam", "Investment Scam", "Advance Payment Scam"
        ]
        
        # Determine label based on matching keywords
        text_lower = text.lower()
        if "kyc" in text_lower or "paytm" in text_lower or "block" in text_lower:
            pred = "Fake KYC Scam"
        elif "lottery" in text_lower or "won" in text_lower or "prize" in text_lower:
            pred = "Lottery Scam"
        elif "job" in text_lower or "salary" in text_lower or "part-time" in text_lower:
            pred = "Fake Job Scam"
        elif "olx" in text_lower or "advance" in text_lower or "shipping" in text_lower:
            pred = "Marketplace Scam"
        elif "investment" in text_lower or "profit" in text_lower or "returns" in text_lower:
            pred = "Investment Scam"
        else:
            pred = "Advance Payment Scam"
            
        # Distribute mock probabilities with bias to target pred
        probs = {}
        for cat in categories:
            if cat == pred:
                probs[cat] = 0.75
            else:
                probs[cat] = 0.05
        return pred, probs

    def predict_graph(self, upi: str, phone: str) -> float:
        """
        Input: 
            upi (str): Payment target UPI ID.
            phone (str): Sender phone.
        Output:
            probability (float): Graph-level risk score.
        """
        # Return elevated score for typical mock triggers
        target = upi or phone or ""
        hash_val = int(hashlib.md5(target.encode()).hexdigest(), 16)
        return (hash_val % 100) / 100.0

    def predict_fusion(self, url_prob: float, nlp_prob: float, graph_prob: float) -> float:
        """
        Input:
            url_prob (float): Model risk for URL.
            nlp_prob (float): Model risk for NLP.
            graph_prob (float): Model risk for Graph.
        Output:
            probability (float): Consolidated meta-model scam score.
        """
        # Weighted fusion average
        return (url_prob * 0.25) + (nlp_prob * 0.45) + (graph_prob * 0.30)

    def calibrate_probability(self, raw_prob: float) -> Tuple[float, float, str]:
        """
        Input:
            raw_prob (float): Consolidated raw score.
        Output:
            Tuple containing:
            - calibrated_probability (float)
            - confidence_score (float)
            - method (str)
        """
        # Emulate isotonic scaling shifts
        calibrated = raw_prob * 0.95 if raw_prob > 0.5 else raw_prob * 0.85
        confidence = 0.90 + (raw_prob % 0.1)
        return float(calibrated), float(confidence), "isotonic"

ml_pipeline = MLService()
