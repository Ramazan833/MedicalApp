from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.service import Service as ServiceModel
from app.schemas.service import Service, ServiceCreate, ServiceUpdate

router = APIRouter()

@router.get("/", response_model=List[Service])
async def get_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all services"""
    services = db.query(ServiceModel).offset(skip).limit(limit).all()
    return services

@router.get("/{service_id}", response_model=Service)
async def get_service(service_id: int, db: Session = Depends(get_db)):
    """Get a specific service by ID"""
    service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/", response_model=Service, status_code=status.HTTP_201_CREATED)
async def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    """Create a new service"""
    db_service = ServiceModel(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.put("/{service_id}", response_model=Service)
async def update_service(service_id: int, service: ServiceUpdate, db: Session = Depends(get_db)):
    """Update a service"""
    db_service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = service.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_service, field, value)
    
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(service_id: int, db: Session = Depends(get_db)):
    """Delete a service"""
    db_service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db.delete(db_service)
    db.commit()
    return None
