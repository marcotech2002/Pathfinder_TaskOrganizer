from pydantic import BaseModel


class LoginRequest(BaseModel):
    """
    Class to represent a login request
    """
    username: str
    password: str


class UserResponse(BaseModel):
    """
    Class to represent a user response
    """
    id: int
    name: str
    username: str
