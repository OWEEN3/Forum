from fastapi import APIRouter, Response
from fastapi.params import Depends
from pydantic_core import PydanticCustomError
from pydantic import validate_email

from app.exceptions import UserIsNotRegisteredException, InvalidPasswordException, UncorrectedEmailException, \
    UserAlreadyRegisteredException, UserIsNotAuthorizedException, UserIsAbsentException
from app.users.auth import get_password_hash, verify_password, create_access_token
from app.users.dao import UsersDAO
from app.users.dependencies import get_current_user, get_current_user_id
from app.users.models import Users
from app.users.schemas import SUserCreate, SUserLogin, SUserEdit, SEditPassword
from datetime import datetime, timedelta, timezone

router = APIRouter(tags=["Users"])

@router.post('/register', status_code=201)
async def register(response: Response, user: SUserCreate):
    try:
        validate_email(user.email)
        exists_credentials = await UsersDAO.get_users_by_email_and_username(
            username=user.username, email=user.email
        )
        if exists_credentials:
            raise UserAlreadyRegisteredException
        user_id = await UsersDAO.add(
            username=user.username, password=get_password_hash(user.password), email=user.email, about=user.about
        )
        access_token = await create_access_token({"user_id": user_id})
        expires = datetime.now(timezone.utc) + timedelta(minutes=30)
        response.set_cookie(key="token", value=access_token, httponly=True, samesite="lax", secure=False, max_age=30 * 60, expires=expires)
        return {"detail": "User registered successfully", "user_id": user_id}
    except PydanticCustomError:
        raise UncorrectedEmailException

@router.post('/login')
async def login(response: Response, user: SUserLogin):
    user_data = await UsersDAO.get_user_by_username_or_email(user.username_or_email)
    if user_data:
        if verify_password(plain_password=user.password, hashed_password=user_data.password):
            access_token = await create_access_token({"user_id": user_data.id})
            expires = datetime.now(timezone.utc) + timedelta(minutes=30)
            response.set_cookie(key="token", value=access_token, httponly=True, samesite="lax", secure=False, max_age=30 * 60, expires=expires)
            return {"detail": "Login successful", "user_id": user_data.id}
        else: raise InvalidPasswordException
    else:
        raise UserIsNotRegisteredException

@router.get('/users/me')
async def get_me(user: Users = Depends(get_current_user)):
    if user:
        return user
    else:
        raise UserIsNotAuthorizedException

@router.get('/users/{user_id}')
async def get_user_by_id(user_id: int):
    user = await UsersDAO.get_one_or_none(id=user_id)
    if user:
        user_dict = user.__dict__.copy()
        user_dict.pop("password", None)
        user_dict.pop("email", None)
        return user_dict
    else:
        raise UserIsAbsentException

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="token", path="/")
    return {"detail": "Logout successful"}

@router.post("/users/edit/info")
async def edit_about(user_info: SUserEdit, user: Users = Depends(get_current_user)):
    try: validate_email(user_info.email)
    except: raise UncorrectedEmailException
    exist = ''
    if user_info.email != user["email"] and user_info.username != user["username"]:
        exist = await UsersDAO.get_users_by_email_and_username(user_info.email, user_info.username)
    elif user_info.email != user["email"]:
        exist = await UsersDAO.get_user_by_username_or_email(user_info.email)
    elif user_info.username != user["username"]:
        exist = await UsersDAO.get_user_by_username_or_email(user_info.username)
    if not exist:
        user_id = await UsersDAO.update(user["id"], username=user_info.username, email=user_info.email, about=user_info.about)
        return {"detail": "Edited successful", "user_id": user_id}
    else:
        raise UserAlreadyRegisteredException

@router.post("/users/edit/password")
async def edit_password(passwords: SEditPassword, user: Users = Depends(get_current_user)):
    user_data = await UsersDAO.get_one_or_none(id=user["id"])
    if user_data:
        if verify_password(plain_password=passwords.old_password, hashed_password=user_data.password):
            user_id = await UsersDAO.update(user_data.id, password=get_password_hash(passwords.new_password))
            return {"detail": "Edited successful", "user_id": user_id}
        else: raise InvalidPasswordException
    else:
        raise UserIsNotRegisteredException