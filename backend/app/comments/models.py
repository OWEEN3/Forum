from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base, created_at, updated_at, int_pk

class Comments(Base):
    __tablename__ = "comments"
    id: Mapped[int_pk]
    content: Mapped[str] = mapped_column(String, nullable=False)
    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"), nullable=False
    )
    creator_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]