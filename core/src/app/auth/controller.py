import sys
import aiofiles
from datetime import datetime, timedelta
from fastapi import UploadFile, File

from src.schema.user import user_model
from src.service.mongo import user_service
import src.utils.auth_util as auth_util


class AuthController:
    def __init__(self):
        pass

    def create_account(self, new_user):
        # check if user exists
        user = user_service.get_by_field('email', new_user['email'])
        if user:
            raise FileExistsError("Email already in use")

        # generate password hash
        hashed_password = auth_util.get_password_hash(new_user['password'])
        new_user['password'] = hashed_password

        # set scoredMatches
        new_user['scoredMatches'] = []

        # Add new user to database
        created_user = user_service.create(new_user)

        # Generate access token
        access_token_expires = timedelta(days=auth_util.ACCESS_TOKEN_EXPIRE_DAYS)
        access_token = auth_util.create_access_token(
            data={"email": created_user['email']}, 
            expires_delta=access_token_expires
        )

        # return access token        
        return {"access_token": access_token, "token_type": "bearer", "userId": created_user["id"]}


    def login(self, credentials):
        # Try to find the user by email or username
        user_result = user_service.get_by_email_or_username(credentials['identifier'])

        # Validate password
        password_valid = auth_util.verify_password(
            credentials['password'], 
            user_result['password']
        )
        if not password_valid:
            raise LookupError(f"invalid password for user {credentials['indentifier']}")

       
        # Generate access token
        access_token_expires = timedelta(days=auth_util.ACCESS_TOKEN_EXPIRE_DAYS)
        access_token = auth_util.create_access_token(
            data={"email": user_result['email']}, 
            expires_delta=access_token_expires
        )

        # return access token        
        return {"access_token": access_token, "token_type": "bearer", "userId": user_result["id"]}



auth_controller = AuthController()
