from fastapi import APIRouter, Body, Depends, UploadFile, File
from pydantic import BaseModel
from typing import (
    Deque, Dict, FrozenSet, List, Optional, Sequence, Set, Tuple, Union
)

from .controller import user_controller
from src.schema.user import user_model
from src.schema.matches import match_model
from src.utils.auth_util import auth_middleware
import src.app.user.schema as schema


router = APIRouter()



@router.get("/me", response_model=user_model)
async def me(current_user: user_model = Depends(auth_middleware)):
    print('/user/me')
    return current_user
    

@router.get("/my-matches", response_model=List[schema.My_Match])
async def my_matches(current_user: user_model = Depends(auth_middleware)):
    print('/user/my-matches')
    user_id = current_user['id']
    result = user_controller.my_matches(user_id)
    return result


@router.post('/upload-profile-pic', response_model=schema.prof_pic_response)
async def upload_profile_pic(imageFile: UploadFile = File(...), current_user: user_model = Depends(auth_middleware)):
    print('/user/upload-profile-pic')
    user_id = current_user['id']
    profile_pic_url = await user_controller.upload_profile_pic(imageFile, user_id)
    updated_user = user_controller.update_prof_pic(user_id, profile_pic_url)
    print('profilePicUrl:', profile_pic_url, imageFile.filename)
    return {'userId': user_id, 'profilePicUrl': profile_pic_url}

@router.post('/update-user', response_model=user_model)
async def update_user(
    updated_user: schema.update_user_body, 
    current_user: user_model = Depends(auth_middleware)
):
    user_id = current_user['id']
    new_user = updated_user.dict()
    print('\nnew_user: ', new_user)
    result = user_controller.update_user(user_id, new_user)
    print('\n\nresult: ', result)
    return result