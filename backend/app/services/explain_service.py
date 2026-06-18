from typing import Dict, List, Any

class ExplainabilityService:
    def get_mock_shap_values(self, url: str, upi: str, message: str) -> Dict[str, float]:
        """
        Returns mock SHAP values representing feature impacts on the meta model output.
        """
        shap_vals = {}
        if url:
            shap_vals["url_lexical_risk"] = 0.18 if "cheap" in url or "free" in url else 0.05
        if upi:
            shap_vals["graph_centrality_risk"] = 0.35 if "deal" in upi else 0.08
        if message:
            shap_vals["nlp_lure_risk"] = 0.42 if "lottery" in message.lower() or "won" in message.lower() else 0.12
            
        # Add baseline check parameters
        shap_vals["base_value"] = 0.10
        return shap_vals

    def generate_explanation(self, shap_values: Dict[str, float], evidence_trace: List[str]) -> str:
        """
        Translates raw SHAP weights and graph hops into a concise human-readable narrative.
        """
        reasons = []
        
        if shap_values.get("nlp_lure_risk", 0) > 0.20:
            reasons.append("the messaging structure uses urgent lottery or prize-claim phrasing")
        if shap_values.get("graph_centrality_risk", 0) > 0.20:
            reasons.append("the payment identifier is linked to a cluster of recent complaints")
        if shap_values.get("url_lexical_risk", 0) > 0.10:
            reasons.append("the domain employs lexical obfuscation tactics")
            
        if not reasons:
            reasons.append("no significant scam signatures were identified in this query")
            
        explanation = "Scam risk is heightened because: " + ", and ".join(reasons) + "."
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
