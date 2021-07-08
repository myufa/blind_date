from pydantic import BaseModel
from typing import (
    Deque, Dict, FrozenSet, List, Optional, Sequence, Set, Tuple, Union, Optional
)

from src.schema.user import contacts_model

""" Universal types """
class AuthToken(BaseModel):
    access_token: str
    token_type: str
    userId: str


""" Response types """



""" Body Types """
class create_user_body(BaseModel):
    firstName: str
    lastName: str
    email: str
    gender: int
    genderPref: List[int]
    age: int
    password: str
    status: Optional[str] = None
    bio: str
    prompt1: Optional[str] = None
    prompt2: Optional[str] = None
    prompt3: Optional[str] = None
    prompt4: Optional[str] = None
    prompt5: Optional[str] = None
    score: int
    contacts: Optional[contacts_model]


class login_body(BaseModel):
    identifier: str
    password: str

