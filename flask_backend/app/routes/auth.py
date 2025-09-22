from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from ..extensions import mongo_client
from ..utils.mongo import serialize_document, to_object_id


auth_bp = Blueprint('auth', __name__)


def validate_user_data(data):
    errors = {}
    if 'name' not in data or not str(data['name']).strip():
        errors['name'] = 'Name is required' 
    if 'email' not in data or not str(data['email']).strip():
        errors['email'] = 'Email is required'
    elif '@' not in data['email']:
        errors['email'] = 'Invalid email format'
    if 'password' not in data or not data['password']:
        errors['password'] = 'Password is required'
    elif len(data['password']) < 6:
        errors['password'] = 'Password must be at least 6 characters long'
    return len(errors) == 0, errors


@auth_bp.post('/signup')
def signup():
    data = request.get_json() or {}
    is_valid, errors = validate_user_data(data)
    if not is_valid:
        return jsonify({'success': False, 'error': 'Validation failed', 'details': errors}), 400

    db = mongo_client.get_db()
    existing = db.users.find_one({'email': data['email']})
    if existing:
        return jsonify({'success': False, 'error': 'User with this email already exists'}), 400

    now = datetime.utcnow().isoformat()
    user_doc = {
        'name': data['name'],
        'email': data['email'],
        'password': data['password'],
        'phone': data.get('phone'),
        'age': data.get('age'),
        'created_at': now,
        'updated_at': now,
        'is_active': True,
    }
    result = db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    access_token = create_access_token(identity=user_id, expires_delta=timedelta(hours=1))
    refresh_token = create_refresh_token(identity=user_id, expires_delta=timedelta(days=7))

    user_doc['_id'] = user_id
    user_doc.pop('password', None)

    return jsonify({
        'success': True,
        'message': 'User created successfully',
        'data': {
            'user': user_doc,
            'access_token': access_token,
            'refresh_token': refresh_token,
        }
    }), 201


@auth_bp.post('/login')
def login():
    data = request.get_json() or {}
    if 'email' not in data or 'password' not in data:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400
    db = mongo_client.get_db()
    user = db.users.find_one({'email': data['email']})
    if not user or user.get('password') != data['password']:
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

    user_id = str(user['_id'])
    access_token = create_access_token(identity=user_id, expires_delta=timedelta(hours=1))
    refresh_token = create_refresh_token(identity=user_id, expires_delta=timedelta(days=7))

    user['_id'] = user_id
    user.pop('password', None)

    return jsonify({
        'success': True,
        'message': 'Login successful',
        'data': {
            'user': user,
            'access_token': access_token,
            'refresh_token': refresh_token,
        }
    }), 200


@auth_bp.get('/me')
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    db = mongo_client.get_db()
    user = db.users.find_one({'_id': to_object_id(current_user_id)})
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    sanitized = serialize_document(user)
    sanitized.pop('password', None)
    return jsonify({'success': True, 'data': sanitized}), 200


@auth_bp.post('/refresh')
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id, expires_delta=timedelta(hours=1))
    return jsonify({'success': True, 'data': {'access_token': new_access_token}}), 200


@auth_bp.get('/verify')
@jwt_required()
def verify():
    return jsonify({'success': True, 'message': 'Token is valid', 'user_id': get_jwt_identity()}), 200


