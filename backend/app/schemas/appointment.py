from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: datetime
    duration_minutes: Optional[int] = 30
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class Appointment(AppointmentCreate):
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
