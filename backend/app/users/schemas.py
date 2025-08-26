from pydantic import BaseModel

class SUserCreate(BaseModel):
    email: str
    username: str
    password: str
    about: str = ""

class SUserLogin(BaseModel):
    username_or_email: str
    password: str

class SUserEdit(BaseModel):
    username: str
    email: str
    about: str
    
class SEditPassword(BaseModel):
    old_password: str
    new_password: str