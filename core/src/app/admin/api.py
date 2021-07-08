from fastapi import APIRouter, Body, Response, status
from pydantic import BaseModel
from typing import (
    Deque, Dict, FrozenSet, List, Optional, Sequence, Set, Tuple, Union, Optional
)
from .controller import admin_controller

from src.schema.user import user_model

router = APIRouter()

@router.post('/clear-user-db')
def clear_user_db(admin_key: str, response: Response):
    print('/admin/clear-user-db')
    if admin_key == 'pink-ponies':
        admin_controller.clear_user_db()
        return {'message': 'success?'}
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {'message': 'You are not authorized, nice try bro'}

@router.post('/clear-matches-db')
def clear_matches_db(admin_key: str, response: Response):
    print('/admin/clear-matches-db')
    if admin_key == 'pink-ponies':
        admin_controller.clear_matches_db()
        return {'message': 'success?'}
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {'message': 'You are not authorized, nice try bro'}


@router.post('/camel')
def camel(admin_key: str, user_id: str, response: Response):
    print('/camel')
    if admin_key == 'pink-ponies':
        admin_controller.camel()
        return {'message': 'success?'}
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {'message': 'You are not authorized, nice try bro'}

@router.post('/gender-list')
def gender_list(admin_key: str, response: Response):
    print('/gender-list')
    if admin_key == 'pink-ponies':
        admin_controller.gender_list()
        return {'message': 'success?'}
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {'message': 'You are not authorized, nice try bro'}

@router.post('/add-field')
def add_field(admin_key: str, key: str, keyType: str, collection: str, response: Response):
    print('/add-field')
    if admin_key == 'pink-ponies':
        admin_controller.add_field(key, keyType, collection)
        return {'message': 'success?'}
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {'message': 'You are not authorized, nice try bro'}

@router.post('/delete-field')
def delete_field(admin_key: str, key: str, collection: str, response: Response):
    print('/delete-field')
    if admin_key == 'pink-ponies':
        admin_controller.delete_field(key, collection)
        return {'message': 'success?'}
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {'message': 'You are not authorized, nice try bro'}

@router.post('/change-pass')
def change_pass(admin_key: str, email, newPass, response: Response):
    print('/change-pass')
    if admin_key == 'pink-ponies':
        admin_controller.change_pass(email, newPass)
        return {'message': 'success?'}
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {'message': 'You are not authorized, nice try bro'}

@router.post('/check-matches')
def check_matches(admin_key: str, email, response: Response):
    print('/change-pass')
    if admin_key == 'pink-ponies':
        matches = admin_controller.check_matches(email)
        return {'message': 'success?', 'matches': matches}
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {'message': 'You are not authorized, nice try bro'}
