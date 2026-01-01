from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialization = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    license_number = Column(String, unique=True)
    bio = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    
    appointments = relationship("Appointment", back_populates="doctor")
