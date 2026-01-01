"""
Инструкция по добавлению примеров данных в приложение.

Вы можете использовать эти примеры для тестирования API.
"""

# ПРИМЕРЫ ВРАЧЕЙ (Doctors)

doctor_1 = {
    "name": "Dr. Ivan Petrov",
    "specialization": "Cardiology",
    "email": "ivan.petrov@medical.com",
    "phone": "+7 (999) 123-45-67",
    "license_number": "MED2024001",
    "bio": "Кардиолог с 15 летним опытом работы. Специалист по лечению сердечно-сосудистых заболеваний."
}

doctor_2 = {
    "name": "Dr. Maria Volkova",
    "specialization": "Neurology",
    "email": "maria.volkova@medical.com",
    "phone": "+7 (999) 234-56-78",
    "license_number": "MED2024002",
    "bio": "Невролог, специалист по диагностике и лечению неврологических заболеваний."
}

doctor_3 = {
    "name": "Dr. Sergey Kuznetsov",
    "specialization": "Orthopedics",
    "email": "sergey.kuznetsov@medical.com",
    "phone": "+7 (999) 345-67-89",
    "license_number": "MED2024003",
    "bio": "Ортопед с специализацией на травматологии и спортивной медицине."
}

doctor_4 = {
    "name": "Dr. Elena Sokolova",
    "specialization": "Pediatrics",
    "email": "elena.sokolova@medical.com",
    "phone": "+7 (999) 456-78-90",
    "license_number": "MED2024004",
    "bio": "Педиатр, работает с детьми от рождения до 18 лет."
}

doctor_5 = {
    "name": "Dr. Alexey Orlov",
    "specialization": "General Practice",
    "email": "alexey.orlov@medical.com",
    "phone": "+7 (999) 567-89-01",
    "license_number": "MED2024005",
    "bio": "Врач общей практики с опытом диагностики и лечения различных заболеваний."
}


# ПРИМЕРЫ ПАЦИЕНТОВ (Patients)

patient_1 = {
    "first_name": "Alexander",
    "last_name": "Smirnov",
    "email": "alex.smirnov@email.com",
    "phone": "+7 (988) 111-11-11",
    "date_of_birth": "1985-03-15",
    "address": "123 Main Street, Moscow, Russia",
    "medical_history": "Гипертония, лечится с 2015 года",
    "allergies": "Пенициллин"
}

patient_2 = {
    "first_name": "Natalia",
    "last_name": "Ivanova",
    "email": "natalia.ivanova@email.com",
    "phone": "+7 (988) 222-22-22",
    "date_of_birth": "1990-07-22",
    "address": "456 Oak Avenue, Moscow, Russia",
    "medical_history": "Астма, аллергический ринит",
    "allergies": "Цефалоспорины, морепродукты"
}

patient_3 = {
    "first_name": "Boris",
    "last_name": "Lebedev",
    "email": "boris.lebedev@email.com",
    "phone": "+7 (988) 333-33-33",
    "date_of_birth": "1978-11-10",
    "address": "789 Pine Road, Moscow, Russia",
    "medical_history": "Сахарный диабет II типа, ожирение",
    "allergies": "None"
}

patient_4 = {
    "first_name": "Olga",
    "last_name": "Petrova",
    "email": "olga.petrova@email.com",
    "phone": "+7 (988) 444-44-44",
    "date_of_birth": "1992-05-18",
    "address": "321 Elm Street, Moscow, Russia",
    "medical_history": "Нет серьезных заболеваний",
    "allergies": "Латекс"
}

patient_5 = {
    "first_name": "Vladimir",
    "last_name": "Sokolov",
    "email": "vladimir.sokolov@email.com",
    "phone": "+7 (988) 555-55-55",
    "date_of_birth": "1980-09-28",
    "address": "654 Birch Lane, Moscow, Russia",
    "medical_history": "Ишемическая болезнь сердца",
    "allergies": "Аспирин"
}


# ПРИМЕРЫ УСЛУГ (Services)

service_1 = {
    "name": "Первичная консультация",
    "description": "Прием врача и первичная консультация по здоровью пациента",
    "price": 50.00,
    "duration_minutes": 30
}

service_2 = {
    "name": "Повторная консультация",
    "description": "Повторный прием врача и контроль состояния пациента",
    "price": 40.00,
    "duration_minutes": 25
}

service_3 = {
    "name": "ЭКГ (Электрокардиография)",
    "description": "Регистрация электрической активности сердца",
    "price": 30.00,
    "duration_minutes": 15
}

service_4 = {
    "name": "УЗИ диагностика",
    "description": "Ультразвуковое исследование различных органов",
    "price": 75.00,
    "duration_minutes": 30
}

service_5 = {
    "name": "Лабораторные анализы",
    "description": "Сдача крови и других биоматериалов на анализ",
    "price": 25.00,
    "duration_minutes": 20
}

service_6 = {
    "name": "Рентгенография",
    "description": "Рентгеновское обследование",
    "price": 60.00,
    "duration_minutes": 20
}

service_7 = {
    "name": "Массаж",
    "description": "Лечебный массаж и физиотерапия",
    "price": 55.00,
    "duration_minutes": 60
}

service_8 = {
    "name": "Консультация специалиста",
    "description": "Консультация врача-специалиста",
    "price": 80.00,
    "duration_minutes": 40
}


# КАК ДОБАВИТЬ ПРИМЕРЫ ДАННЫХ

