from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import mapped_column, Mapped

from app.database import Base, created_at, updated_at, int_pk

class Posts(Base):
    __tablename__ = "posts"
    id: Mapped[int_pk]
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    creator: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
