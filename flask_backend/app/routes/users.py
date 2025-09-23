from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..extensions import mongo_client
from ..utils.mongo import serialize_document
from ...app import ls as location_service


users_bp = Blueprint('users', __name__)

@users_bp.get('/')
@jwt_required()
def list_users():
    db = mongo_client.get_db()
    users = []
    for doc in db.users.find({}):
        doc.pop('password', None)
        users.append(serialize_document(doc))
    return jsonify({'success': True, 'data': users}), 200


@users_bp.get('/get_current_address')
@jwt_required()
def get_address():
    return jsonify({'success': True, 'data': []}), 200