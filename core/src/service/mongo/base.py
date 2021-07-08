from abc import abstractmethod
from src.infrastructure.mongo import db
from bson import ObjectId

def get_ids(entities):
    return map(lambda entity: entity["_id"], entities)

def convert_id(entity: dict):
    entity['id'] = str(entity['_id'])
    return entity

def convert_ids(entities: list):
    return list(map(convert_id, entities))


class BaseService:
    def __init__(self, collection):
        self._collection = db.get_collection(collection)

    @abstractmethod
    def validate(self, entity):
        raise NotImplementedError
    
    def __repr__(self):
        return pformat(vars(self), indent=4, width=1)

    def create(self, entity) -> dict:
        if entity.get("_id"):
            raise RuntimeError("doc already exists")

        self.validate(entity)
        create_result_id = self._collection.insert_one(entity).inserted_id
        create_result = self._collection.find_one(filter={"_id": create_result_id})
        create_result = convert_id(create_result)
        create_result = self.update(create_result)
        return create_result

    def create_many(self, entities: list) -> list:
        print('\n\nentities', entities, '\n\n')
        create_result_ids = self._collection.insert_many(entities).inserted_ids
        create_result = self.read_many(create_result_ids)
        if len(create_result) != len(entities):
            raise Exception("Documents may have failed to be created")
        create_result = convert_ids(create_result)
        create_result = self.update_many(create_result)
        return create_result

    def read(self, entity_id: str) -> dict:
        entity = self._collection.find_one(filter={"_id": ObjectId(entity_id)})
        if not entity:
            raise LookupError("doc not found")
        return entity

    def safe_read(self, entity_id: str) -> dict:
        try:
            entity = self._collection.find_one(filter={"_id": ObjectId(entity_id)})
        except:
            return None
        
        if not entity:
            return None
        return entity

    def read_many(self, entity_ids: list) -> list:
        entity_ids = list(map(lambda x: ObjectId(x), entity_ids))
        entities = list(self._collection.find({"_id": {"$in": entity_ids}}))
        #print('\nentities', entities, '\n')
        if len(entities) != len(entity_ids):
            print('some docs not found')
            #raise LookupError("some docs not found")

        return entities


    def get_by_field(self, field: str, value: str) -> list:
        query = self._collection.find({field: value})
        query_list = list(query)
        if len(query_list) == 0:
            return None
        else:
            return query_list[0]

    def get_many_by_field(self, field: str, value: str) -> list:
        query = self._collection.find({field: value})
        # print('list(query)', list(query))
        # print(convert_ids(list(query)))
        return convert_ids(list(query))

    def get_all(self):
        query = self._collection.find()
        # print('list(query)', list(query))
        # print(convert_ids(list(query)))
        return convert_ids(list(query))
        

    def update(self, entity) -> dict:
        update_result = self._collection.find_one_and_update(
            filter={"_id": entity["_id"]},
            update={'$set': entity}
        )
        if not update_result:
            raise LookupError("doc not found")
        
        update_result = self.read(entity['id'])

        return update_result


    def update_many(self, entities) -> list:
        entity_ids = get_ids(entities)

        update_result = self._collection.update_many(
            filter={"_id": {"$in": entity_ids}},
            update=entities      
        )

        update_entities = self.read_many(entity_ids)

        return update_entities

    def delete(self, entity_id: str) -> None:
        self._collection.delete_one(filter={"_id": ObjectId(entity_id)})

    def delete_many(self, entity_ids):
        entity_ids = [ObjectId(i) for i in entity_ids]
        self._collection.delete_many(filter={"_id": {"$in": entity_ids}})

