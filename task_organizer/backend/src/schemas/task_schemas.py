from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class TaskCreateRequest(BaseModel):
    """
    Class to represent a task creation request
    """
    title: str
    description: str
    due_date: Optional[datetime] = None
    category_id: Optional[int] = None


class TaskUpdateRequest(BaseModel):
    """
    Class to represent a task update request
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    category_id: Optional[int] = None


class TaskResponse(BaseModel):
    """
    Class to represent a task response
    """
    id: int
    title: str
    description: str
    completed: bool
    creation_date: datetime
    update_date: datetime
    due_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    category_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
