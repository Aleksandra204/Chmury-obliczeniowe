from fastapi import APIRouter
from db import get_driver

router = APIRouter(prefix="/meta", tags=["Meta"])


@router.get("/diets")
def get_diets():
    query = "MATCH (d:Diet) RETURN d.name AS name ORDER BY name"
    with get_driver().session() as session:
        return [r["name"] for r in session.run(query)]


@router.get("/allergens")
def get_allergens():
    query = "MATCH (a:Allergen) RETURN a.name AS name ORDER BY name"
    with get_driver().session() as session:
        return [r["name"] for r in session.run(query)]
