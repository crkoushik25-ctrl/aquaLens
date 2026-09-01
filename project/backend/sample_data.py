import os
import io
import math
from datetime import datetime, timedelta
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
from sqlalchemy.orm import Session
import models
from ai_service import OBJECT_PROFILES, ai_engine

def generate_synthetic_sonar_image(
    file_path: str,
    target_type: str,
    width: int = 900,
    height: int = 450
):
    """
    Generates a realistic acoustic Side-Scan Sonar waterfall texture
    featuring water column (nadir zone), seabed backscatter texture,
    target acoustic reflection, and acoustic acoustic shadow.
    """
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # 1. Base acoustic seabed texture (speckle noise + grazing angle gradient)
    np.random.seed(abs(hash(target_type)) % 10000)
    
    # Create base acoustic intensity matrix
    base_noise = np.random.normal(loc=115, scale=28, size=(height, width)).astype(np.float32)
    
    # Add gentle bathymetric ripples/dune lines
    x = np.linspace(0, 10 * np.pi, width)
    y = np.linspace(0, 5 * np.pi, height)
    xx, yy = np.meshgrid(x, y)
    ripples = np.sin(xx + np.sin(yy) * 2) * 18
    
    sonar_array = base_noise + ripples
    
    # 2. Add Center Nadir Track (Water Column where altitude towfish flies)
    center_y = height // 2
    nadir_half_width = 30
    for r in range(center_y - nadir_half_width, center_y + nadir_half_width):
        dist = abs(r - center_y) / nadir_half_width
        sonar_array[r, :] = sonar_array[r, :] * (dist ** 1.8) * 0.45
    
    # Clamp values to 0-255
    sonar_array = np.clip(sonar_array, 0, 255).astype(np.uint8)
    
    # Create PIL Image in Amber/Gold Side-Scan Sonar Palette
    # Invert/Colorize to classic Sonar palette: dark water, gold seabed, bright target, black shadow
    img_gray = Image.fromarray(sonar_array, mode='L')
    
    # Convert to RGB with classic sonar amber tint
    img_rgb = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(img_rgb)
    
    # Draw colored acoustic texture
    gray_pixels = img_gray.load()
    rgb_pixels = img_rgb.load()
    
    for j in range(height):
        for i in range(width):
            g = gray_pixels[i, j]
            # Amber colormap: R = g, G = g*0.72, B = g*0.2
            r = min(255, int(g * 1.15))
            green = min(255, int(g * 0.76))
            b = min(255, int(g * 0.22))
            rgb_pixels[i, j] = (r, green, b)
            
    # 3. Draw Synthetic Target Reflection and Acoustic Shadow
    target_cx = int(width * 0.48)
    target_cy = int(height * 0.36)
    
    if target_type == "Fishing Net":
        # Trailing tangled web pattern with bright acoustic nodes and irregular shadow
        for _ in range(60):
            ox = target_cx + int(np.random.normal(0, 35))
            oy = target_cy + int(np.random.normal(0, 20))
            # Bright acoustic reflection
            draw.ellipse([ox-3, oy-3, ox+3, oy+3], fill=(255, 240, 160))
        # Tangled strands
        for _ in range(25):
            x1 = target_cx + np.random.randint(-45, 45)
            y1 = target_cy + np.random.randint(-25, 25)
            x2 = x1 + np.random.randint(-20, 20)
            y2 = y1 + np.random.randint(-15, 15)
            draw.line([x1, y1, x2, y2], fill=(255, 220, 120), width=2)
        # Acoustic shadow behind target
        draw.polygon([
            (target_cx - 50, target_cy - 40),
            (target_cx + 50, target_cy - 40),
            (target_cx + 90, target_cy - 90),
            (target_cx - 90, target_cy - 90)
        ], fill=(12, 8, 2))
        
    elif target_type == "Metal Debris":
        # Rectangular container / metal chassis with sharp high-intensity return and crisp dark shadow
        draw.rectangle([target_cx - 35, target_cy - 18, target_cx + 35, target_cy + 18], fill=(255, 255, 220), outline=(255, 200, 100), width=2)
        # Sharp rectangular acoustic shadow cast away from nadir
        draw.polygon([
            (target_cx - 38, target_cy - 20),
            (target_cx + 38, target_cy - 20),
            (target_cx + 50, target_cy - 85),
            (target_cx - 50, target_cy - 85)
        ], fill=(5, 4, 1))

    elif target_type == "Plastic Debris":
        # Multi-spot synthetic cluster with diffuse shadows
        for _ in range(40):
            ox = target_cx + int(np.random.normal(0, 28))
            oy = target_cy + int(np.random.normal(0, 16))
            draw.ellipse([ox-4, oy-4, ox+4, oy+4], fill=(240, 210, 140))
        draw.ellipse([target_cx - 30, target_cy - 45, target_cx + 30, target_cy - 20], fill=(15, 12, 4))

    elif target_type == "Ship Debris":
        # Large structured hull fragment with ribbing lines and massive shadow
        draw.polygon([
            (target_cx - 80, target_cy + 25),
            (target_cx + 70, target_cy + 15),
            (target_cx + 60, target_cy - 25),
            (target_cx - 70, target_cy - 20)
        ], fill=(255, 250, 200), outline=(255, 210, 130), width=3)
        # Hull ribs
        for ox in range(target_cx - 60, target_cx + 60, 18):
            draw.line([ox, target_cy - 15, ox + 5, target_cy + 18], fill=(255, 255, 255), width=2)
        # Massive acoustic shadow
        draw.polygon([
            (target_cx - 75, target_cy - 22),
            (target_cx + 65, target_cy - 26),
            (target_cx + 105, target_cy - 120),
            (target_cx - 115, target_cy - 110)
        ], fill=(4, 3, 1))

    elif target_type == "Unknown Anomaly":
        # Unusual organic/geometric ring backscatter with anomalous radial symmetry
        draw.ellipse([target_cx - 40, target_cy - 25, target_cx + 40, target_cy + 25], outline=(255, 255, 230), width=4)
        draw.ellipse([target_cx - 15, target_cy - 10, target_cx + 15, target_cy + 10], fill=(255, 240, 180))
        for angle_deg in range(0, 360, 45):
            rad = np.radians(angle_deg)
            x1 = target_cx + int(math.cos(rad) * 15)
            y1 = target_cy + int(math.sin(rad) * 10)
            x2 = target_cx + int(math.cos(rad) * 45)
            y2 = target_cy + int(math.sin(rad) * 30)
            draw.line([x1, y1, x2, y2], fill=(255, 220, 140), width=2)
        # Irregular stepped shadow
        draw.polygon([
            (target_cx - 45, target_cy - 28),
            (target_cx + 45, target_cy - 28),
            (target_cx + 70, target_cy - 95),
            (target_cx - 70, target_cy - 95)
        ], fill=(8, 6, 2))
        
    else: # Rock / Natural Reef
        draw.ellipse([target_cx - 35, target_cy - 20, target_cx + 35, target_cy + 20], fill=(210, 180, 110))
        draw.ellipse([target_cx - 30, target_cy - 50, target_cx + 30, target_cy - 22], fill=(18, 14, 5))

    # Apply slight gaussian blur to simulate water acoustic propagation
    img_final = img_rgb.filter(ImageFilter.GaussianBlur(radius=0.7))
    img_final.save(file_path, "JPEG", quality=92)
    return file_path

