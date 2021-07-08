from src.test.app.base import BaseTestCase

class test_user(BaseTestCase):
    async def test_CourseAnalysis(self):
        """POST /user/create-user"""
        self.shortDescription()
        async with self.client:
            response = await self.client.post(
                "/user/create-user",
                json={
                    "first_name": "test2",
                    "last_name": "string",
                    "email": "string",
                    "gender": 0
                },
            )
            data = response.json()
            print('created a user ?', data)
