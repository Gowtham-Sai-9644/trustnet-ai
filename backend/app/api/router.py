from fastapi import APIRouter
from backend.app.api.v1.router import api_router as v1_router

router = APIRouter()
router.include_router(v1_router)
