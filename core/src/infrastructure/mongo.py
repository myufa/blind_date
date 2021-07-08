from pymongo import MongoClient

from src.infrastructure.secrets import get_secret


mongo_pass = get_secret('MONGO_PASS')

mongo_uri = "mongodb+srv://blind-date-dev:%s@blind-date-dev.zxeuh.mongodb.net/blind-date-dev?retryWrites=true&w=majority" \
    % mongo_pass
    
client = MongoClient(mongo_uri)
db = client['blind-date-dev']
