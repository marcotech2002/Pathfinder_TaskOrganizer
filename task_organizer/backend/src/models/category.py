from .core import BaseModel
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Category(BaseModel):
    __tablename__ = 'categories'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)

    tasks: Mapped[list["Task"]] = relationship(
        back_populates="category",
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    user: Mapped["User"] = relationship(back_populates="categories")

    def __str__(self) -> str:
        return f"Category -> id: {self.id}, name: {self.name}"
