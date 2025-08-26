from datetime import datetime, timedelta, UTC

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"])

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    jwt_token = jwt.encode(to_encode, settings.JWT_CODE, algorithm=settings.JWT_ALGORITHM)
    return jwt_token

async def verify_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.JWT_CODE, algorithms=settings.JWT_ALGORITHM)
        return payload
    except JWTError:
        return None