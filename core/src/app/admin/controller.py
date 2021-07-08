from src.service.mongo import user_service
from src.service.mongo import matches_service
from src.utils.admin_util import to_camel_case, delete_key
from src.utils.auth_util import get_password_hash
from src.app.user.controller import user_controller


class AdminController:
    def clear_user_db(self):
        user_service.delete_all()

    def clear_matches_db(self):
        matches_service.delete_all()

    def camel(self):
        users = user_service.get_all()
        for user in users:
            keys = user.keys()
            user.pop('_id', None)
            camel_user = {to_camel_case(k):user[k] for k in keys}
            camel_user = delete_key(camel_user, '_id')
            camel_user = delete_key(camel_user, 'id')
            user_service.create(camel_user)
            camel_user = delete_key(camel_user, '_id')
            camel_user = delete_key(camel_user, 'id')
            user_service.delete(user['id'])
        return None

    def gender_list(self):
        users = user_service.get_all()
        for user in users:
            user['genderPref'] = [user['genderPref']]
            user_service.update(user)

    def add_field(self, key: str, keyType: str, collection: str):
        service = None
        if collection == 'matches':
            service = matches_service
        elif collection == 'users':
            service = user_service

        value = None

        if keyType == 'str': value = ''
        elif keyType == 'int': value = 0
        elif keyType == 'list': value = []
        elif keyType == 'dict': value = {}

        if not service: raise ValueError('collection fucked')
        if value == None: raise TypeError('key type fucked')

        items = service.get_all()
        for item in items:
            item[key] = value
            service.update(item)

    def delete_field(self, key: str, collection: str):
        service = None
        if collection == 'matches':
            service = matches_service
        elif collection == 'users':
            service = user_service

        if not service: raise ValueError('collection fucked')

        items = service.get_all()
        for item in items:
            item = delete_key(item, key)
            service.update(item)

    def change_pass(self, email, newPass):
        user = user_service.get_by_email_or_username(email)
        if not user: raise Exception('no user with this email')
        print(user)
        user['password'] = get_password_hash(newPass)
        user_service.update(user)

    def check_matches(self, email):
        user = user_service.get_by_email_or_username(email)
        if not user: raise Exception('no user with this email')
        print(user)
        matches = user_controller.my_matches(user['id'])
        print(matches[0])
        if matches: matches = [
            {
                'firstName': m['firstName'], 
                'lastName': m['lastName'],
                'email': m['email'],
                'id': m['id']
            }
            for m in matches
        ]
        return matches
            


admin_controller = AdminController()
