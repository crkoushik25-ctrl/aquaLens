from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "Marine Data Analyst"
    organization: str = "National Oceanographic Institute"

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    organization: str
    token: str

@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        # For demo purposes, if user not found, create a demo session seamlessly
        user = models.User(
            email=payload.email,
            hashed_password="demo_hashed_password",
            full_name=payload.email.split("@")[0].capitalize() or "Marine Surveyor",
            role="Chief Marine Surveyor",
            organization="OceanScan Marine Intelligence Labs"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        organization=user.organization,
        token=f"demo_jwt_token_{user.id}_{int(user.id)*42}"
    )

@router.post("/register", response_model=UserResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        return UserResponse(
            id=existing.id,
            email=existing.email,
            full_name=existing.full_name,
            role=existing.role,
            organization=existing.organization,
            token=f"demo_jwt_token_{existing.id}_active"
        )
    
    new_user = models.User(
        email=payload.email,
        hashed_password="demo_hashed_password",
        full_name=payload.full_name,
        role=payload.role,
        organization=payload.organization
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        role=new_user.role,
        organization=new_user.organization,
        token=f"demo_jwt_token_{new_user.id}_active"
    )

@router.get("/me")
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        return {
            "id": 1,
            "email": "oceanographer@oceanscan.marine.gov",
            "full_name": "Dr. Aris Thorne",
            "role": "Chief Marine Surveyor",
            "organization": "National Marine & Defense Intelligence Bureau"
        }
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "organization": user.organization
    }
