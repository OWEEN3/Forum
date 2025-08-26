from fastapi import Depends, HTTPException, Request
from jose import jwt, ExpiredSignatureError, JWTError

from app.config import settings
from app.exceptions import TokenExpiredException, IncorrectTokenFormatException, \
    UserIsAbsentException
from app.users.dao import UsersDAO


async def get_token(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")
    return token

async def get_current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(token, settings.JWT_CODE, settings.JWT_ALGORITHM)
    except ExpiredSignatureError:
        raise TokenExpiredException
    except JWTError:
        raise IncorrectTokenFormatException
    user_id: str = payload.get("user_id")
    if not user_id:
        raise IncorrectTokenFormatException
    user = await UsersDAO.get_one_or_none(id=int(user_id))
    if not user:
        raise UserIsAbsentException
    user_dict = user.__dict__.copy()
    user_dict.pop("password", None)
    return user_dict

async def get_current_user_id(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(token, settings.JWT_CODE, settings.JWT_ALGORITHM)
    except ExpiredSignatureError:
        raise TokenExpiredException
    except JWTError:
        raise IncorrectTokenFormatException
    user_id: str = payload.get("user_id")
    if not user_id:
        raise IncorrectTokenFormatException
    return user_id