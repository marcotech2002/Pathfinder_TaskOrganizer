from pydantic import BaseModel


class LoginRequest(BaseModel):
    """
    Class to represent a login request
    """
    username: str
    password: str


class UserCreateRequest(BaseModel):
    """
    Class to represent a user creation request
    """
    name: str
    username: str
    password: str


class UserResponse(BaseModel):
    """
    Class to represent a user response
    """
    id: int
    name: str
    username: str
