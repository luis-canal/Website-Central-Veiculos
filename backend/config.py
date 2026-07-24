import os
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent

DATABASE_PATH = BACKEND_DIR / "vehicles.db"

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{DATABASE_PATH}"
)

SCRAPER_URL = os.getenv("SCRAPER_URL", "")
print("SCRAPER_URL:", SCRAPER_URL)
print("DATABASE USADO PELO SQLALCHEMY:", DATABASE_URL)

SCRAPER_TIMEOUT = int(os.getenv("SCRAPER_TIMEOUT", "20"))
SCRAPER_CARD_SELECTOR = os.getenv(
    "SCRAPER_CARD_SELECTOR",
    "article, .vehicle-card, .car-card"
)

ENABLE_SCHEDULER = os.getenv(
    "ENABLE_SCHEDULER",
    "false"
).lower() == "true"

SCHEDULER_INTERVAL_MINUTES = int(
    os.getenv("SCHEDULER_INTERVAL_MINUTES", "30")
)

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")