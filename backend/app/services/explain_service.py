from typing import Dict, List, Any

class ExplainabilityService:
    def calculate_feature_attribution(self, url_prob: float, nlp_prob: float, graph_prob: float) -> Dict[str, float]:
        """
        Calculates direct deterministic attribution rather than faking SHAP distributions.
        Returns the exact calculated risk contributions mapped to schema.
        """
        attributions = {}
        total_risk = url_prob + nlp_prob + graph_prob
        
        if total_risk == 0:
            return {"no_evidence_detected": 1.0}
            
        # We preserve the schema keys ("url_lexical_risk") to avoid breaking frontend mapping, 
        # but the logic is now strictly proportional to the actual heuristic trigger weight.
        if url_prob > 0.0:
            attributions["url_lexical_risk"] = round(url_prob / total_risk, 3)
        if graph_prob > 0.0:
            attributions["graph_centrality_risk"] = round(graph_prob / total_risk, 3)
        if nlp_prob > 0.0:
            attributions["nlp_lure_risk"] = round(nlp_prob / total_risk, 3)
            
        return attributions

    def generate_explanation(self, attributions: Dict[str, float], evidence_trace: List[str]) -> str:
        """
        Translates real feature attributions and graph hops into a concise narrative.
        """
        reasons = []
        
        if attributions.get("nlp_lure_risk", 0) > 0.20:
            reasons.append("suspicious NLP language indicators were detected")
        if attributions.get("graph_centrality_risk", 0) > 0.20:
            reasons.append("structural or contextual flags were found in the UPI/Phone identifier")
        if attributions.get("url_lexical_risk", 0) > 0.20:
            reasons.append("the domain exhibited typosquatting, brand impersonation, or high entropy")
            
        if not reasons:
            return "No suspicious indicators were identified based on the provided inputs."
            
        explanation = "Threat assessment influenced by: " + "; ".join(reasons) + "."
        if evidence_trace:
            explanation += f" Graph analysis traced {len(evidence_trace)} path connections."
            
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
