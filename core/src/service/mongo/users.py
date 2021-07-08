from .base import BaseService
import random

COLLECTION_NAME = "users"

class UserService(BaseService):
    def __init__(self):
        super().__init__(COLLECTION_NAME)

    def validate(self, entity):
        return True

    def get_demo_users(self, user_id):
        matches = self.get_all()
        random.shuffle(matches)
        matches = list(filter(lambda x: x['id'] != user_id, matches))
        return matches

    def delete_all(self):
        print('\ndeleting all users\n')
        self._collection.delete_many({})

    def get_by_email_or_username(self, indentifier: str):
        user = None
        user = self.get_by_field('email', indentifier)
        if user: return user
        user = self.get_by_field('username', indentifier)
        if not user: raise LookupError(f"No user found with this email/username {indentifier}")

    

user_service = UserService()
    