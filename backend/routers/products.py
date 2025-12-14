from fastapi import APIRouter, Query
from services.products_service import (
    get_products_analysis,
    get_products_overview,
)
from schemas.product import ProductAnalysis, ProductOverview
from typing import List, Optional

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/analysis/{username}", response_model=List[ProductAnalysis])
def products_for_user(username: str):
    return get_products_analysis(username)


@router.get("/", response_model=List[ProductOverview])
def list_products(
    diet: Optional[str] = Query(None), excludeAllergen: Optional[str] = Query(None)
):
    return get_products_overview(diet, excludeAllergen)
