import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

# Add parent and local dir to sys.path
sys.path.append(os.path.dirname(__file__))

from database import init_db, SessionLocal
import models
from sample_data import seed_sample_data
from routes import auth, sonar, detections, comparison, reports, settings

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
SONAR_STATIC_DIR = os.path.join(STATIC_DIR, "sonar_images")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed sample data
    os.makedirs(SONAR_STATIC_DIR, exist_ok=True)
    init_db()
    db = SessionLocal()
    try:
        seed_sample_data(db, SONAR_STATIC_DIR)
    finally:
        db.close()
    yield

app = FastAPI(
    title="OceanScan AI - Marine Debris & Sonar Anomaly Detection Engine",
    description="Smart India Hackathon AI-Powered Automated Underwater Marine Intelligence Platform",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for sonar imagery
os.makedirs(SONAR_STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Include API Routers
app.include_router(auth.router)
app.include_router(sonar.router)
app.include_router(detections.router)
app.include_router(comparison.router)
app.include_router(reports.router)
app.include_router(settings.router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "platform": "OceanScan AI Marine Intelligence Platform",
        "problem_statement": "AI-Powered Automated Underwater Marine Debris and Anomaly Detection System using Side-Scan Sonar Imagery",
        "hackathon": "Smart India Hackathon (SIH)",
        "version": "2.0.0",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
