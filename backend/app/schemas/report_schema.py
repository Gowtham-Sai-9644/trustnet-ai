from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal

class ReportCreateRequest(BaseModel):
    reported_phone: Optional[str] = Field(None, max_length=30, description="Phone number of the suspected scammer")
    reported_upi: Optional[str] = Field(None, max_length=255, description="UPI Address of the suspect")
    reported_url: Optional[str] = Field(None, description="URL domain link used to host fraud")
    scam_category: str = Field(..., description="E.g., 'Lottery Scam', 'Fake KYC Scam'")
    description: str = Field(..., min_length=15, description="Details of how the transaction fraud happened")
    loss_amount: Decimal = Field(default=Decimal('0.00'), ge=0, description="Incurred financial loss in INR")

class ReportResponse(BaseModel):
    report_id: str
    status: str
    message: str
