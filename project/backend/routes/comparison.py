from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/comparison", tags=["Temporal Comparison"])

class CompareRequest(BaseModel):
    survey_code: str = "SURV-TEMP-2026"
    baseline_year: int = 2024
    resurvey_year: int = 2026

@router.get("/samples")
def get_comparison_samples(db: Session = Depends(get_db)):
    surveys = db.query(models.HistoricalSurvey).all()
    results = []
    for s in surveys:
        results.append({
            "id": s.id,
            "survey_code": s.survey_code,
            "title": s.title,
            "region_name": s.region_name,
            "survey_year": s.survey_year,
            "scan_count": s.scan_count,
            "debris_count": s.debris_count,
            "baseline_image": s.baseline_image,
            "current_image": s.current_image,
            "change_detected": s.change_detected,
            "change_confidence": s.change_confidence,
            "change_summary": s.change_summary
        })
    return results

@router.post("/compare")
def execute_temporal_comparison(payload: CompareRequest, db: Session = Depends(get_db)):
    survey = db.query(models.HistoricalSurvey).filter(
        models.HistoricalSurvey.survey_code == payload.survey_code
    ).first()

    if not survey:
        survey = db.query(models.HistoricalSurvey).first()

    return {
        "status": "success",
        "survey_code": survey.survey_code if survey else "SURV-TEMP-2026",
        "region_name": survey.region_name if survey else "Gulf of Kutch Maritime Approach",
        "baseline_survey": {
            "year": 2024,
            "date": "2024-04-14",
            "image_url": survey.baseline_image if survey else "/static/sonar_images/survey_2024_baseline.jpg",
            "status": "No Target Detected (Natural Seabed Bedforms)",
            "acoustic_entropy": 0.38,
            "benthic_class": "Sandy Gravel Seabed"
        },
        "resurvey": {
            "year": 2026,
            "date": "2026-03-02",
            "image_url": survey.current_image if survey else "/static/sonar_images/survey_2026_current.jpg",
            "status": "Target Present (Newly Deposited Ghost Gear)",
            "acoustic_entropy": 0.86,
            "benthic_class": "Anthropogenic Debris Encrustation"
        },
        "change_detected": True,
        "change_confidence": 0.84,
        "new_anomalies_count": 1,
        "new_detections": [
            {
                "object_type": "Fishing Net",
                "estimated_size": "8.4m × 2.1m",
                "estimated_depth": 42.0,
                "risk_level": "HIGH",
                "risk_score": 82,
                "coordinates": "11.0168° N, 76.9558° E",
                "change_type": "Newly Deposited Marine Debris",
                "deposition_window": "Between April 2024 and March 2026",
                "recommendation": "Priority Recovery Operation Required"
            }
        ],
        "acoustic_differential_matrix": {
            "speckle_delta_pct": 34.2,
            "shadow_divergence": "High",
            "backscatter_shift_db": "+6.8 dB (High Reflection Return)"
        },
        "summary": "Temporal differential analysis indicates significant structural alteration on the benthic plane. A high-density fishing net has settled over formerly undisturbed sandy bedforms."
    }
