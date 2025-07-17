@echo off
echo Setting up Kevin Kerns Portfolio Chatbot...

REM Create virtual environment
echo Creating virtual environment...
python -m venv chatbot_env

REM Activate virtual environment
echo Activating virtual environment...
call chatbot_env\Scripts\activate.bat

REM Install requirements
echo Installing requirements...
pip install -r chatbot\requirements.txt

echo Setup complete!
echo.
echo To run the chatbot:
echo 1. Copy chatbot\.env.example to chatbot\.env
echo 2. Add your Google API key to chatbot\.env
echo 3. Run: python chatbot\gemini_chatbot.py
echo.
echo Note: You'll need to get a free API key from Google AI Studio:
echo https://makersuite.google.com/app/apikey

pause
