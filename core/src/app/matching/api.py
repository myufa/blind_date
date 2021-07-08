from fastapi import APIRouter, Body, Depends
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import (List, Dict)

from .controller import matcher_controller
from src.schema.user import user_model
from src.schema.matches import match_model
import src.app.matching.schema as schema 
from src.utils.auth_util import auth_middleware

router = APIRouter()


@router.get('/get-potential-matches', response_model=schema.potential_matches_model)
async def get_potential_matches(current_user: user_model = Depends(auth_middleware)):
    print('/matches/get-potential-matches')
    user_id = current_user['id']
    result = matcher_controller.get_potential_matches(user_id)
    print(result)
    return result

@router.post('/get-new-matches', response_model=schema.potential_matches_model)
async def get_new_matches(
    body: schema.get_new_matches_model,
    current_user: user_model = Depends(auth_middleware)
):
    print('/get-new-matches')
    user_id = current_user['id']
    oldMatches = body.dict()['oldMatches']
    numFetch = body.dict()['numFetch']
    result = matcher_controller.get_new_matches(user_id, oldMatches, numFetch)
    print(result)
    return result

@router.post('/submit-match', response_model=match_model)
async def submit_matches(
    match: match_model, 
    current_user: user_model = Depends(auth_middleware)
):
    print('/matches/submit-match')
    made_match = matcher_controller.submit_match(match)
    return made_match

@router.post('/respond-to-match', response_model=match_model)
async def respond_to_match(
    body: schema.respond_to_match_model, 
    current_user: user_model = Depends(auth_middleware)
):
    print('/respond-to-match')
    match, response = body.matchId, body.response
    updated_match = matcher_controller.respond_to_match(match, response, current_user)
    return updated_match
