from unittest import TestCase
from aiounittest import AsyncTestCase
from httpx import AsyncClient
from main import app


class BaseTestCase(AsyncTestCase):
    """ Base Tests """

    def setUp(self):
        self.client = AsyncClient(app=app, base_url="http://test")
