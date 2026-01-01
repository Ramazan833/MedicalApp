from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.appointment import Appointment as AppointmentModel
from app.schemas.appointment import Appointment, AppointmentCreate, AppointmentUpdate

router = APIRouter()

@router.get("/", response_model=List[Appointment])
async def get_appointments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all appointments"""
    appointments = db.query(AppointmentModel).offset(skip).limit(limit).all()
    return appointments

@router.get("/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Get a specific appointment by ID"""
    appointment = db.query(AppointmentModel).filter(AppointmentModel.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.post("/", response_model=Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    """Create a new appointment"""
    db_appointment = AppointmentModel(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.put("/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: int, appointment: AppointmentUpdate, db: Session = Depends(get_db)):
    """Update an appointment"""
    db_appointment = db.query(AppointmentModel).filter(AppointmentModel.id == appointment_id).first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    update_data = appointment.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_appointment, field, value)
    
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """Delete an appointment"""
    db_appointment = db.query(AppointmentModel).filter(AppointmentModel.id == appointment_id).first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db.delete(db_appointment)
    db.commit()
    return None

@router.get("/doctor/{doctor_id}", response_model=List[Appointment])
async def get_doctor_appointments(doctor_id: int, db: Session = Depends(get_db)):
    """Get all appointments for a specific doctor"""
    appointments = db.query(AppointmentModel).filter(AppointmentModel.doctor_id == doctor_id).all()
    return appointments

@router.get("/patient/{patient_id}", response_model=List[Appointment])
async def get_patient_appointments(patient_id: int, db: Session = Depends(get_db)):
    """Get all appointments for a specific patient"""
    appointments = db.query(AppointmentModel).filter(AppointmentModel.patient_id == patient_id).all()
    return appointments
