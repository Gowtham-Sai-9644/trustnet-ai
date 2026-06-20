from typing import Dict, List, Any

class ExplainabilityService:
    def get_mock_shap_values(self, url_prob: float, nlp_prob: float, graph_prob: float) -> Dict[str, float]:
        """
        Returns mock SHAP values representing feature impacts on the meta model output based on actual scores.
        """
        shap_vals = {}
        if url_prob > 0.0:
            shap_vals["url_lexical_risk"] = url_prob * 0.45
        if graph_prob > 0.0:
            shap_vals["graph_centrality_risk"] = graph_prob * 0.35
        if nlp_prob > 0.0:
            shap_vals["nlp_lure_risk"] = nlp_prob * 0.42
            
        # Add baseline check parameters
        shap_vals["base_value"] = 0.10
        return shap_vals

    def generate_explanation(self, shap_values: Dict[str, float], evidence_trace: List[str]) -> str:
        """
        Translates raw SHAP weights and graph hops into a concise human-readable narrative.
        """
        reasons = []
        
        if shap_values.get("nlp_lure_risk", 0) > 0.30:
            reasons.append("the messaging structure uses urgent lottery or prize-claim phrasing")
        if shap_values.get("graph_centrality_risk", 0) > 0.30:
            reasons.append("the payment identifier is linked to a cluster of recent complaints")
        if shap_values.get("url_lexical_risk", 0) > 0.30:
            reasons.append("the domain uses phishing keywords, brand impersonation, or suspicious top-level domains")
            
        if not reasons:
            reasons.append("no significant scam signatures were identified in this query")
            
        explanation = "Scam risk is heightened because: " + ", and ".join(reasons) + "." if "no significant" not in reasons[0] else reasons[0]
        if evidence_trace:
            explanation += f" Graph analysis traced {len(evidence_trace)} direct path connections back to reported fraud networks."
            
        return explanation

    def format_evidence_path(self, raw_relations: List[Dict[str, Any]]) -> List[str]:
        """
        Transforms raw Neo4j records into path strings for user interfaces.
        """
        paths = []
        for item in raw_relations:
            src = item.get("n", {}).get("upi_id") or item.get("n", {}).get("phone_number") or "Entity"
            tgt = item.get("m", {}).get("report_id") or item.get("m", {}).get("upi_id") or "Target"
            rel = item.get("r", {}).get("type") or "LINKS_TO"
            paths.append(f"{src} -[{rel}]-> {tgt}")
        return paths

explain_service = ExplainabilityService()
