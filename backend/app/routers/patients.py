from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
import logging

from app.database import get_db
from app.models.patient import Patient as PatientModel
from app.schemas.patient import Patient, PatientCreate, PatientUpdate

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[Patient])
async def get_patients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all patients with optional search
    
    Parameters:
    - skip: Number of records to skip (default 0)
    - limit: Maximum number of records to return (default 100)
    - search: Search by first name, last name or email
    """
    try:
        query = db.query(PatientModel)
        
        if search:
            query = query.filter(
                or_(
                    PatientModel.first_name.ilike(f"%{search}%"),
                    PatientModel.last_name.ilike(f"%{search}%"),
                    PatientModel.email.ilike(f"%{search}%")
                )
            )
        
        patients = query.offset(skip).limit(limit).all()
        logger.info(f"Retrieved {len(patients)} patients")
        return patients
    except Exception as e:
        logger.error(f"Error retrieving patients: {str(e)}")
        raise HTTPException(status_code=500, detail="Пациенттерді алуда қате орын алды")

@router.get("/{patient_id}", response_model=Patient)
async def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Get a specific patient by ID"""
    try:
        patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Пациент табылмады")
        logger.info(f"Retrieved patient with ID {patient_id}")
        return patient
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving patient {patient_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Пациентті алуда қате орын алды")

@router.post("/", response_model=Patient, status_code=status.HTTP_201_CREATED)
async def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient"""
    try:
        # Check for duplicate email
        existing_patient = db.query(PatientModel).filter(PatientModel.email == patient.email).first()
        if existing_patient:
            raise HTTPException(status_code=400, detail="Бұл электронды пошта әлдеқайда есептелінгі")
        
        db_patient = PatientModel(**patient.dict())
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        logger.info(f"Created new patient: {db_patient.first_name} {db_patient.last_name}")
        return db_patient
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating patient: {str(e)}")
        raise HTTPException(status_code=500, detail="Пациент құруда қате орын алды")

@router.put("/{patient_id}", response_model=Patient)
async def update_patient(patient_id: int, patient: PatientUpdate, db: Session = Depends(get_db)):
    """Update a patient"""
    try:
        db_patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
        if not db_patient:
            raise HTTPException(status_code=404, detail="Пациент табылмады")
        
        # Check for duplicate email if email is being updated
        if patient.email and patient.email != db_patient.email:
            existing = db.query(PatientModel).filter(PatientModel.email == patient.email).first()
            if existing:
                raise HTTPException(status_code=400, detail="Бұл электронды пошта әлдеқайда есептелінгі")
        
        update_data = patient.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_patient, field, value)
        
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        logger.info(f"Updated patient with ID {patient_id}")
        return db_patient
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating patient {patient_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Пациентті өндіктеуде қате орын алды")

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    """Delete a patient"""
    try:
        db_patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
        if not db_patient:
            raise HTTPException(status_code=404, detail="Пациент табылмады")
        
        db.delete(db_patient)
        db.commit()
        logger.info(f"Deleted patient with ID {patient_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting patient {patient_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Пациентті өшіруде қате орын алды")
