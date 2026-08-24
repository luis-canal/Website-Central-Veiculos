from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

from backend.config import DATABASE_URL


print("DATABASE USADO PELO SQLALCHEMY:", DATABASE_URL)

Base = declarative_base()
_ENGINE_CACHE = {}


def get_session_factory(database_url=None):
    url = database_url or DATABASE_URL
    is_memory_sqlite = url.startswith("sqlite:///:memory:") or url.startswith("sqlite://") and ":memory:" in url

    if not is_memory_sqlite and url not in _ENGINE_CACHE:
        engine = create_engine(url)
        _ENGINE_CACHE[url] = engine
    elif is_memory_sqlite:
        engine = create_engine(
            url,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    else:
        engine = _ENGINE_CACHE[url]

    SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
    return SessionLocal, engine
