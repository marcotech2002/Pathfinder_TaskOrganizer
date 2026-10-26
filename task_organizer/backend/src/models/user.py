from sqlalchemy import String
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, deferred, relationship
from werkzeug.security import generate_password_hash, check_password_hash

from .core import BaseModel


class User(BaseModel):
    """
    Class representing a User model
    """
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    username: Mapped[str] = mapped_column(
        String(150), unique=True, nullable=False)

    _password_hash: Mapped[str] = deferred(
        mapped_column("password", String(255), nullable=False)
    )

    tasks: Mapped[list["Task"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    @hybrid_property
    def password(self) -> str:
        raise AttributeError(
            "The password cannot be read directly in plain text.")

    @password.setter
    def password(self, plaintext_password: str) -> None:
        self._password_hash = generate_password_hash(plaintext_password)

    def verify_password(self, plaintext_password: str) -> bool:
        return check_password_hash(self._password_hash, plaintext_password)

    def __str__(self) -> str:
        return f"User -> id: {self.id}, name: {self.name}"
