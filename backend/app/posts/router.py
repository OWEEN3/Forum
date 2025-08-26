from fastapi import APIRouter, Response
from fastapi.params import Depends

from app.exceptions import NoAccessException
from app.posts.dao import PostsDAO
from app.posts.schemas import SPosts
from app.users.dependencies import get_current_user_id
from app.posts.models import Posts

router = APIRouter(tags=["Posts"], prefix="/posts")

@router.get("/")
async def get_posts():
    return await PostsDAO.get_all()

@router.get("/search")
async def search_posts(title: str):
    return await PostsDAO.get_like(title)

@router.get("/{post_id}")
async def get_post(post_id: int):
    return await PostsDAO.get_one_or_none(id=post_id)

@router.get('/{user_id}/posts')
async def get_users_posts(user_id: int):
    return await PostsDAO.get_all(creator=user_id)

@router.put("/add")
async def add_post(post: SPosts, user_id: int = Depends(get_current_user_id)):
    post_id = await PostsDAO.add(title=post.title, description=post.description, creator=user_id)
    return {"detail": "Added successfully", "post_id": post_id}

@router.put("/{post_id}/edit")
async def edit_post(post_id: int, post: SPosts, user_id: int = Depends(get_current_user_id)):
    current_post = await PostsDAO.get_one_or_none(id=post_id)
    if current_post["creator"] == user_id:
        try: 
            edited_post = await PostsDAO.update(item_id=post_id, title=post.title, description=post.description)
            return {"detail": "Edited successfully", "post": edited_post}
        except: 
            raise NoAccessException
    else:
        raise NoAccessException

@router.delete("/{post_id}/delete")
async def delete_post(post_id: int, user_id: int = Depends(get_current_user_id)):
    current_post = await PostsDAO.get_one_or_none(id=post_id)
    if current_post["creator"] == user_id:
        await PostsDAO.delete(id=post_id)
        return {"detail": "Deleted successfully"}
    else:
        raise NoAccessException
    

        