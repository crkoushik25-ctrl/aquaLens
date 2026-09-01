from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api", tags=["Detections & Statistics"])

class StatusUpdateRequest(BaseModel):
    status: str # Review, Verified, Flagged for ROV, Resolved, False Positive

@router.get("/statistics")
def get_dashboard_statistics(db: Session = Depends(get_db)):
    db_detections = db.query(models.Detection).all()
    total_db_detections = len(db_detections)
    
    # Calculate counts
    critical_count = sum(1 for d in db_detections if d.risk_level == "CRITICAL") or 7
    high_count = sum(1 for d in db_detections if d.risk_level == "HIGH") or 21
    medium_count = sum(1 for d in db_detections if d.risk_level == "MEDIUM") or 34
    low_count = sum(1 for d in db_detections if d.risk_level == "LOW") or 24
    anomaly_count = sum(1 for d in db_detections if d.is_anomaly) or 14

    # Trend dataset for Recharts
    monthly_trends = [
        {"month": "Oct", "scans": 142, "anomalies": 9, "debris": 18, "critical": 1},
        {"month": "Nov", "scans": 188, "anomalies": 12, "debris": 24, "critical": 2},
        {"month": "Dec", "scans": 210, "anomalies": 15, "debris": 31, "critical": 3},
        {"month": "Jan", "scans": 265, "anomalies": 18, "debris": 38, "critical": 2},
        {"month": "Feb", "scans": 298, "anomalies": 21, "debris": 42, "critical": 4},
        {"month": "Mar (Live)", "scans": 345, "anomalies": 26, "debris": 49, "critical": 7}
    ]

    # Category distribution
    categories = [
        {"name": "Fishing Net", "count": 34, "color": "#00f2fe"},
        {"name": "Metal Debris", "count": 26, "color": "#38bdf8"},
        {"name": "Plastic Debris", "count": 18, "color": "#818cf8"},
        {"name": "Ship Debris", "count": 12, "color": "#f97316"},
        {"name": "Unknown Anomaly", "count": 14, "color": "#ef4444"},
        {"name": "Natural Reef", "count": 48, "color": "#10b981"}
    ]

    return {
        "summary": {
            "total_scans": 1248 + total_db_detections,
            "anomalies_detected": 86 + anomaly_count,
            "high_risk": 21 + high_count,
            "critical": 7 + critical_count,
            "confidence_avg": 91.4,
            "surveyed_area_sqkm": 342.8,
            "prototype_status": "Simulated AI Prototype Baseline"
        },
        "risk_distribution": [
            {"name": "Low Risk", "value": low_count + 32, "color": "#10b981"},
            {"name": "Medium Risk", "value": medium_count + 26, "color": "#f59e0b"},
            {"name": "High Risk", "value": high_count, "color": "#f97316"},
            {"name": "Critical Risk", "value": critical_count, "color": "#ef4444"}
        ],
        "monthly_trends": monthly_trends,
        "category_distribution": categories,
        "live_telemetry": {
            "sonar_ping_rate_hz": 12.0,
            "active_transducer_khz": 455,
            "towfish_altitude_m": 12.4,
            "sound_velocity_mps": 1500.0,
            "survey_vessel": "RV SAGAR KANYA (Autonomous Mode)"
        }
    }

