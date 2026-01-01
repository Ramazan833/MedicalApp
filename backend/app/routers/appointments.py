from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import logging

from app.database import get_db
from app.models.appointment import Appointment as AppointmentModel
from app.models.patient import Patient as PatientModel
from app.models.doctor import Doctor as DoctorModel
from app.schemas.appointment import Appointment, AppointmentCreate, AppointmentUpdate

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[Appointment])
async def get_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status_filter: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all appointments with optional filtering
    
    Parameters:
    - skip: Number of records to skip
    - limit: Maximum number of records to return
    - status_filter: Filter by status (scheduled, completed, cancelled)
    """
    try:
        query = db.query(AppointmentModel)
        
        if status_filter:
            query = query.filter(AppointmentModel.status == status_filter)
        
        appointments = query.order_by(AppointmentModel.appointment_date).offset(skip).limit(limit).all()
        logger.info(f"Retrieved {len(appointments)} appointments")
        return appointments
    except Exception as e:
        logger.error(f"Error retrieving appointments: {str(e)}")
        raise HTTPException(status_code=500, detail="Тағайындарды алуда қате орын алды")

@router.get("/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Get a specific appointment by ID"""
    try:
        appointment = db.query(AppointmentModel).filter(AppointmentModel.id == appointment_id).first()
        if not appointment:
            raise HTTPException(status_code=404, detail="Тағайын табылмады")
        logger.info(f"Retrieved appointment with ID {appointment_id}")
        return appointment
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving appointment {appointment_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Тағайынды алуда қате орын алды")

@router.post("/", response_model=Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    """Create a new appointment"""
    try:
        # Validate patient exists
        patient = db.query(PatientModel).filter(PatientModel.id == appointment.patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Пациент табылмады")
        
        # Validate doctor exists
        doctor = db.query(DoctorModel).filter(DoctorModel.id == appointment.doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Дәрігер табылмады")
        
        # Validate appointment date is in the future
        if appointment.appointment_date < datetime.now():
            raise HTTPException(status_code=400, detail="Тағайын күні болашақта болуы керек")
        
        db_appointment = AppointmentModel(**appointment.dict())
        db.add(db_appointment)
        db.commit()
        db.refresh(db_appointment)
        logger.info(f"Created new appointment with ID {db_appointment.id}")
        return db_appointment
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="Тағайын құруда қате орын алды")

@router.put("/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: int, appointment: AppointmentUpdate, db: Session = Depends(get_db)):
    """Update an appointment"""
    try:
        db_appointment = db.query(AppointmentModel).filter(AppointmentModel.id == appointment_id).first()
        if not db_appointment:
            raise HTTPException(status_code=404, detail="Тағайын табылмады")
        
        # Validate patient if being updated
        if appointment.patient_id:
            patient = db.query(PatientModel).filter(PatientModel.id == appointment.patient_id).first()
            if not patient:
                raise HTTPException(status_code=404, detail="Пациент табылмады")
        
        # Validate doctor if being updated
        if appointment.doctor_id:
            doctor = db.query(DoctorModel).filter(DoctorModel.id == appointment.doctor_id).first()
            if not doctor:
                raise HTTPException(status_code=404, detail="Дәрігер табылмады")
        
        update_data = appointment.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_appointment, field, value)
        
        db.add(db_appointment)
        db.commit()
        db.refresh(db_appointment)
        logger.info(f"Updated appointment with ID {appointment_id}")
        return db_appointment
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating appointment {appointment_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Тағайынды өндіктеуде қате орын алды")

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Delete an appointment"""
    try:
        db_appointment = db.query(AppointmentModel).filter(AppointmentModel.id == appointment_id).first()
        if not db_appointment:
            raise HTTPException(status_code=404, detail="Тағайын табылмады")
        
        db.delete(db_appointment)
        db.commit()
        logger.info(f"Deleted appointment with ID {appointment_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting appointment {appointment_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Тағайынды өшіруде қате орын алды")

@router.get("/doctor/{doctor_id}", response_model=List[Appointment])
async def get_doctor_appointments(doctor_id: int, db: Session = Depends(get_db)):
    """Get all appointments for a specific doctor"""
    try:
        doctor = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Дәрігер табылмады")
        
        appointments = db.query(AppointmentModel).filter(
            AppointmentModel.doctor_id == doctor_id
        ).order_by(AppointmentModel.appointment_date).all()
        logger.info(f"Retrieved {len(appointments)} appointments for doctor {doctor_id}")
        return appointments
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving appointments for doctor {doctor_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Дәрігер тағайындарын алуда қате орын алды")

@router.get("/patient/{patient_id}", response_model=List[Appointment])
async def get_patient_appointments(patient_id: int, db: Session = Depends(get_db)):
    """Get all appointments for a specific patient"""
    try:
        patient = db.query(PatientModel).filter(PatientModel.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Пациент табылмады")
        
        appointments = db.query(AppointmentModel).filter(
            AppointmentModel.patient_id == patient_id
        ).order_by(AppointmentModel.appointment_date).all()
        logger.info(f"Retrieved {len(appointments)} appointments for patient {patient_id}")
        return appointments
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving appointments for patient {patient_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Пациент тағайындарын алуда қате орын алды")
