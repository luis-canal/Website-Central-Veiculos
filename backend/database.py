from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import DATABASE_URL

Base = declarative_base()
_ENGINE_CACHE = {}


def get_session_factory(database_url=None):
    url = database_url or DATABASE_URL
    if url not in _ENGINE_CACHE:
        engine = create_engine(url)
        _ENGINE_CACHE[url] = engine
    engine = _ENGINE_CACHE[url]
    SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
    return SessionLocal, engine
