# ⚡ КОМАНДЫ ДЛЯ БЫСТРОГО ЗАПУСКА

## Терминал 1: Backend

```bash
cd backend
pip install -r requirements.txt
python init_db.bat
uvicorn app.main:app --reload --port 8000
```

Ожидайте:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

## Терминал 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Ожидайте:
```
VITE ... ready in ... ms
```

---

## Браузер

Откройте:
```
http://localhost:3000
```

---

## Проверка что всё работает

### 1. Перейди на "Дәрігерлер"
### 2. Нажми "➕ Дәрігер қосу"
### 3. Заполни форму и сохрани
### 4. Видишь врача в списке? ✅ Работает!

---

## Если не работает

### Port already in use?
```bash
# Найти процесс на порту 3000
netstat -ano | findstr :3000

# Найти процесс на порту 8000
netstat -ano | findstr :8000
```

### Npm зависимости проблемы?
```bash
cd frontend
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Python зависимости проблемы?
```bash
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

---

## API документация

Когда backend запущен, открой:
```
http://localhost:8000/docs
```

Там можешь тестировать endpoints!

---

**Готово!** 🚀