def seed_sample_data(db: Session, static_dir: str):
    """
    Populates the database with realistic demonstration sonar scans,
    detections, temporal survey comparison data, and reports.
    """
    os.makedirs(static_dir, exist_ok=True)
    
    # Check if already seeded
    if db.query(models.SonarScan).count() > 0:
        return

    print("--- Seeding OceanScan AI Marine Intelligence Database ---")

    # 1. Sample User
    demo_user = models.User(
        email="oceanographer@oceanscan.marine.gov",
        hashed_password="demo_password_hash",
        full_name="Dr. Aris Thorne",
        role="Chief Marine Surveyor",
        organization="National Marine & Defense Intelligence Bureau"
    )
    db.add(demo_user)
    db.commit()

    # 2. Curated Sample Scans
    sample_definitions = [
        {
            "code": "SON-001",
            "title": "Arabian Sea Transect #04 - Ghost Fishing Gear",
            "type": "Fishing Net",
            "depth": 42.0,
            "lat": 11.0168,
            "lng": 76.9558,
            "area": "Arabian Sea - Sector 7 (Coimbatore Trench)",
            "freq": 455,
            "alt": 12.5,
            "range": 75.0
        },
        {
            "code": "SON-002",
            "title": "Bay of Bengal Port Approach - Metallic Debris",
            "type": "Metal Debris",
            "depth": 36.0,
            "lat": 11.0231,
            "lng": 76.9612,
            "area": "Chennai Outer Anchorage - Lane Bravo",
            "freq": 900,
            "alt": 10.0,
            "range": 50.0
        },
        {
            "code": "SON-003",
            "title": "Lakshadweep Deep Trench - Out-of-Distribution Signature",
            "type": "Unknown Anomaly",
            "depth": 51.0,
            "lat": 11.0282,
            "lng": 76.9671,
            "area": "Lakshadweep Ridge - Abyssal Basin 2",
            "freq": 455,
            "alt": 15.0,
            "range": 100.0
        },
        {
            "code": "SON-004",
            "title": "Gulf of Mannar Coral Zone - Sunken Hull Section",
            "type": "Ship Debris",
            "depth": 28.5,
            "lat": 11.0112,
            "lng": 76.9490,
            "area": "Gulf of Mannar Marine Sanctuary Margin",
            "freq": 455,
            "alt": 11.0,
            "range": 75.0
        },
        {
            "code": "SON-005",
            "title": "Goa Coastal Shoal - Microplastic & Synthetic Accumulation",
            "type": "Plastic Debris",
            "depth": 22.0,
            "lat": 11.0340,
            "lng": 76.9740,
            "area": "Goa Continental Shelf Sector 1",
            "freq": 900,
            "alt": 8.5,
            "range": 40.0
        },
        {
            "code": "SON-006",
            "title": "Palk Strait Benthic Survey - Natural Basalt Reef Outcrop",
            "type": "Rock / Natural Object",
            "depth": 18.0,
            "lat": 11.0080,
            "lng": 76.9410,
            "area": "Palk Strait Shallow Bathymetry",
            "freq": 100,
            "alt": 9.0,
            "range": 120.0
        }
    ]

    for idx, s in enumerate(sample_definitions):
        img_filename = f"{s['code'].lower()}_{s['type'].lower().replace(' ', '_').replace('/', '_')}.jpg"
        img_path = os.path.join(static_dir, img_filename)
        generate_synthetic_sonar_image(img_path, s["type"])

        scan = models.SonarScan(
            scan_code=s["code"],
            file_name=img_filename,
            file_path=f"/static/sonar_images/{img_filename}",
            original_name=f"{s['title']}.tiff",
            file_size_kb=420.5,
            image_width=900,
            image_height=450,
            frequency_khz=s["freq"],
            altitude_m=s["alt"],
            slant_range_m=s["range"],
            latitude=s["lat"],
            longitude=s["lng"],
            depth_m=s["depth"],
            survey_area=s["area"],
            status="COMPLETED",
            created_at=datetime.utcnow() - timedelta(days=idx*2, hours=3)
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)

        # Generate detection record using AI engine
        detections = ai_engine.analyze_sonar_image(
            image_metadata={
                "frequency_khz": s["freq"],
                "altitude_m": s["alt"],
                "slant_range_m": s["range"],
                "latitude": s["lat"],
                "longitude": s["lng"],
                "depth_m": s["depth"]
            },
            preset_type=s["type"]
        )

        for d in detections:
            det_record = models.Detection(
                detection_code=f"DET-00{idx+1}",
                scan_id=scan.id,
                object_type=d["object_type"],
                confidence=d["confidence"],
                risk_level=d["risk_level"],
                risk_score=d["risk_score"],
                estimated_size=d["estimated_size"],
                estimated_depth=d["estimated_depth"],
                latitude=d["latitude"],
                longitude=d["longitude"],
                bbox_x=d["bbox_x"],
                bbox_y=d["bbox_y"],
                bbox_width=d["bbox_width"],
                bbox_height=d["bbox_height"],
                acoustic_shadow_len_m=d["acoustic_shadow_len_m"],
                backscatter_intensity_db=d["backscatter_intensity_db"],
                entropy_score=d["entropy_score"],
                is_anomaly=d["is_anomaly"],
                ood_score=d["ood_score"],
                known_similarity=d["known_similarity"],
                why_risk=d["why_risk"],
                recommendation=d["recommendation"],
                status=d["status"],
                metadata_json=d["metadata"],
                created_at=datetime.utcnow() - timedelta(days=idx*2, hours=3)
            )
            db.add(det_record)
        db.commit()

    # 3. Seed Historical Comparison Surveys (2024 Baseline vs 2026 Resurvey)
    baseline_img = os.path.join(static_dir, "survey_2024_baseline.jpg")
    current_img = os.path.join(static_dir, "survey_2026_current.jpg")
    generate_synthetic_sonar_image(baseline_img, "Rock / Natural Object")
    generate_synthetic_sonar_image(current_img, "Fishing Net")

    hist_survey = models.HistoricalSurvey(
        survey_code="SURV-TEMP-2026",
        title="Temporal Seabed Evolution & Debris Influx Monitoring",
        region_name="Gulf of Kutch Maritime Approach (Zone C-4)",
        survey_year=2024,
        scan_count=1248,
        debris_count=86,
        baseline_image="/static/sonar_images/survey_2024_baseline.jpg",
        current_image="/static/sonar_images/survey_2026_current.jpg",
        change_detected=True,
        change_confidence=0.84,
        change_summary="Substantial new acoustic backscatter detected at coordinates 11.0168° N, 76.9558° E. A synthetic monofilament netting bundle (8.4m span) has accumulated over benthic substrate since the 2024 baseline survey.",
        created_at=datetime.utcnow() - timedelta(days=5)
    )
    db.add(hist_survey)

    # 4. Seed Survey Reports
    report = models.SurveyReport(
        report_code="REP-2026-089",
        scan_id=1,
        title="Priority Acoustic Survey & Marine Hazard Assessment - Arabian Sea Transect #04",
        surveyor_name="Dr. Aris Thorne",
        organization="National Oceanographic & Marine Intelligence Bureau",
        survey_area="Arabian Sea - Sector 7",
        risk_level="HIGH",
        detections_count=3,
        executive_summary="Side-scan sonar imagery collected at 455 kHz revealed high-risk anthropogenic marine debris at depth 42.0m. Primary target identified as an abandoned ghost fishing net with high entanglement hazard for benthic ecosystems and subsurface navigation.",
        recommended_action="Deploy Remotely Operated Vehicle (ROV) with hydraulic cutter assembly for targeted debris extraction. Transmit safety notice to local fishing fleets and port authority.",
        created_at=datetime.utcnow() - timedelta(days=1)
    )
    db.add(report)
    db.commit()
    print("--- Database seeding completed successfully! ---")
