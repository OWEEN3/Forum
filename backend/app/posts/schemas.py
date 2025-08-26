from pydantic import BaseModel

class SPosts(BaseModel):
    title: str
    description: str