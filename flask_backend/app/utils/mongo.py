from bson import ObjectId


def to_object_id(id_str):
    try:
        return ObjectId(id_str)
    except Exception:
        return id_str


def serialize_document(doc: dict) -> dict:
    if not doc:
        return doc
    new_doc = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            new_doc[key] = str(value)
        elif isinstance(value, list):
            new_doc[key] = [str(v) if isinstance(v, ObjectId) else v for v in value]
        else:
            new_doc[key] = value
    return new_doc


