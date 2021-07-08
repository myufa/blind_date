from pydantic import BaseModel
from typing import (
    Deque, Dict, FrozenSet, List, Optional, Sequence, Set, Tuple, Union, Optional
)

from src.schema.user import user_model

class potential_matches_model(BaseModel):
    numPotentialMatches: int
    potentialMatches: List[user_model]

class respond_to_match_model(BaseModel):
    matchId: str
    response: str

class get_new_matches_model(BaseModel):
    oldMatches: List[str]
    numFetch: int
    