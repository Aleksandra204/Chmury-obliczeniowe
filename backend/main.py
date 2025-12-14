from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import users, products, meta

app = FastAPI(title="Shopping Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(products.router)
app.include_router(meta.router)
