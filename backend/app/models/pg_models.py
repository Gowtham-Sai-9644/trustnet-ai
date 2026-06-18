from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, DECIMAL, Float, JSON, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, server_default=func.uuid_generate_v4())
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="user")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    scans: Mapped[List["Scan"]] = relationship("Scan", back_populates="user")
    reports: Mapped[List["Report"]] = relationship("Report", back_populates="user")


class Scan(Base):
    __tablename__ = "scans"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, server_default=func.uuid_generate_v4())
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    input_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    input_phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    input_upi: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    input_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="scans")
    trust_result: Mapped[Optional["TrustResult"]] = relationship("TrustResult", back_populates="scan", uselist=False)


class Report(Base):
    __tablename__ = "reports"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, server_default=func.uuid_generate_v4())
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reported_phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True, index=True)
    reported_upi: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    reported_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True, index=True)
    scam_category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    loss_amount: Mapped[float] = mapped_column(DECIMAL(15, 2), default=0.00)
    reporter_ip: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="reports")


class TrustResult(Base):
    __tablename__ = "trust_results"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, server_default=func.uuid_generate_v4())
    scan_id: Mapped[str] = mapped_column(String(36), ForeignKey("scans.id", ondelete="CASCADE"), unique=True, nullable=False)
    raw_url_prob: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    raw_nlp_prob: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    raw_graph_prob: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    fused_prob: Mapped[float] = mapped_column(Float, nullable=False)
    calibrated_prob: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    calibration_method: Mapped[str] = mapped_column(String(50), nullable=False)
    assigned_category: Mapped[str] = mapped_column(String(100), nullable=False)
    shap_values: Mapped[dict] = mapped_column(JSON, nullable=False)
    explanation_summary: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    scan: Mapped["Scan"] = relationship("Scan", back_populates="trust_result")


class ModelVersion(Base):
    __tablename__ = "model_versions"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, server_default=func.uuid_generate_v4())
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    version_string: Mapped[str] = mapped_column(String(50), nullable=False)
    file_path: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="inactive")
    accuracy: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    f1_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Experiment(Base):
    __tablename__ = "experiments"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, server_default=func.uuid_generate_v4())
    experiment_name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    parameters: Mapped[dict] = mapped_column(JSON, default=dict)
    metrics: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
