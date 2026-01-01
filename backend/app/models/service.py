from sqlalchemy import Column, Integer, String, Text, Float, Boolean
from app.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    duration_minutes = Column(Integer, default=30)
    is_available = Column(Boolean, default=True)
