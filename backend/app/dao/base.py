from fastapi import HTTPException
from sqlalchemy import select, insert, delete, update
from sqlalchemy.exc import SQLAlchemyError

from app.database import session_maker
from app.exceptions import DatabaseException


class BaseDAO:
    model = None

    @classmethod
    async def get_all(cls, **filters):
        async with session_maker() as session:
            query = select(cls.model).filter_by(**filters)
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def get_one_or_none(cls, **filters):
        async with session_maker() as session:
            query = select(cls.model).filter_by(**filters)
            result = await session.execute(query)
            return result.scalars().one_or_none()

    @classmethod
    async def add(cls, **data):
        async with session_maker() as session:
            try:
                query = insert(cls.model).values(**data).returning(cls.model.id)
                result = await session.execute(query)
                await session.commit()
                return result.scalar()
            except (SQLAlchemyError, Exception) as e:
                if isinstance(e, SQLAlchemyError):
                    print("sqlalchemy error", e)
                    return DatabaseException
                else:
                    print("Unknown error", e)
                    return DatabaseException

    @classmethod
    async def delete(cls, **filters):
        async with session_maker() as session:
            try:
                query = delete(cls.model).filter_by(**filters)
                result = await session.execute(query)
                await session.commit()
                return None
            except (SQLAlchemyError, Exception) as e:
                if isinstance(e, SQLAlchemyError):
                    print("sqlalchemy error", e)
                    return DatabaseException
                else:
                    print("Unknown error", e)
                    return DatabaseException


    @classmethod
    async def update(cls, item_id: int, **data):
        async with session_maker() as session:
            try:
                query = update(cls.model).where(cls.model.id == item_id).values(**data).returning(cls.model.id)
                result = await session.execute(query)
                await session.commit()
                return result.scalar()
            except (SQLAlchemyError, Exception) as e:
                if isinstance(e, SQLAlchemyError):
                    print("sqlalchemy error", e)
                    return DatabaseException
                else:
                    print("Unknown error", e)
                    return DatabaseException