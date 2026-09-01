from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="Marine Data Analyst")  # Oceanographer, Defense Analyst, Port Authority
    organization = Column(String, default="National Oceanographic Institute")
    created_at = Column(DateTime, default=datetime.utcnow)

class SonarScan(Base):
    __tablename__ = "sonar_scans"

    id = Column(Integer, primary_key=True, index=True)
    scan_code = Column(String, unique=True, index=True, nullable=False)  # e.g., "SON-2026-089"
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    original_name = Column(String, nullable=False)
    file_size_kb = Column(Float, default=0.0)
    image_width = Column(Integer, default=1024)
    image_height = Column(Integer, default=512)
    frequency_khz = Column(Integer, default=455)  # 100, 455, 900 kHz
    altitude_m = Column(Float, default=12.5)      # Towfish altitude above seabed
    slant_range_m = Column(Float, default=75.0)   # Side-scan lateral range
    latitude = Column(Float, default=11.0168)
    longitude = Column(Float, default=76.9558)
    depth_m = Column(Float, default=42.0)
    survey_area = Column(String, default="Arabian Sea - Sector 7")
    status = Column(String, default="COMPLETED") # PROCESSING, COMPLETED, FAILED
    created_at = Column(DateTime, default=datetime.utcnow)

    detections = relationship("Detection", back_populates="scan", cascade="all, delete-orphan")

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    detection_code = Column(String, unique=True, index=True, nullable=False) # e.g., "DET-001"
    scan_id = Column(Integer, ForeignKey("sonar_scans.id"), nullable=True)
    
    object_type = Column(String, nullable=False) # Fishing Net, Metal Debris, Plastic Debris, Ship Debris, Rock / Natural Object, Unknown Anomaly
    confidence = Column(Float, nullable=False)   # 0.0 - 1.0
    risk_level = Column(String, nullable=False)   # LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Integer, nullable=False)   # 0 - 100
    
    estimated_size = Column(String, default="4.2m x 1.8m")
    estimated_depth = Column(Float, default=42.0)
    latitude = Column(Float, default=11.0168)
    longitude = Column(Float, default=76.9558)
    
    # Normalized Bounding Box Coordinates (0.0 to 1.0)
    bbox_x = Column(Float, default=0.35)
    bbox_y = Column(Float, default=0.28)
    bbox_width = Column(Float, default=0.22)
    bbox_height = Column(Float, default=0.34)
    
    # Acoustic metrics
    acoustic_shadow_len_m = Column(Float, default=3.2)
    backscatter_intensity_db = Column(Float, default=-18.4)
    entropy_score = Column(Float, default=0.74)
    
    # XAI & Anomaly Details
    is_anomaly = Column(Boolean, default=False)
    ood_score = Column(Float, default=0.15) # Out-of-Distribution score (0-1)
    known_similarity = Column(Float, default=0.88)
    why_risk = Column(Text, default="")
    recommendation = Column(String, default="Requires Marine Survey Inspection")
    status = Column(String, default="Review") # Review, Verified, Flagged for ROV, Resolved, False Positive
    
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    scan = relationship("SonarScan", back_populates="detections")

class HistoricalSurvey(Base):
    __tablename__ = "historical_surveys"

    id = Column(Integer, primary_key=True, index=True)
    survey_code = Column(String, unique=True, index=True) # e.g., "SURV-2024-A"
    title = Column(String, nullable=False)
    region_name = Column(String, nullable=False)
    survey_year = Column(Integer, default=2024)
    scan_count = Column(Integer, default=140)
    debris_count = Column(Integer, default=12)
    baseline_image = Column(String, nullable=False)
    current_image = Column(String, nullable=False)
    change_detected = Column(Boolean, default=True)
    change_confidence = Column(Float, default=0.84)
    change_summary = Column(Text, default="New anthropogenic debris deposited between 2024 baseline and 2026 resurvey.")
    created_at = Column(DateTime, default=datetime.utcnow)

class SurveyReport(Base):
    __tablename__ = "survey_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_code = Column(String, unique=True, index=True) # e.g., "REP-2026-0042"
    scan_id = Column(Integer, ForeignKey("sonar_scans.id"), nullable=True)
    title = Column(String, nullable=False)
    surveyor_name = Column(String, default="Dr. Sarah Jenkins")
    organization = Column(String, default="National Marine Environmental Agency")
    survey_area = Column(String, default="Sector 4B - Continental Shelf")
    risk_level = Column(String, default="HIGH")
    detections_count = Column(Integer, default=3)
    executive_summary = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
