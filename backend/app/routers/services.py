from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
import logging

from app.database import get_db
from app.models.service import Service as ServiceModel
from app.schemas.service import Service, ServiceCreate, ServiceUpdate

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[Service])
async def get_services(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: str = Query(None),
    available_only: bool = Query(False),
    db: Session = Depends(get_db)
):
    """
    Get all services with optional filtering
    
    Parameters:
    - skip: Number of records to skip
    - limit: Maximum number of records to return
    - search: Search by service name or description
    - available_only: Show only available services
    """
    try:
        query = db.query(ServiceModel)
        
        if search:
            query = query.filter(
                ServiceModel.name.ilike(f"%{search}%") |
                ServiceModel.description.ilike(f"%{search}%")
            )
        
        if available_only:
            query = query.filter(ServiceModel.is_available == True)
        
        services = query.offset(skip).limit(limit).all()
        logger.info(f"Retrieved {len(services)} services")
        return services
    except Exception as e:
        logger.error(f"Error retrieving services: {str(e)}")
        raise HTTPException(status_code=500, detail="Қызметтерді алуда қате орын алды")

@router.get("/{service_id}", response_model=Service)
async def get_service(service_id: int, db: Session = Depends(get_db)):
    """Get a specific service by ID"""
    try:
        service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
        if not service:
            raise HTTPException(status_code=404, detail="Қызмет табылмады")
        logger.info(f"Retrieved service with ID {service_id}")
        return service
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving service {service_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Қызметті алуда қате орын алды")

@router.post("/", response_model=Service, status_code=status.HTTP_201_CREATED)
async def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    """Create a new service"""
    try:
        # Check for duplicate service name
        existing_service = db.query(ServiceModel).filter(
            ServiceModel.name.ilike(service.name)
        ).first()
        if existing_service:
            raise HTTPException(status_code=400, detail="Бұл қызмет әлдеқайда есептелінгі")
        
        # Validate price
        if service.price < 0:
            raise HTTPException(status_code=400, detail="Баса теріс болуы мүмкін емес")
        
        # Validate duration
        if service.duration_minutes <= 0:
            raise HTTPException(status_code=400, detail="Ұзақтығы нөлден артық болуы керек")
        
        db_service = ServiceModel(**service.dict())
        db.add(db_service)
        db.commit()
        db.refresh(db_service)
        logger.info(f"Created new service: {db_service.name}")
        return db_service
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating service: {str(e)}")
        raise HTTPException(status_code=500, detail="Қызмет құруда қате орын алды")

@router.put("/{service_id}", response_model=Service)
async def update_service(service_id: int, service: ServiceUpdate, db: Session = Depends(get_db)):
    """Update a service"""
    try:
        db_service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
        if not db_service:
            raise HTTPException(status_code=404, detail="Қызмет табылмады")
        
        # Check for duplicate name if name is being updated
        if service.name and service.name != db_service.name:
            existing = db.query(ServiceModel).filter(
                ServiceModel.name.ilike(service.name)
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="Бұл қызмет әлдеқайда есептелінгі")
        
        # Validate price if being updated
        if service.price is not None and service.price < 0:
            raise HTTPException(status_code=400, detail="Баса теріс болуы мүмкін емес")
        
        # Validate duration if being updated
        if service.duration_minutes is not None and service.duration_minutes <= 0:
            raise HTTPException(status_code=400, detail="Ұзақтығы нөлден артық болуы керек")
        
        update_data = service.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_service, field, value)
        
        db.add(db_service)
        db.commit()
        db.refresh(db_service)
        logger.info(f"Updated service with ID {service_id}")
        return db_service
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating service {service_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Қызметті өндіктеуде қате орын алды")

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(service_id: int, db: Session = Depends(get_db)):
    """Delete a service"""
    try:
        db_service = db.query(ServiceModel).filter(ServiceModel.id == service_id).first()
        if not db_service:
            raise HTTPException(status_code=404, detail="Қызмет табылмады")
        
        db.delete(db_service)
        db.commit()
        logger.info(f"Deleted service with ID {service_id}")
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting service {service_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Қызметті өшіруде қате орын алды")

@router.get("/available/all", response_model=List[Service])
async def get_available_services(db: Session = Depends(get_db)):
    """Get all available services"""
    try:
        services = db.query(ServiceModel).filter(ServiceModel.is_available == True).all()
        logger.info(f"Retrieved {len(services)} available services")
        return services
    except Exception as e:
        logger.error(f"Error retrieving available services: {str(e)}")
        raise HTTPException(status_code=500, detail="Қол жәндеген қызметтерді алуда қате орын алды")
