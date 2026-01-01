# FastAPI Medical Center Backend

REST API для управления медицинским центром, создано на FastAPI.

## 🚀 Быстрый старт

### 1. Создать виртуальное окружение
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # Linux/Mac
```

### 2. Установить зависимости
```bash
pip install -r requirements.txt
```

### 3. Запустить сервер
```bash
python -m uvicorn app.main:app --reload
```

Сервер запустится на `http://localhost:8000`

### 4. Документация API
Откройте `http://localhost:8000/docs` для интерактивной документации

## 📁 Структура проекта

```
backend/
├── app/
│   ├── main.py              # Главное приложение FastAPI
│   ├── database.py          # Конфигурация БД и сессии
│   ├── models/              # SQLAlchemy модели
│   │   ├── __init__.py
│   │   ├── doctor.py        # Модель врача
│   │   ├── patient.py       # Модель пациента
│   │   ├── appointment.py   # Модель приема
│   │   └── service.py       # Модель услуги
│   ├── schemas/             # Pydantic схемы для валидации
│   │   ├── __init__.py
│   │   ├── doctor.py        # Схемы врача
│   │   ├── patient.py       # Схемы пациента
│   │   ├── appointment.py   # Схемы приема
│   │   └── service.py       # Схемы услуги
│   └── routers/             # API роуты
│       ├── __init__.py
│       ├── doctors.py       # Endpoints врачей
│       ├── patients.py      # Endpoints пациентов
│       ├── appointments.py  # Endpoints приемов
│       └── services.py      # Endpoints услуг
├── requirements.txt         # Зависимости Python
├── .env                     # Переменные окружения
└── .gitignore
```

## 🔌 API Endpoints

### Doctors
- `GET /api/doctors` - Список врачей
- `GET /api/doctors/{id}` - Врач по ID
- `POST /api/doctors` - Создать врача
- `PUT /api/doctors/{id}` - Обновить врача
- `DELETE /api/doctors/{id}` - Удалить врача

### Patients
- `GET /api/patients` - Список пациентов
- `GET /api/patients/{id}` - Пациент по ID
- `POST /api/patients` - Создать пациента
- `PUT /api/patients/{id}` - Обновить пациента
- `DELETE /api/patients/{id}` - Удалить пациента

### Appointments
- `GET /api/appointments` - Список приемов
- `GET /api/appointments/{id}` - Прием по ID
- `POST /api/appointments` - Создать прием
- `PUT /api/appointments/{id}` - Обновить прием
- `DELETE /api/appointments/{id}` - Удалить прием
- `GET /api/appointments/doctor/{doctor_id}` - Приемы врача
- `GET /api/appointments/patient/{patient_id}` - Приемы пациента

### Services
- `GET /api/services` - Список услуг
- `GET /api/services/{id}` - Услуга по ID
- `POST /api/services` - Создать услугу
- `PUT /api/services/{id}` - Обновить услугу
- `DELETE /api/services/{id}` - Удалить услугу

## 📊 Модели данных

### Doctor (Врач)
- id: integer (primary key)
- name: string
- specialization: string
- email: string (unique)
- phone: string
- license_number: string (unique)
- bio: text (optional)
- is_active: boolean

### Patient (Пациент)
- id: integer (primary key)
- first_name: string
- last_name: string
- email: string (unique)
- phone: string
- date_of_birth: date
- address: string
- medical_history: text (optional)
- allergies: text (optional)
- is_active: boolean

### Appointment (Прием)
- id: integer (primary key)
- patient_id: integer (foreign key)
- doctor_id: integer (foreign key)
- appointment_date: datetime
- duration_minutes: integer
- status: string (scheduled, completed, cancelled)
- notes: text (optional)
- created_at: datetime

### Service (Услуга)
- id: integer (primary key)
- name: string
- description: text
- price: float
- duration_minutes: integer
- is_available: boolean

## ⚙️ Конфигурация

### .env файл
```
DATABASE_URL=sqlite:///./medical_center.db
SECRET_KEY=your-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000"]
```

## 🛠️ Технологии

- **FastAPI** - современный веб-фреймворк Python
- **SQLAlchemy** - ORM для работы с БД
- **Pydantic** - валидация данных
- **Uvicorn** - ASGI сервер
- **SQLite** - база данных (по умолчанию)

## 📝 Примеры запросов

### Создать врача
```bash
curl -X POST "http://localhost:8000/api/doctors" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "specialization": "Cardiology",
    "email": "john@example.com",
    "phone": "+1234567890",
    "license_number": "MED123456",
    "bio": "Опытный кардиолог"
  }'
```

### Получить врача
```bash
curl "http://localhost:8000/api/doctors/1"
```

### Обновить врача
```bash
curl -X PUT "http://localhost:8000/api/doctors/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Doe",
    "phone": "+9876543210"
  }'
```

### Удалить врача
```bash
curl -X DELETE "http://localhost:8000/api/doctors/1"
```

## 🔄 CORS

CORS включен по умолчанию для localhost. Отредактируйте `app/main.py` для добавления других источников.

## 📚 Документация

- Interactive API docs (Swagger): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## 🚀 Развертывание

Для production используйте:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Или используйте Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```
