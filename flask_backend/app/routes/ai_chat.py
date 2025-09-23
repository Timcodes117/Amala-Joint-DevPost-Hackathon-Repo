from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..extensions import mongo_client
from ..utils.mongo import serialize_document


ai_chatbot_bp = Blueprint('users', __name__)


@ai_chatbot_bp.get('/ask/')
@jwt_required()
def list_users():
    return jsonify({'success': True, 'data': "respones"}), 200

