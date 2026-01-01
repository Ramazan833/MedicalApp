@echo off
REM Initialize Medical Center Database with Test Data
REM Windows batch script

echo.
echo ====================================================
echo  Медициналық орталық - Деректер базасын ынамайтындыру
echo ====================================================
echo.

cd /d "%~dp0"

REM Check if venv exists
if not exist "venv\" (
    echo ❌ Виртуалды орта табылмады!
    echo ✅ Виртуалды орта құрамын...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo ✅ Тәлімдемелерді орнатамын...
pip install -q -r requirements.txt

REM Run test data creation
echo.
echo ✅ Тестілік деректер қосамын...
python create_test_data.py

echo.
echo ====================================================
echo ✅ Деректер базасы ынамайтындырылды!
echo ====================================================
echo.
pause
