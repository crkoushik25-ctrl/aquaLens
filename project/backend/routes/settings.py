from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/settings", tags=["Settings"])

class SystemSettings(BaseModel):
    transducer_frequency_default: int = 455 # 100, 455, 900 kHz
    slant_range_correction: bool = True
    detection_sensitivity: float = 0.80
    confidence_threshold: float = 0.70
    critical_risk_threshold: int = 85
    high_risk_threshold: int = 70
    auto_flag_rov_threshold: int = 80
    theme_mode: str = "deep_ocean_dark"
    enable_ood_detection: bool = True
    active_navarea_region: str = "NAVAREA VIII (Indian Ocean)"
    export_format_default: str = "PDF_A4"

CURRENT_SETTINGS = SystemSettings()

@router.get("")
def get_settings():
    return CURRENT_SETTINGS

@router.post("")
def update_settings(payload: SystemSettings):
    global CURRENT_SETTINGS
    CURRENT_SETTINGS = payload
    return {"status": "success", "settings": CURRENT_SETTINGS}
