import os
from google.cloud import secretmanager
from google.oauth2 import service_account

from src.infrastructure.gcloud import get_gcloud_environment


keyfile_name, project_id, stage = get_gcloud_environment()

if keyfile_name:
    credentials = service_account.Credentials.from_service_account_file(keyfile_name)
    secretmanager_client = secretmanager.SecretManagerServiceClient(credentials=credentials)
else:
    secretmanager_client = secretmanager.SecretManagerServiceClient()


def get_secret(secret_name):
    resource_name = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
    response = secretmanager_client.access_secret_version(request={"name": resource_name})
    secret = response.payload.data.decode('UTF-8')
    return secret
