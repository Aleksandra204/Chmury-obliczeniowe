from pydantic import BaseModel
from typing import List, Optional, Literal


class Conflict(BaseModel):
    type: Literal["DIET", "ALLERGEN"]
    diet: Optional[str] = None
    allergen: Optional[str] = None
    ingredient: str
    category: Optional[str] = None


class ProductAnalysis(BaseModel):
    product: str
    price: float
    safe: bool
    reasons: List[Conflict]


class ProductOverview(BaseModel):
    product: str
    price: float
    ingredients: List[str]
    okForDiets: List[str]
    notOkForDiets: List[str]
    allergens: List[str]
