import sys
from fastapi import UploadFile, File
import aiofiles

from src.infrastructure.bucket_images import upload_image
from src.schema.user import user_model
from src.schema.matches import match_model
from src.service.mongo import user_service
from src.service.mongo import matches_service
from src.utils.data_util import dedup_by_key, delete_key, update_nested
from src.utils.matches_util import match_singler
import src.utils.auth_util as auth_util


class UserController:
    def __init__(self):
        pass

    async def upload_profile_pic(self, image_file: UploadFile, user_id: str):
        image_data = image_file.file.read()
        ext = image_file.content_type[6:]
        image_url = upload_image('bdprofilepics', f'{user_id}.{ext}', image_data, image_file.content_type)
        return image_url

    def update_prof_pic(self, user_id, profile_pic_url):
        user = user_service.read(user_id)
        user['profilePicUrl'] = profile_pic_url
        user = user_service.update(user)
        return user

    def update_user(self, user_id, new_user):
        if not new_user.get('password'): 
            new_user = delete_key(new_user, 'password')
        else:
            hashed_password = auth_util.get_password_hash(new_user['password'])
            new_user['password'] = hashed_password
        user = user_service.read(user_id)
        user = update_nested(user, new_user)
        user = user_service.update(user)
        return user

    def my_matches(self, userId):
        user = user_service.read(userId)
        matches_list = matches_service.get_matches(userId)
        matches_list = [
            m for m in matches_list 
            if m['user1']['response'] != 'reject'
            and m['user2']['response'] != 'reject'
            # and m['gender'] in user['genderPref']
            # and user['gender'] in m['genderPref']
        ]

        user_match_list = [match_singler(m, userId) for m in matches_list]
        for u in user_match_list:
            instances = [j for j in user_match_list if j['userId'] == u['userId']]
            if len(instances) == 2:
                matchers = instances[0]['matchers'] + instances[1]['matchers']
                instances[0]['matchers'], instances[1]['matchers'] = matchers, matchers
        user_match_list = dedup_by_key(user_match_list, 'userId')

        user_match_list = [
            {
                **user_service.safe_read(match['userId']), 
                'numMatchers': len(match['matchers']),
                'response': match['response'],
                'myResponse': match['myResponse']
            }
            for match in user_match_list
            if user_service.safe_read(match['userId'])
        ]

        # filter gender prefs
        user_match_list = [
            m for m in user_match_list if
            m['gender'] in user['genderPref']
            and user['gender'] in m['genderPref']
        ]

        return user_match_list
        


user_controller = UserController()