"""
СПОСОБ 1: Через Swagger UI (самый простой)

1. Откройте http://localhost:8000/docs
2. Нажмите на нужный POST endpoint (например "POST /api/doctors")
3. Нажмите "Try it out"
4. Вставьте JSON данные из примера выше
5. Нажмите "Execute"

СПОСОБ 2: Через curl в терминале

Добавить врача:
curl -X POST "http://localhost:8000/api/doctors" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Ivan Petrov",
    "specialization": "Cardiology",
    "email": "ivan.petrov@medical.com",
    "phone": "+7 (999) 123-45-67",
    "license_number": "MED2024001",
    "bio": "Кардиолог с 15 летним опытом работы"
  }'

Добавить пациента:
curl -X POST "http://localhost:8000/api/patients" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alexander",
    "last_name": "Smirnov",
    "email": "alex.smirnov@email.com",
    "phone": "+7 (988) 111-11-11",
    "date_of_birth": "1985-03-15",
    "address": "123 Main Street, Moscow",
    "medical_history": "Гипертония",
    "allergies": "Пенициллин"
  }'

Добавить услугу:
curl -X POST "http://localhost:8000/api/services" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Первичная консультация",
    "description": "Прием врача и первичная консультация",
    "price": 50.00,
    "duration_minutes": 30
  }'

СПОСОБ 3: Через фронтенд приложение

1. Откройте http://localhost:3000
2. Перейдите на нужную страницу (Doctors, Patients и т.д.)
3. Нажмите "Add Doctor" (или соответствующую кнопку)
4. Заполните форму данными из примера
5. Нажмите "Save"

СПОСОБ 4: Создать Python скрипт

Создайте файл populate_db.py в папке backend:

import requests

BASE_URL = "http://localhost:8000/api"

# Добавить врача
response = requests.post(f"{BASE_URL}/doctors", json=doctor_1)
print(response.json())

# Добавить пациента
response = requests.post(f"{BASE_URL}/patients", json=patient_1)
print(response.json())

# Добавить услугу
response = requests.post(f"{BASE_URL}/services", json=service_1)
print(response.json())

Затем запустите:
python populate_db.py
"""


# ПРИМЕРЫ ПРИЕМОВ (Appointments)

"""
СОЗДАНИЕ ПРИЕМА:

Структура приема:
{
  "patient_id": 1,        # ID пациента (должен существовать)
  "doctor_id": 1,         # ID врача (должен существовать)
  "appointment_date": "2024-01-20T10:00:00",  # Дата и время
  "duration_minutes": 30,
  "notes": "Консультация и осмотр"
}

Пример через curl:
curl -X POST "http://localhost:8000/api/appointments" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "appointment_date": "2024-01-20T10:00:00",
    "duration_minutes": 30,
    "notes": "Первичная консультация кардиолога"
  }'

ВАЖНО:
- Сначала добавьте врачей и пациентов!
- Используйте их ID для создания приемов
- Дата должна быть в формате ISO 8601 (2024-01-20T10:00:00)
"""


# ПОСЛЕДОВАТЕЛЬНОСТЬ ДОБАВЛЕНИЯ ДАННЫХ

"""
ДЛЯ ПОЛНОГО ТЕСТИРОВАНИЯ СЛЕДУЙТЕ ЭТОМУ ПОРЯДКУ:

1. Добавьте 5 врачей (POST /api/doctors)
   - Используйте примеры doctor_1, doctor_2, doctor_3, doctor_4, doctor_5
   - Запомните их ID (обычно 1, 2, 3, 4, 5)

2. Добавьте 5 пациентов (POST /api/patients)
   - Используйте примеры patient_1, patient_2, patient_3, patient_4, patient_5
   - Запомните их ID (обычно 1, 2, 3, 4, 5)

3. Добавьте 8 услуг (POST /api/services)
   - Используйте примеры service_1-service_8
   - Запомните их ID (обычно 1-8)

4. Добавьте несколько приемов (POST /api/appointments)
   - Используйте ID врачей и пациентов из шагов 1-2
   - Используйте реальные даты и время

5. Протестируйте на фронтенде
   - Откройте http://localhost:3000
   - Проверьте все страницы (Doctors, Patients, Appointments, Services)
   - Попробуйте добавить новые записи через интерфейс
"""


# ПОЛЕЗНЫЕ КОМАНДЫ

"""
ПОЛУЧИТЬ СПИСОК ВСЕХ ВРАЧЕЙ:
curl http://localhost:8000/api/doctors

ПОЛУЧИТЬ ВРАЧА ПО ID:
curl http://localhost:8000/api/doctors/1

ПОЛУЧИТЬ СПИСОК ВСЕХ ПАЦИЕНТОВ:
curl http://localhost:8000/api/patients

ПОЛУЧИТЬ СПИСОК ВСЕХ ПРИЕМОВ:
curl http://localhost:8000/api/appointments

ПОЛУЧИТЬ ПРИЕМЫ КОНКРЕТНОГО ВРАЧА:
curl http://localhost:8000/api/appointments/doctor/1

ПОЛУЧИТЬ ПРИЕМЫ КОНКРЕТНОГО ПАЦИЕНТА:
curl http://localhost:8000/api/appointments/patient/1

ПОЛУЧИТЬ СПИСОК ВСЕХ УСЛУГ:
curl http://localhost:8000/api/services

УДАЛИТЬ ВРАЧА ПО ID:
curl -X DELETE http://localhost:8000/api/doctors/1

ОБНОВИТЬ ВРАЧА:
curl -X PUT "http://localhost:8000/api/doctors/1" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name", "phone": "+7 (999) 999-99-99"}'
"""
