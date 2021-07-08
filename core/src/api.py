import os
import unittest
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.app.example import router as example_router
from src.app.user import user_router
from src.app.matching import matching_router
from src.app.admin import admin_router
from src.app.auth import auth_router

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "https://blind-date-umich.herokuapp.com"
]

app = FastAPI(
    title='blind date core',
    docs_url='/'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(example_router, prefix="/example", tags=["example"])
app.include_router(user_router, prefix="/user", tags=["user"])
app.include_router(matching_router, prefix="/matches", tags=["matches"])
app.include_router(admin_router, prefix="/admin", tags=["admin"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])

app.mount("/static", StaticFiles(directory="static"), name="static")
