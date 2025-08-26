from pydantic import validate_email
from pydantic_core import PydanticCustomError
from sqlalchemy import select, or_
from sqlalchemy.exc import MultipleResultsFound

from app.database import session_maker
from app.users.models import Users
from app.dao.base import BaseDAO

class UsersDAO(BaseDAO):
    model = Users

    @classmethod
    async def get_user_by_username_or_email(cls, username_or_email: str):
        async with session_maker() as session:
            try:
                validate_email(username_or_email)
                query = select(cls.model).where(Users.email == username_or_email)
            except PydanticCustomError:
                query = select(cls.model).where(Users.username == username_or_email)
            result = await session.execute(query)
            return result.scalars().one_or_none()

    @classmethod
    async def get_users_by_email_and_username(cls, email: str, username: str):
        async with session_maker() as session:
            try:
                query = select(cls.model).where(or_(cls.model.email == email, cls.model.username == username))
                result = await session.execute(query)
                return result.scalars().first()
            except MultipleResultsFound:
                return None