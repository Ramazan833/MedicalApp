"""
Script to create test data for the Medical Center application
"""

from app.database import SessionLocal, Base, engine
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.service import Service
from datetime import datetime, timedelta, date

# Create tables
Base.metadata.create_all(bind=engine)

# Create database session
db = SessionLocal()

try:
    # Clear existing data
    db.query(Appointment).delete()
    db.query(Doctor).delete()
    db.query(Patient).delete()
    db.query(Service).delete()
    db.commit()
    
    # Create sample doctors
    doctors = [
        Doctor(
            name="Dr. Айберген Сәлеуов",
            specialization="Кардиолог",
            email="aibergenc@medicalcenter.com",
            phone="+7 (701) 123-4567",
            license_number="MED001",
            bio="20 жылдық тәжірибесі бар кардиолог",
            is_active=True
        ),
        Doctor(
            name="Dr. Гүлнар Әлеуова",
            specialization="Невролог",
            email="gulnar@medicalcenter.com",
            phone="+7 (702) 234-5678",
            license_number="MED002",
            bio="Неврологиялық ауруларының бөлмелеуінде мәмлекеттік мамандар",
            is_active=True
        ),
        Doctor(
            name="Dr. Ерсултан Қоңғырбаев",
            specialization="Ортопед",
            email="ersultan@medicalcenter.com",
            phone="+7 (703) 345-6789",
            license_number="MED003",
            bio="Сүйектер мен буындарының ауруларында ынамды мамандар",
            is_active=True
        ),
    ]
    
    db.add_all(doctors)
    db.commit()
    print(f"✅ {len(doctors)} дәрігер қосылды")
    
    # Create sample patients
    patients = [
        Patient(
            first_name="Нұрлан",
            last_name="Сәрсембаев",
            email="nurlan@example.com",
            phone="+7 (701) 111-2222",
            date_of_birth=date(1985, 3, 15),
            address="Алматы қ., Медеу ауданы",
            medical_history="Құсыры ауруы",
            allergies="Пенициллин",
            is_active=True
        ),
        Patient(
            first_name="Айнара",
            last_name="Досова",
            email="ainara@example.com",
            phone="+7 (702) 222-3333",
            date_of_birth=date(1990, 7, 22),
            address="Алматы қ., Алмалы ауданы",
            medical_history="Диабет",
            allergies="",
            is_active=True
        ),
        Patient(
            first_name="Барлас",
            last_name="Кәрім",
            email="barlas@example.com",
            phone="+7 (703) 333-4444",
            date_of_birth=date(1988, 11, 8),
            address="Алматы қ., Түстік Қазақстан",
            medical_history="Артериялық гипертензия",
            allergies="Аспирин",
            is_active=True
        ),
    ]
    
    db.add_all(patients)
    db.commit()
    print(f"✅ {len(patients)} пациент қосылды")
    
    # Create sample services
    services = [
        Service(
            name="Жүрек ҚҚД",
            description="Жүрек сәл ықшамасының толық диагностикасы",
            price=15000,
            duration_minutes=30,
            is_available=True
        ),
        Service(
            name="Х-сәл фото",
            description="Жүйелі Х-сәл фото",
            price=8000,
            duration_minutes=15,
            is_available=True
        ),
        Service(
            name="УЗИ диагностика",
            description="УЗИ аппаратымен ауру аймақтарын зерттеу",
            price=12000,
            duration_minutes=20,
            is_available=True
        ),
        Service(
            name="ОҚР қызметі",
            description="Есептелінген қоршеген радиография",
            price=25000,
            duration_minutes=45,
            is_available=True
        ),
        Service(
            name="Тер зерттеу",
            description="Қан пікірінің толық зерттеуі",
            price=5000,
            duration_minutes=10,
            is_available=True
        ),
    ]
    
    db.add_all(services)
    db.commit()
    print(f"✅ {len(services)} қызмет қосылды")
    
    # Create sample appointments
    now = datetime.now()
    appointments = [
        Appointment(
            patient_id=1,
            doctor_id=1,
            appointment_date=now + timedelta(days=2, hours=9),
            duration_minutes=30,
            status="scheduled",
            notes="Ең бірінші болу барлық рецепт болмағында аса арзан"
        ),
        Appointment(
            patient_id=2,
            doctor_id=2,
            appointment_date=now + timedelta(days=3, hours=14),
            duration_minutes=30,
            status="scheduled",
            notes="Басының ауырысын теме болса да болмаса да болса да оңай"
        ),
        Appointment(
            patient_id=3,
            doctor_id=3,
            appointment_date=now + timedelta(days=5, hours=10),
            duration_minutes=30,
            status="scheduled",
            notes=""
        ),
    ]
    
    db.add_all(appointments)
    db.commit()
    print(f"✅ {len(appointments)} тағайын қосылды")
    
    print("\n✅ Барлық тестілік деректер сәтті қосылды!")
    print(f"📊 Жалпы деректер:")
    print(f"   • Дәрігерлер: {len(doctors)}")
    print(f"   • Пациенттер: {len(patients)}")
    print(f"   • Қызметтер: {len(services)}")
    print(f"   • Тағайындарлар: {len(appointments)}")
    
except Exception as e:
    print(f"❌ Қате орын алды: {str(e)}")
    db.rollback()
    
finally:
    db.close()
