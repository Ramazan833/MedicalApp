from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    date_of_birth: date
    address: str
    medical_history: Optional[str] = None
    allergies: Optional[str] = None

class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    is_active: Optional[bool] = None

class Patient(PatientCreate):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True
