from datetime import datetime
from .core import BaseModel
from typing import Optional
from sqlalchemy import ForeignKey, String, Text, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Task(BaseModel):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    completed: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False)

    creation_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    due_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    update_date: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(),
        nullable=False
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    category_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey('categories.id'))

    user: Mapped["User"] = relationship(back_populates="tasks")
    category: Mapped[Optional["Category"]
                     ] = relationship(back_populates="tasks")

    def __str__(self) -> str:
        return (
            f"Task -> id: {self.id}, title: {self.title}" +
            f"description: {self.description}, due date: {self.due_date}" +
            f"completed: {self.completed}"
        )
