from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.database import get_db
from app.schemas.report_schema import ReportCreateRequest, ReportResponse
from app.services.graph_service import graph_service

router = APIRouter()

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_scam_report(payload: ReportCreateRequest, db: AsyncSession = Depends(get_db)):
    if not payload.reported_phone and not payload.reported_upi and not payload.reported_url:
        raise HTTPException(
            status_code=400,
            detail="At least one identifier (Phone, UPI, or URL) must be provided in the report."
        )
        
    report_uuid = str(uuid.uuid4())
    
    # 1. Update Graph DB nodes and edges
    properties = {
        "loss_amount": float(payload.loss_amount),
        "scam_category": payload.scam_category,
        "description": payload.description
    }
    
    await graph_service.create_entity_node("Report", report_uuid, properties)
    
    if payload.reported_phone:
        await graph_service.create_entity_node("Phone", payload.reported_phone, {"phone_number": payload.reported_phone})
        await graph_service.create_relationship("Phone", payload.reported_phone, "Report", report_uuid, "REPORTED_AS")
        
    if payload.reported_upi:
        await graph_service.create_entity_node("UPI", payload.reported_upi, {"upi_id": payload.reported_upi})
        await graph_service.create_relationship("UPI", payload.reported_upi, "Report", report_uuid, "REPORTED_AS")
        if payload.reported_phone:
            await graph_service.create_relationship("Phone", payload.reported_phone, "UPI", payload.reported_upi, "USES")
            
    if payload.reported_url:
        await graph_service.create_entity_node("Website", payload.reported_url, {"url": payload.reported_url})
        await graph_service.create_relationship("Website", payload.reported_url, "Report", report_uuid, "REPORTED_AS")
        
    return ReportResponse(
        report_id=report_uuid,
        status="success",
        message="Incident report processed and injected into cyber intelligence graph."
    )
