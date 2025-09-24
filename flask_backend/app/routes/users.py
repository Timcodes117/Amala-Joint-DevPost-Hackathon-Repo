from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ..extensions import mongo_client
from ..utils.mongo import serialize_document
from services.location import  LocationService



users_bp = Blueprint('users', __name__)

# @users_bp.get('/')
# @jwt_required()
# def list_users():
#     db = mongo_client.get_db()
#     users = []
#     for doc in db.users.find({}):
#         doc.pop('password', None)
#         users.append(serialize_document(doc))
#     return jsonify({'success': True, 'data': users}), 200

def get_address():
    data = request.get_json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if not latitude or not longitude:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    address = LocationService.get_current_address(latitude, longitude)
    return jsonify({'success': True, 'data': address}), 200


@users_bp.get('/get_current_address')
@jwt_required()
def get_address():
    data = LocationService.get_current_address()
    return jsonify({'success': True, 'data': []}), 200