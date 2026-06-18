from typing import List, Dict, Any

class PromptBuilder:
    def build_qa_response(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        """
        Compiles retrieved context blocks into an educational advisory response.
        """
        if not context_docs:
            return "No official advisories or guidelines were found matching your query. Please cross-reference with official resources like cybercrime.gov.in."
            
        primary_doc = context_docs[0]["text"]
        source_name = context_docs[0]["metadata"].get("source", "Advisory Document")
        
        # Emulate LLM RAG synthesis using context details
        response = f"### Cyber Threat Advisory Analysis\n\n"
        response += f"Based on research logs retrieved from `{source_name}`:\n\n"
        
        # Extract sections of document text
        lines = [line.strip() for line in primary_doc.split("\n") if line.strip()]
        overview = ""
        warning_signs = []
        recommendations = []
        
        current_sec = None
        for line in lines:
            if line.startswith("#"):
                continue
            if "Overview" in line:
                current_sec = "overview"
                continue
            elif "Warning Signs" in line:
                current_sec = "warnings"
                continue
            elif "RBI Recommendations" in line or "Prevention Guidance" in line or "Safe Practices" in line:
                current_sec = "prevention"
                continue
                
            if current_sec == "overview" and not overview:
                overview = line
            elif current_sec == "warnings" and line.startswith("*"):
                warning_signs.append(line.replace("*", "-"))
            elif current_sec == "prevention" and line.startswith("*"):
                recommendations.append(line.replace("*", "✔"))

        if overview:
            response += f"**Context & Luring Mechanism**:\n{overview}\n\n"
        if warning_signs:
            response += f"**Key Threat Indicators**:\n" + "\n".join(warning_signs) + "\n\n"
        if recommendations:
            response += f"**Official Safety Advisories & Actions**:\n" + "\n".join(recommendations) + "\n\n"
            
        response += "*Disclaimer: This information is sourced from certified guidelines to assist users in identifying pre-transaction scams.*"
        return response

    def build_scam_explanation_response(self, scam_type: str, context_docs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Structures the explanation, steps, and sources for results pages.
        """
        qa_ans = self.build_qa_response(scam_type, context_docs)
        
        steps = [
            "Do not transfer any money or share OTPs.",
            "Verify caller identity by calling the bank's official support number directly.",
            "Report the phone number, link, or UPI ID via the TrustNet Reporting console."
        ]
        
        refs = [
            "National Cyber Crime Reporting Portal (cybercrime.gov.in)",
            "RBI Kehta Hai Official Security Awareness advisories"
        ]
        
        return {
            "explanation": qa_ans,
            "prevention_steps": steps,
            "references": refs
        }

prompt_builder = PromptBuilder()
