from pydantic import BaseModel, BaseConfig, Field
from datetime import date, datetime, time, timedelta
from typing import (
    Deque, Dict, FrozenSet, List, Optional, Sequence, Set, Tuple, Union, Optional
)


class contacts_model(BaseModel):
    instagram: Optional[str]
    snapchat: Optional[str]
    facebook: Optional[str]
    phoneNumber: Optional[str]

class user_model(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str
    gender: int
    genderPref: List[int]
    age: int
    password: str
    status: Optional[str] = None
    profilePicUrl: Optional[str] = None
    bio: Optional[str]
    prompt1: Optional[str] = None
    prompt2: Optional[str] = None
    prompt3: Optional[str] = None
    prompt4: Optional[str] = None
    prompt5: Optional[str] = None
    score: Optional[int] = None
    scoredMatches: List[str]
    contacts: Optional[contacts_model]
