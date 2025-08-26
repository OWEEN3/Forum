from fastapi import APIRouter, Depends

from app.comments.dao import CommentsDAO
from app.comments.schemas import SComments
from app.exceptions import NoAccessException
from app.users.dependencies import get_current_user_id

router = APIRouter(prefix="/comments",tags=["Comments"])

@router.get("/{post_id}")
async def get_posts_comments(post_id: int):
    return await CommentsDAO.get_all(post_id=post_id)

@router.post("/{post_id}/add")
async def add_comment(post_id: int, comment: SComments, user_id: int = Depends(get_current_user_id)):
    comment_id = await CommentsDAO.add(content=comment.content, post_id=post_id, creator_id=user_id)
    return {"detail": "Added successfully", "comment_id": comment_id}

@router.patch("/edit/{comment_id}")
async def edit_comment(comment_id:int, new_comment: SComments, user_id: int = Depends(get_current_user_id)):
    comment = await CommentsDAO.get_one_or_none(id = comment_id)
    if comment.creator_id == user_id:
        comment_id = await CommentsDAO.update(comment_id, content=new_comment.content)
        return {"detail": "Edited successfully", "comment_id": comment_id}
    else:
        raise NoAccessException

@router.delete("/delete/{comment_id}")
async def delete_comment(comment_id: int, user_id: int = Depends(get_current_user_id)):
    await CommentsDAO.delete(id=comment_id, creator_id=user_id)
    return {"detail": "Deleted successfully"}