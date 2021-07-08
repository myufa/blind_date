from pydantic import BaseModel
from datetime import date, datetime, time, timedelta
from typing import (
    Deque, Dict, FrozenSet, List, Optional, Sequence, Set, Tuple, Union
)

from src.schema.user import user_model


class matchee_model(BaseModel):
    userId: str
    response: str

class match_model(BaseModel):
    id: Optional[str]
    user1: matchee_model
    user2: matchee_model
    matchers: List[str]
