from pydantic import BaseModel, EmailStr
from typing import Optional, List

class DoctorCreate(BaseModel):
    name: str
    specialization: str
    email: EmailStr
    phone: str
    license_number: str
    bio: Optional[str] = None

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    is_active: Optional[bool] = None

class Doctor(DoctorCreate):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True
