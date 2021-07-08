from fastapi import UploadFile, File
from pydantic import BaseModel
from typing import (
    Deque, Dict, FrozenSet, List, Optional, Sequence, Set, Tuple, Union, Optional
)

from src.schema.user import user_model, contacts_model

class prof_pic_response(BaseModel):
    userId: str
    profilePicUrl: str


class My_Match(user_model):
    numMatchers: int
    response: str
    myResponse: str

class update_user_body(BaseModel):
    firstName: str
    lastName: str
    email: str
    gender: int
    genderPref: List[int]
    age: int
    password: Optional[str]
    status: Optional[str] = None
    bio: Optional[str]
    prompt1: Optional[str] = None
    prompt2: Optional[str] = None
    prompt3: Optional[str] = None
    prompt4: Optional[str] = None
    prompt5: Optional[str] = None
    contacts: Optional[contacts_model]
