from fastapi import APIRouter, Body
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

router = APIRouter()

@router.get('/hello')
async def basic():
    return { 'message': "!hello from the backend!" }
