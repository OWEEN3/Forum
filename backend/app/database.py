from datetime import datetime
from typing import Annotated

from sqlalchemy import text, DateTime, func, Integer
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, mapped_column

from app.config import settings

async_engine = create_async_engine(settings.DATABASE_URL)
session_maker = async_sessionmaker(async_engine, expire_on_commit=False)
int_pk = Annotated[int, mapped_column(Integer, primary_key=True, nullable=False)]
created_at = Annotated[datetime, mapped_column(DateTime, server_default=text("TIMEZONE('utc', now())"))]
updated_at = Annotated[datetime, mapped_column(
    DateTime,
    server_default=text("TIMEZONE('utc', now())"),
    onupdate=func.timezone('utc', func.now())
)]

class Base(DeclarativeBase):
    pass