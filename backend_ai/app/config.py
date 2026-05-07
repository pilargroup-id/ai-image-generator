import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

print("Membaca .env dari:", ENV_PATH)

load_dotenv(ENV_PATH)

APP_NAME = os.getenv("APP_NAME", "Gemini Image Editor API")
APP_ENV = os.getenv("APP_ENV", "development")

_legacy_key = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_API_KEY_ECOMMERCE = (os.getenv("GEMINI_API_KEY_ECOMMERCE", "") or _legacy_key).strip()
GEMINI_API_KEY_PRODUCT   = os.getenv("GEMINI_API_KEY_PRODUCT", "").strip()

print("GEMINI_API_KEY_ECOMMERCE kebaca:", bool(GEMINI_API_KEY_ECOMMERCE))
print("GEMINI_API_KEY_PRODUCT   kebaca:", bool(GEMINI_API_KEY_PRODUCT))

if not GEMINI_API_KEY_ECOMMERCE and not GEMINI_API_KEY_PRODUCT:
    raise RuntimeError(
        "Setidaknya GEMINI_API_KEY_ECOMMERCE atau GEMINI_API_KEY_PRODUCT harus di-set di file .env"
    )

MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "10"))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

DEFAULT_CORS_ORIGINS = ",".join([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.254:5173",
])

CORS_ORIGINS_RAW = os.getenv("CORS_ORIGINS", DEFAULT_CORS_ORIGINS)

CORS_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in CORS_ORIGINS_RAW.split(",")
    if origin.strip()
]

print("CORS_ORIGINS dari config.py:", CORS_ORIGINS)

OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
}