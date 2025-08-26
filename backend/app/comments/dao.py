from sqlalchemy import select

from app.comments.models import Comments
from app.dao.base import BaseDAO
from app.database import session_maker
from app.users.models import Users

from app.exceptions import DatabaseException

class CommentsDAO(BaseDAO):
    model = Comments
    
    @classmethod
    async def get_all(cls, **filters):
        async with session_maker() as session:
            query = (select(cls.model, Users.username)
            .join(Users, cls.model.creator_id == Users.id)
            .where(cls.model.post_id == filters.get('post_id', None))
            .order_by(cls.model.created_at.asc())
            )
            result = await session.execute(query)
            rows = result.all()
            comments_list = []
            for comment, username in rows:
                comment_dict = comment.__dict__.copy()
                comment_dict['username'] = username
                comments_list.append(comment_dict)
            return comments_list