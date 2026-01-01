from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
import logging

from app.database import get_db
from app.models.doctor import Doctor as DoctorModel
from app.schemas.doctor import Doctor, DoctorCreate, DoctorUpdate

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[Doctor])
async def get_doctors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: str = Query(None),
    specialization: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all doctors with optional filtering
    
    Parameters:
    - skip: Number of records to skip (default 0)
    - limit: Maximum number of records to return (default 100)
    - search: Search by name or email
    - specialization: Filter by specialization
    """
    try:
        query = db.query(DoctorModel)
        
        # Apply filters
        if search:
            query = query.filter(
                or_(
                    DoctorModel.name.ilike(f"%{search}%"),
                    DoctorModel.email.ilike(f"%{search}%")
                )
            )
        
        if specialization:
            query = query.filter(DoctorModel.specialization.ilike(f"%{specialization}%"))
        
        doctors = query.offset(skip).limit(limit).all()
        logger.info(f"Retrieved {len(doctors)} doctors")
        return doctors
    except Exception as e:
        logger.error(f"Error retrieving doctors: {str(e)}")
        raise HTTPException(status_code=500, detail="Дәрігерлерді алуда қате орын алды")

@router.get("/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    """Get a specific doctor by ID"""
    try:
        doctor = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Дәрігер табылмады")
        logger.info(f"Retrieved doctor with ID {doctor_id}")
        return doctor
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving doctor {doctor_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Дәрігерді алуда қате орын алды")

@router.post("/", response_model=Doctor, status_code=status.HTTP_201_CREATED)
async def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    """Create a new doctor"""
    try:
        # Check for duplicate email
        existing_doctor = db.query(DoctorModel).filter(DoctorModel.email == doctor.email).first()
        if existing_doctor:
            raise HTTPException(status_code=400, detail="Бұл электронды пошта әлдеқайда есептелінгі")
        
        # Check for duplicate license number
        existing_license = db.query(DoctorModel).filter(DoctorModel.license_number == doctor.license_number).first()
        if existing_license:
            raise HTTPException(status_code=400, detail="Бұл лицензия номері әлдеқайда есептелінгі")
        
        db_doctor = DoctorModel(**doctor.dict())
        db.add(db_doctor)
        db.commit()
        db.refresh(db_doctor)
        logger.info(f"Created new doctor: {db_doctor.name}")
        return db_doctor
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating doctor: {str(e)}")
        raise HTTPException(status_code=500, detail="Дәрігер құруда қате орын алды")

@router.put("/{doctor_id}", response_model=Doctor)
async def update_doctor(doctor_id: int, doctor: DoctorUpdate, db: Session = Depends(get_db)):
    """Update a doctor"""
    try:
        db_doctor = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
        if not db_doctor:
            raise HTTPException(status_code=404, detail="Дәрігер табылмады")
        
        # Check for duplicate email if email is being updated
        if doctor.email and doctor.email != db_doctor.email:
            existing = db.query(DoctorModel).filter(DoctorModel.email == doctor.email).first()
            if existing:
                raise HTTPException(status_code=400, detail="Бұл электронды пошта әлдеқайда есептелінгі")
        
        update_data = doctor.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_doctor, field, value)
        
        db.add(db_doctor)
        db.commit()
        db.refresh(db_doctor)
        logger.info(f"Updated doctor with ID {doctor_id}")
        return db_doctor
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating doctor {doctor_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Дәрігерді өндіктеуде қате орын алды")

@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    """Delete a doctor"""
    try:
        db_doctor = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
        if not db_doctor:
            raise HTTPException(status_code=404, detail="Дәрігер табылмады")
        
        db.delete(db_doctor)
        db.commit()
        logger.info(f"Deleted doctor with ID {doctor_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting doctor {doctor_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Дәрігерді өшіруде қате орын алды")

@router.get("/specialization/list", response_model=List[str])
async def get_specializations(db: Session = Depends(get_db)):
    """Get all available specializations"""
    try:
        specializations = db.query(DoctorModel.specialization).distinct().all()
        result = [s[0] for s in specializations if s[0]]
        logger.info(f"Retrieved {len(result)} specializations")
        return result
    except Exception as e:
        logger.error(f"Error retrieving specializations: {str(e)}")
        raise HTTPException(status_code=500, detail="Мамандықтарды алуда қате орын алды")
