from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.doctor import Doctor as DoctorModel
from app.schemas.doctor import Doctor, DoctorCreate, DoctorUpdate

router = APIRouter()

@router.get("/", response_model=List[Doctor])
async def get_doctors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all doctors"""
    doctors = db.query(DoctorModel).offset(skip).limit(limit).all()
    return doctors

@router.get("/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    """Get a specific doctor by ID"""
    doctor = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.post("/", response_model=Doctor, status_code=status.HTTP_201_CREATED)
async def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    """Create a new doctor"""
    db_doctor = DoctorModel(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.put("/{doctor_id}", response_model=Doctor)
async def update_doctor(doctor_id: int, doctor: DoctorUpdate, db: Session = Depends(get_db)):
    """Update a doctor"""
    db_doctor = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    update_data = doctor.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_doctor, field, value)
    
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    """Delete a doctor"""
    db_doctor = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    db.delete(db_doctor)
    db.commit()
    return None
