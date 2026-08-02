from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from app.core.database import get_db
from app.schemas.report_schema import ReportCreateRequest, ReportResponse
from app.services.report_service import report_service

router = APIRouter()

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_scam_report(payload: ReportCreateRequest, db: AsyncSession = Depends(get_db)):
    """
    Submits a public incident report for financial or cyber fraud.
    Requires at least one target identifier (Phone, UPI, or URL).
    """
    if not payload.reported_phone and not payload.reported_upi and not payload.reported_url:
        raise HTTPException(
            status_code=400,
            detail="At least one target identifier (Phone, UPI, or URL) must be provided in the incident report."
        )

    res = await report_service.create_report(
        scam_category=payload.scam_category,
        description=payload.description,
        loss_amount=payload.loss_amount,
        reported_phone=payload.reported_phone,
        reported_upi=payload.reported_upi,
        reported_url=payload.reported_url,
        db=db
    )

    return ReportResponse(
        report_id=res["report_id"],
        status=res["status"],
        message=res["message"]
    )

@router.get("", response_model=List[Dict[str, Any]])
async def list_scam_reports(limit: int = Query(20, ge=1, le=100)):
    """
    Retrieves recent verified scam incident reports.
    """
    return report_service.list_reports(limit=limit)
