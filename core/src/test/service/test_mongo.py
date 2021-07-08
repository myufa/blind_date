from unittest import TestCase
from src.service.mongo import user_service

class test_mongo(TestCase):
    def test_create_and_read(self):
        create_result = user_service.create({"name": "test"})
        print("create_result", create_result)
        read_result = user_service.read(create_result["_id"])
        print("read_result", read_result)
        
