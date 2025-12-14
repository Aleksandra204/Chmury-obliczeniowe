from pydantic import BaseModel
from typing import List, Optional


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    diet: str
    allergens: List[str] = []


class UserUpdate(BaseModel):
    diet: Optional[str] = None
    allergens: Optional[List[str]] = None


class UserResponse(UserBase):
    diet: Optional[str]
    allergens: List[str] = []
