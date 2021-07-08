from datetime import datetime
from google.cloud import storage
from google.oauth2 import service_account

from src.infrastructure.gcloud import get_gcloud_environment


keyfile_name, project_id, stage = get_gcloud_environment()

bucket_name = 'name-of-bucket'
object_name = 'objectName.jpg'


if keyfile_name:
    credentials = service_account.Credentials.from_service_account_file(keyfile_name)
    client = storage.Client(project=project_id, credentials=credentials)
else:
    client = storage.Client(project=project_id)

# bucket = client.get_bucket(bucket_name)
# blob = bucket.get_blob(object_name)
# blob.upload_from_filename('localImageFileName.jpg', content_type='image/jpeg')
# blob.make_public()
# uri = "gs://%s/%s" % (bucket_name, object_name)

def upload_image(bucket_name: str, filename: str, image_data, content_type: str):
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(filename)
    blob.upload_from_string(image_data, content_type=content_type)
    #blob.make_public()
    url = "https://storage.googleapis.com/%s/%s" % (bucket_name, filename)
    url += "?t=" + str(datetime.now().second + datetime.now().minute * 60)
    return url