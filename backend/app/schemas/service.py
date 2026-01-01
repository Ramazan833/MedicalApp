from pydantic import BaseModel
from typing import Optional

class ServiceCreate(BaseModel):
    name: str
    description: str
    price: float
    duration_minutes: Optional[int] = 30

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    is_available: Optional[bool] = None

class Service(ServiceCreate):
    id: int
    is_available: bool
    
    class Config:
        from_attributes = True
