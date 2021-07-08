from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

from .controller import auth_controller
import src.app.auth.schema as schema
from src.schema.user import user_model
from src.utils.auth_util import auth_middleware

router = APIRouter()

@router.post('/create-account', response_model=schema.AuthToken)
async def create_account(new_user: schema.create_user_body):
    print('auth/create-account')
    # get user as dict
    new_user_dict = new_user.dict()

    # attempt to create account
    try :
        auth_result = auth_controller.create_account(new_user_dict)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return auth_result

@router.post('/login', response_model=schema.AuthToken)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print('auth/login')
    # get email and password from form data
    credentials = {'identifier': form_data.username, 'password' : form_data.password}

    print('creds: ', credentials)

    # attempt to login
    try :
        auth_result = auth_controller.login(credentials)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    return auth_result
    
@router.get('/is-authenticated')
async def is_authenticated(current_user: user_model = Depends(auth_middleware)):
    return {'message': 'success'}

    
