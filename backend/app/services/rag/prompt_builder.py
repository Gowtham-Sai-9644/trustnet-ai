import os
import json
from typing import List, Dict, Any
from openai import OpenAI

class PromptBuilder:
    def __init__(self):
        # We will initialize the client dynamically if a key is provided
        self.api_key = os.environ.get("OPENAI_API_KEY", "")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def build_scam_explanation_response(self, query: str, detection_details: Dict[str, Any], context_docs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Uses an LLM to generate an explanation grounded ONLY in retrieved documents and detection details.
        """
        if not context_docs:
            return {
                "explanation": "Insufficient threat intelligence was found. No relevant evidence retrieved.",
                "prevention_steps": ["Exercise caution", "Verify identities through official channels"],
                "references": []
            }
            
        retrieved_texts = "\n\n---\n\n".join([f"Source: {d['metadata'].get('source', 'Unknown')}\n{d['text']}" for d in context_docs])
        
        system_prompt = (
            "You are an explanation layer for a cybersecurity analysis system.\n"
            "Do not independently decide whether the input is malicious.\n"
            "Do not invent evidence.\n"
            "Do not invent sources.\n"
            "Do not invent threat intelligence.\n"
            "Explain only the detection evidence and retrieved context provided to you.\n"
            "If retrieved threat intelligence is unavailable, clearly state that no relevant threat intelligence was retrieved.\n"
            "Distinguish detected indicators from confirmed threat intelligence.\n"
            "Do not convert heuristic risk scores into probabilities.\n"
            "Provide a concise, direct explanation of the threat based ONLY on the context."
        )
        
        user_prompt = (
            f"DETECTION RESULTS:\n"
            f"{json.dumps(detection_details, indent=2)}\n\n"
            f"RETRIEVED THREAT INTELLIGENCE:\n"
            f"{retrieved_texts}\n\n"
            f"Based on the above, provide a human-readable explanation of the threat."
        )
        
        if self.client:
            try:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.0
                )
                explanation = response.choices[0].message.content
            except Exception as e:
                explanation = f"[LLM ERROR: {str(e)}]\n\nBased on retrieved intelligence: {context_docs[0]['text'][:500]}..."
        else:
            # Fallback if no API key is provided, so it doesn't break testing, but is still honest.
            # We simply concatenate the retrieved intelligence into a readable block without pretending an LLM generated it.
            explanation = (
                "[Notice: LLM API key not configured. Returning raw retrieved threat intelligence.]\n\n"
                f"The system detected the following features: {', '.join(detection_details.get('risk_indicators', []))}. "
                "The following relevant threat intelligence was retrieved:\n\n"
            )
            for d in context_docs:
                src = d['metadata'].get('source', 'Unknown')
                explanation += f"From {src}:\n{d['text'][:400]}...\n\n"

        steps = [
            "Do not transfer any money or share OTPs.",
            "Verify caller identity by calling the bank's official support number directly."
        ]
        
        refs = [doc["metadata"].get("source", "Unknown") for doc in context_docs]
        
        return {
            "explanation": explanation,
            "prevention_steps": steps,
            "references": list(set(refs))
        }

prompt_builder = PromptBuilder()
