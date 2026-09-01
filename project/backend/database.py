import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL - uses PostgreSQL if configured, otherwise falls back to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./oceanscan.db")

# If PostgreSQL is configured with standard postgres:// prefix, adapt for modern SQLAlchemy
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configure SQLite connect_args if using SQLite
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    import models  # noqa
    Base.metadata.create_all(bind=engine)
