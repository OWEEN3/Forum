from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.comments.router import router as comments_router
from app.users.router import router as user_router
from app.posts.router import router as posts_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(user_router)
app.include_router(posts_router)
app.include_router(comments_router)