from unittest import TestCase
from src.infrastructure.mongo import client

class test_mongo(TestCase):
    def test_basic(self):
        db = client['blind-date-dev']
        users = db.users
        user = {
            "name": "test"
        }
        result = users.insert_one(user)
        user = users.find_one(filter={"_id": result.inserted_id})
        print("I work", result.inserted_id, user)
        