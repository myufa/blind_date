
from src.schema.matches import match_model
from .data_util import delete_key

def match_singler(match, userId: str):
    if match['user1']['userId'] == userId:
        theirId = match['user2']['userId']
        response = match['user2']['response']
        my_response = match['user1']['response']
    elif match['user2']['userId'] == userId:
        theirId = match['user1']['userId']
        response = match['user1']['response']
        my_response = match['user2']['response']
    else:
        raise LookupError('unvalid match match_util::matchsingler::10')

    match = delete_key(match, 'user1')
    match = delete_key(match, 'user2')
    match['userId'] = theirId
    match['response'] = response
    match['myResponse'] = my_response
    return match

    
