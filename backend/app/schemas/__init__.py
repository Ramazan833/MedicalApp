from app.schemas.doctor import Doctor, DoctorCreate, DoctorUpdate
from app.schemas.patient import Patient, PatientCreate, PatientUpdate
from app.schemas.appointment import Appointment, AppointmentCreate, AppointmentUpdate
from app.schemas.service import Service, ServiceCreate, ServiceUpdate

__all__ = [
    "Doctor", "DoctorCreate", "DoctorUpdate",
    "Patient", "PatientCreate", "PatientUpdate",
    "Appointment", "AppointmentCreate", "AppointmentUpdate",
    "Service", "ServiceCreate", "ServiceUpdate"
]
