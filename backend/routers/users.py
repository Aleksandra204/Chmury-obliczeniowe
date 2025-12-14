from fastapi import APIRouter
from schemas.user import UserCreate, UserUpdate
from services.users_service import (
    create_user,
    get_users,
    update_user,
    delete_user,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def list_users():
    return get_users()


@router.post("/")
def add_user(user: UserCreate):
    create_user(user.username, user.diet, user.allergens)
    return {"status": "created"}


@router.put("/{username}")
def edit_user(username: str, user: UserUpdate):
    update_user(username, user.diet, user.allergens)
    return {"status": "updated"}


@router.delete("/{username}")
def remove_user(username: str):
    delete_user(username)
    return {"status": "deleted"}
