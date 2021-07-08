from os import getenv
import json


def get_gcloud_environment():
    keyfile_name = None

    with open('project-metadata.json', 'r') as f:
        metadata = json.load(f)

    stage = metadata['stage']
    project_id = metadata['project_id']

    if stage == 'dev':
        keyfile_name = getenv('BD_DEV_KEYFILE')
    elif stage == 'prod':
        keyfile_name = getenv('BD_PROD_KEYFILE')

    return keyfile_name, project_id, stage
    # 'GOOGLE_APPLICATION_CREDENTIALS'