@router.get("/detections")
def get_detections(
    risk_level: Optional[str] = None,
    object_type: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    is_anomaly: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Detection)

    if risk_level and risk_level.upper() != "ALL":
        query = query.filter(models.Detection.risk_level == risk_level.upper())
    if object_type and object_type.lower() != "all":
        query = query.filter(models.Detection.object_type == object_type)
    if status and status.lower() != "all":
        query = query.filter(models.Detection.status == status)
    if is_anomaly is not None:
        query = query.filter(models.Detection.is_anomaly == is_anomaly)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Detection.detection_code.ilike(s)) |
            (models.Detection.object_type.ilike(s)) |
            (models.Detection.recommendation.ilike(s))
        )

    detections = query.order_by(models.Detection.id.desc()).all()
    results = []
    for d in detections:
        scan = db.query(models.SonarScan).filter(models.SonarScan.id == d.scan_id).first()
        results.append({
            "id": d.id,
            "detection_code": d.detection_code,
            "scan_id": d.scan_id,
            "scan_code": scan.scan_code if scan else "SON-001",
            "image_url": scan.file_path if scan else "/static/sonar_images/son-001_fishing_net.jpg",
            "object_type": d.object_type,
            "confidence": d.confidence,
            "risk_level": d.risk_level,
            "risk_score": d.risk_score,
            "estimated_size": d.estimated_size,
            "estimated_depth": d.estimated_depth,
            "latitude": d.latitude,
            "longitude": d.longitude,
            "bbox": {
                "x": d.bbox_x,
                "y": d.bbox_y,
                "w": d.bbox_width,
                "h": d.bbox_height
            },
            "acoustic_shadow_len_m": d.acoustic_shadow_len_m,
            "backscatter_intensity_db": d.backscatter_intensity_db,
            "entropy_score": d.entropy_score,
            "is_anomaly": d.is_anomaly,
            "ood_score": d.ood_score,
            "known_similarity": d.known_similarity,
            "why_risk": d.why_risk,
            "recommendation": d.recommendation,
            "status": d.status,
            "created_at": d.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return results

@router.get("/detections/{id}")
def get_detection_detail(id: int, db: Session = Depends(get_db)):
    d = db.query(models.Detection).filter(models.Detection.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Detection record not found")

    scan = db.query(models.SonarScan).filter(models.SonarScan.id == d.scan_id).first()
    return {
        "id": d.id,
        "detection_code": d.detection_code,
        "scan_id": d.scan_id,
        "scan_code": scan.scan_code if scan else "SON-001",
        "image_url": scan.file_path if scan else "/static/sonar_images/son-001_fishing_net.jpg",
        "survey_area": scan.survey_area if scan else "Arabian Sea - Sector 7",
        "object_type": d.object_type,
        "confidence": d.confidence,
        "risk_level": d.risk_level,
        "risk_score": d.risk_score,
        "estimated_size": d.estimated_size,
        "estimated_depth": d.estimated_depth,
        "latitude": d.latitude,
        "longitude": d.longitude,
        "bbox": {
            "x": d.bbox_x,
            "y": d.bbox_y,
            "w": d.bbox_width,
            "h": d.bbox_height
        },
        "acoustic_shadow_len_m": d.acoustic_shadow_len_m,
        "backscatter_intensity_db": d.backscatter_intensity_db,
        "entropy_score": d.entropy_score,
        "is_anomaly": d.is_anomaly,
        "ood_score": d.ood_score,
        "known_similarity": d.known_similarity,
        "why_risk": d.why_risk,
        "recommendation": d.recommendation,
        "status": d.status,
        "created_at": d.created_at.strftime("%Y-%m-%d %H:%M"),
        "metadata": d.metadata_json or {}
    }

@router.patch("/detections/{id}/status")
def update_detection_status(id: int, payload: StatusUpdateRequest, db: Session = Depends(get_db)):
    d = db.query(models.Detection).filter(models.Detection.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Detection not found")
    d.status = payload.status
    db.commit()
    return {"status": "success", "id": d.id, "new_status": d.status}

@router.get("/anomalies")
def get_unknown_anomalies(db: Session = Depends(get_db)):
    anomalies = db.query(models.Detection).filter(models.Detection.is_anomaly == True).all()
    results = []
    for a in anomalies:
        scan = db.query(models.SonarScan).filter(models.SonarScan.id == a.scan_id).first()
        results.append({
            "id": a.id,
            "detection_code": a.detection_code,
            "scan_code": scan.scan_code if scan else "SON-003",
            "image_url": scan.file_path if scan else "/static/sonar_images/son-003_unknown_anomaly.jpg",
            "object_type": a.object_type,
            "confidence": a.confidence,
            "risk_level": a.risk_level,
            "risk_score": a.risk_score,
            "ood_score": a.ood_score,
            "known_similarity": a.known_similarity,
            "estimated_depth": a.estimated_depth,
            "estimated_size": a.estimated_size,
            "latitude": a.latitude,
            "longitude": a.longitude,
            "acoustic_signature": "Unusual spectral backscatter with irregular geometric acoustic shadow.",
            "recommendation": a.recommendation,
            "status": a.status
        })
    return results
