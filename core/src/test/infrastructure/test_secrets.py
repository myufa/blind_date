from unittest import TestCase

from src.infrastructure.secrets import get_secret


class test_secrets(TestCase):
    def test_mongo(self):
        mongo_secret = get_secret('MONGO_PASS')
        print('pass: ', mongo_secret)