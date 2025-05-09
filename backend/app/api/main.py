from fastapi import APIRouter

from app.api.routes import items, login, private, users, utils, products
from app.api.api_v1.endpoints import affirmation
from app.core.config import settings

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(affirmation.router, prefix='/affirmations', tags=['Affirmations'])


if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
