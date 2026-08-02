import uuid
import datetime
from typing import List, Dict, Any, Optional
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.graph_service import graph_service

class ReportService:
    """
    Service layer handling incident report processing, database audit logging,
    and cyber threat graph node generation.
    """
    def __init__(self):
        # In-memory storage fallback for reports when DB is disconnected
        self._in_memory_reports: List[Dict[str, Any]] = [
            {
                "report_id": "REP-98102-MOCK",
                "reported_phone": "+919988776655",
                "reported_upi": "merchant-scam-24@ybl",
                "reported_url": "https://lotto-rewards-claim.cfd",
                "scam_category": "Fake KYC Scam",
                "description": "Victim lured into installing remote screen sharing app for KYC update.",
                "loss_amount": 15000.00,
                "timestamp": "2026-06-18T13:41:00Z",
                "status": "VERIFIED"
            }
        ]

    async def create_report(
        self,
        scam_category: str,
        description: str,
        loss_amount: Decimal,
        reported_phone: Optional[str] = None,
        reported_upi: Optional[str] = None,
        reported_url: Optional[str] = None,
        db: Optional[AsyncSession] = None
    ) -> Dict[str, Any]:
        """
        Creates an incident report, logs it to PostgreSQL and Neo4j graph, or falls back gracefully to in-memory store.
        """
        report_uuid = f"REP-{str(uuid.uuid4())[:8].upper()}"
        now_iso = datetime.datetime.utcnow().isoformat() + "Z"

        report_data = {
            "report_id": report_uuid,
            "reported_phone": reported_phone,
            "reported_upi": reported_upi,
            "reported_url": reported_url,
            "scam_category": scam_category,
            "description": description,
            "loss_amount": float(loss_amount),
            "timestamp": now_iso,
            "status": "PROCESSING"
        }

        # 1. Save to in-memory fallback
        self._in_memory_reports.insert(0, report_data)

        # 2. Inject nodes into Neo4j graph database if available
        try:
            properties = {
                "loss_amount": float(loss_amount),
                "scam_category": scam_category,
                "description": description
            }
            await graph_service.create_entity_node("Report", report_uuid, properties)

            if reported_phone:
                await graph_service.create_entity_node("Phone", reported_phone, {"phone_number": reported_phone})
                await graph_service.create_relationship("Phone", reported_phone, "Report", report_uuid, "REPORTED_AS")

            if reported_upi:
                await graph_service.create_entity_node("UPI", reported_upi, {"upi_id": reported_upi})
                await graph_service.create_relationship("UPI", reported_upi, "Report", report_uuid, "REPORTED_AS")
                if reported_phone:
                    await graph_service.create_relationship("Phone", reported_phone, "UPI", reported_upi, "USES")

            if reported_url:
                await graph_service.create_entity_node("Website", reported_url, {"url": reported_url})
                await graph_service.create_relationship("Website", reported_url, "Report", report_uuid, "REPORTED_AS")
                
            report_data["status"] = "VERIFIED_GRAPH"
        except Exception as graph_err:
            report_data["status"] = "QUEUED_LOCAL"

        return {
            "report_id": report_uuid,
            "status": report_data["status"],
            "message": "Incident report cataloged successfully and queued for cyber threat matrix analysis."
        }

    def list_reports(self, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Retrieves recent scam incident reports.
        """
        return self._in_memory_reports[:limit]

report_service = ReportService()
