from .base import BaseService

from src.schema.matches import match_model

COLLECTION_NAME = "matches"

class MatchesService(BaseService):
    def __init__(self):
        super().__init__(COLLECTION_NAME)

    def validate(self, entity):
        return True

    def find_match(self, match: match_model):
        match_query = self._collection.find_one({
            '$or': [
                {'user1.userId': match.user1.userId, 'user2.userId': match.user2.userId},
                {'user2.userId': match.user1.userId, 'user1.userId': match.user2.userId}
            ]
        })

        return match_query

    def find_match_by_users(self, user1Id: str, user2Id: str):
        match_query = self._collection.find_one({
            '$or': [
                {'user1.userId': user1Id, 'user2.userId': user2Id},
                {'user2.userId': user1Id, 'user1.userId': user2Id}
            ]
        })

        return match_query

    def get_matches(self, user_id):
        user1 = self.get_many_by_field('user1.userId', user_id)
        user2 = self.get_many_by_field('user2.userId', user_id)
        all_matches = user1 + user2
        return all_matches

    def delete_all(self):
        self._collection.delete_many({})

matches_service = MatchesService()
    