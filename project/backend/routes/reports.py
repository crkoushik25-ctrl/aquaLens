import io
import csv
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/reports", tags=["Report Generation"])

class GenerateReportRequest(BaseModel):
    scan_id: Optional[int] = 1
    title: Optional[str] = None
    surveyor_name: str = "Dr. Aris Thorne"
    organization: str = "National Marine & Defense Intelligence Bureau"

@router.get("")
def list_reports(db: Session = Depends(get_db)):
    reports = db.query(models.SurveyReport).order_by(models.SurveyReport.id.desc()).all()
    results = []
    for r in reports:
        results.append({
            "id": r.id,
            "report_code": r.report_code,
            "scan_id": r.scan_id,
            "title": r.title,
            "surveyor_name": r.surveyor_name,
            "organization": r.organization,
            "survey_area": r.survey_area,
            "risk_level": r.risk_level,
            "detections_count": r.detections_count,
            "executive_summary": r.executive_summary,
            "recommended_action": r.recommended_action,
            "generated_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return results

@router.post("/generate")
def generate_report(payload: GenerateReportRequest, db: Session = Depends(get_db)):
    scan = db.query(models.SonarScan).filter(models.SonarScan.id == payload.scan_id).first()
    if not scan:
        scan = db.query(models.SonarScan).first()

    detections = db.query(models.Detection).filter(models.Detection.scan_id == scan.id).all() if scan else []
    if not detections:
        detections = db.query(models.Detection).limit(3).all()

    primary_det = detections[0] if detections else None
    risk_level = primary_det.risk_level if primary_det else "HIGH"
    object_type = primary_det.object_type if primary_det else "Fishing Net"

    report_code = f"REP-2026-{scan.id:04d}" if scan else "REP-2026-0099"
    report_title = payload.title or f"Underwater Anomaly & Acoustic Survey Report: {scan.scan_code if scan else 'SON-001'}"

    exec_summary = (
        f"Automated acoustic analysis conducted on Side-Scan Sonar survey {scan.scan_code if scan else 'SON-001'} "
        f"at depth {scan.depth_m if scan else 42.0}m identified {len(detections)} underwater target(s). "
        f"Primary classification indicates '{object_type}' with an AI confidence rating of {int((primary_det.confidence if primary_det else 0.91)*100)}% "
        f"and overall risk index of {primary_det.risk_score if primary_det else 82}/100."
    )

    rec_action = primary_det.recommendation if primary_det else "Deploy ROV for visual confirmation."

    new_report = models.SurveyReport(
        report_code=report_code,
        scan_id=scan.id if scan else 1,
        title=report_title,
        surveyor_name=payload.surveyor_name,
        organization=payload.organization,
        survey_area=scan.survey_area if scan else "Arabian Sea - Sector 7",
        risk_level=risk_level,
        detections_count=len(detections),
        executive_summary=exec_summary,
        recommended_action=rec_action
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {
        "status": "success",
        "report_id": new_report.id,
        "report_code": new_report.report_code,
        "title": new_report.title,
        "surveyor_name": new_report.surveyor_name,
        "organization": new_report.organization,
        "survey_area": new_report.survey_area,
        "risk_level": new_report.risk_level,
        "detections_count": new_report.detections_count,
        "executive_summary": new_report.executive_summary,
        "recommended_action": new_report.recommended_action,
        "scan_metadata": {
            "scan_code": scan.scan_code if scan else "SON-001",
            "frequency_khz": scan.frequency_khz if scan else 455,
            "altitude_m": scan.altitude_m if scan else 12.5,
            "slant_range_m": scan.slant_range_m if scan else 75.0,
            "latitude": scan.latitude if scan else 11.0168,
            "longitude": scan.longitude if scan else 76.9558,
            "depth_m": scan.depth_m if scan else 42.0,
            "image_url": scan.file_path if scan else "/static/sonar_images/son-001_fishing_net.jpg"
        },
        "detections": [
            {
                "detection_code": d.detection_code,
                "object_type": d.object_type,
                "confidence": d.confidence,
                "risk_level": d.risk_level,
                "risk_score": d.risk_score,
                "estimated_size": d.estimated_size,
                "depth_m": d.estimated_depth,
                "shadow_len_m": d.acoustic_shadow_len_m,
                "why_risk": d.why_risk
            } for d in detections
        ],
        "generated_at": new_report.created_at.strftime("%Y-%m-%d %H:%M:%S UTC")
    }

@router.get("/{id}")
def get_report_detail(id: int, db: Session = Depends(get_db)):
    r = db.query(models.SurveyReport).filter(models.SurveyReport.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    scan = db.query(models.SonarScan).filter(models.SonarScan.id == r.scan_id).first()
    detections = db.query(models.Detection).filter(models.Detection.scan_id == r.scan_id).all() if r.scan_id else []

    return {
        "id": r.id,
        "report_code": r.report_code,
        "title": r.title,
        "surveyor_name": r.surveyor_name,
        "organization": r.organization,
        "survey_area": r.survey_area,
        "risk_level": r.risk_level,
        "detections_count": r.detections_count,
        "executive_summary": r.executive_summary,
        "recommended_action": r.recommended_action,
        "generated_at": r.created_at.strftime("%Y-%m-%d %H:%M UTC"),
        "scan_metadata": {
            "scan_code": scan.scan_code if scan else "SON-001",
            "frequency_khz": scan.frequency_khz if scan else 455,
            "altitude_m": scan.altitude_m if scan else 12.5,
            "slant_range_m": scan.slant_range_m if scan else 75.0,
            "latitude": scan.latitude if scan else 11.0168,
            "longitude": scan.longitude if scan else 76.9558,
            "depth_m": scan.depth_m if scan else 42.0,
            "image_url": scan.file_path if scan else "/static/sonar_images/son-001_fishing_net.jpg"
        },
        "detections": [
            {
                "detection_code": d.detection_code,
                "object_type": d.object_type,
                "confidence": d.confidence,
                "risk_level": d.risk_level,
                "risk_score": d.risk_score,
                "estimated_size": d.estimated_size,
                "depth_m": d.estimated_depth,
                "shadow_len_m": d.acoustic_shadow_len_m,
                "why_risk": d.why_risk
            } for d in detections
        ]
    }

@router.get("/{id}/export-csv")
def export_report_csv(id: int, db: Session = Depends(get_db)):
    r = db.query(models.SurveyReport).filter(models.SurveyReport.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    detections = db.query(models.Detection).filter(models.Detection.scan_id == r.scan_id).all() if r.scan_id else []

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Report Code", "Title", "Surveyor", "Organization", "Area", "Risk Level", "Generated At"])
    writer.writerow([r.report_code, r.title, r.surveyor_name, r.organization, r.survey_area, r.risk_level, r.created_at])
    writer.writerow([])
    writer.writerow(["Detection Code", "Object Type", "Confidence", "Risk Level", "Risk Score", "Size", "Depth (m)", "Shadow Len (m)", "Status", "Recommendation"])
    for d in detections:
        writer.writerow([d.detection_code, d.object_type, f"{int(d.confidence*100)}%", d.risk_level, d.risk_score, d.estimated_size, d.estimated_depth, d.acoustic_shadow_len_m, d.status, d.recommendation])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={r.report_code}_export.csv"}
    )
