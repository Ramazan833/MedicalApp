from sqlalchemy import Column, Integer, String, Date, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    date_of_birth = Column(Date)
    address = Column(String)
    medical_history = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    
    appointments = relationship("Appointment", back_populates="patient")
