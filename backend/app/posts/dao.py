from sqlalchemy import select, update
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select, desc

from app.dao.base import BaseDAO
from app.posts.models import Posts
from app.database import session_maker
from app.users.models import Users
from app.exceptions import DatabaseException

class PostsDAO(BaseDAO):
    model = Posts
    @classmethod
    async def get_one_or_none(cls, **filters):
        async with session_maker() as session:
            query = (select(cls.model, Users.username)
            .join(Users, cls.model.creator == Users.id)
            .where(cls.model.id == filters.get('id', None))
            )
            result = await session.execute(query)
            row = result.one_or_none()
            if row:
                    post, username = row
                    post_dict = post.__dict__.copy()
                    post_dict['username'] = username
                    return post_dict
    
    @classmethod
    async def get_like(cls, title: str):
        async with session_maker() as session:
            query = select(cls.model).where(cls.model.title.ilike(f"%{title}%")).order_by(desc(cls.model.created_at))
            result = await session.execute(query)
            return result.scalars().all()
        
    @classmethod
    async def get_all(cls, **filters):
        async with session_maker() as session:
            query = select(cls.model).filter_by(**filters).order_by(desc(cls.model.created_at))
            result = await session.execute(query)
            return result.scalars().all()
        
    @classmethod
    async def update(cls, item_id: int, **data):
        async with session_maker() as session:
            try:
                query = update(cls.model).where(item_id == cls.model.id).values(**data).returning(cls.model)
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
