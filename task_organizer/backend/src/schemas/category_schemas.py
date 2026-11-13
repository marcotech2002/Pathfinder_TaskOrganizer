from typing import Optional

from pydantic import BaseModel, ConfigDict


class CategoryCreateRequest(BaseModel):
    name: str
    color: str


class CategoryUpdateRequest(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    color: str
    tasks_count: int

    model_config = ConfigDict(from_attributes=True)


class TaskCategoryResponse(BaseModel):
    id: int
    name: str
    color: str

    model_config = ConfigDict(from_attributes=True)
