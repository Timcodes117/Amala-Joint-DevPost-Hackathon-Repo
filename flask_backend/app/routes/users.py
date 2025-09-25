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

@users_bp.post('/get_current_address')
def get_address():
    data = request.get_json() or {}
    try:
        latitude = float(data.get("latitude")) if data.get("latitude") is not None else None
        longitude = float(data.get("longitude")) if data.get("longitude") is not None else None
    except (TypeError, ValueError):
        return jsonify({"error": "Latitude and longitude must be numbers"}), 400

    if latitude is None or longitude is None:
        provided = list(data.keys()) if isinstance(data, dict) else []
        return jsonify({
            "error": "Latitude and longitude are required",
            "provided_keys": provided
        }), 400

    address = LocationService.get_current_address(latitude, longitude)
    return jsonify({'success': True, 'data': address}), 200


# @jwt_required()
# def get_address():
#     data = LocationService.get_current_address()
#     return jsonify({'success': True, 'data': []}), 200