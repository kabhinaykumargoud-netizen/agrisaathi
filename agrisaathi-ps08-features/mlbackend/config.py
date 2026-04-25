import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the same directory as this file
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

class Settings:
    # ── Supabase ──────────────────────────────────────────────
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    # ── Weather (OpenWeather) ─────────────────────────────────
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")

    # ── Twilio (SMS + Voice Calls) ────────────────────────────
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")

    # ── LLM (Groq) ────────────────────────────────────────────
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # ── Govt APIs ─────────────────────────────────────────────
    DATA_GOV_API_KEY: str = os.getenv("DATA_GOV_API_KEY", "")

    # ── Internal ──────────────────────────────────────────────
    MODEL_PATH: str = "model.joblib"
    PORT: int = 8000

settings = Settings()
