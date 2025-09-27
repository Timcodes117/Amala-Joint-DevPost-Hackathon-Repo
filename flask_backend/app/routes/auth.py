from flask import Blueprint, request, jsonify, render_template, url_for, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
import bcrypt
from datetime import datetime, timedelta
from ..extensions import mongo_client
from ..utils.mongo import serialize_document, to_object_id
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask_mail import Message
from ..extensions import mail
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials as firebase_credentials


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


def generate_email_token(email: str) -> str:
    s = URLSafeTimedSerializer(secret_key='email-verify-secret')
    return s.dumps(email)


def verify_email_token(token: str, max_age_seconds: int = 3600) -> str | None:
    s = URLSafeTimedSerializer(secret_key='email-verify-secret')
    try:
        return s.loads(token, max_age=max_age_seconds)
    except (BadSignature, SignatureExpired):
        return None


@auth_bp.route('/signup', methods=['OPTIONS'])
def signup_options():
    """Handle CORS preflight requests for signup endpoint"""
    return '', 200

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
        'password': bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        'phone': data.get('phone'),
        'age': data.get('age'),
        'created_at': now,
        'updated_at': now,
        'is_active': True,
        'email_verified': False
    }
    result = db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    access_token = create_access_token(identity=user_id, expires_delta=timedelta(hours=1))
    refresh_token = create_refresh_token(identity=user_id, expires_delta=timedelta(days=7))

    user_doc['_id'] = user_id
    user_doc.pop('password', None)

    # Send verification email
    mail_sent = False
    try:
        token = generate_email_token(user_doc['email'])
        frontend_base = current_app.config.get('FRONTEND_BASE_URL', 'https://amala-joint.vercel.app').rstrip('/')
        verify_url = f"{frontend_base}/auth/verify-user/{token}"
        msg = Message(subject='Verify your Amala account')
        msg.recipients = [user_doc['email']]
        msg.body = f"Please verify your account by visiting: {verify_url}"
        # If you add a template, you can use html instead
        # msg.html = render_template('email/verify.html', verify_url=verify_url, name=user_doc['name'])
        mail.send(msg)
        mail_sent = True
    except Exception as e:
        current_app.logger.exception('Mail send failed')

    return jsonify({
        'success': True,
        'message': 'User created successfully. Verification email sent if mail is configured.',
        'data': {
            'user': user_doc,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'mail_sent': mail_sent,
        }
    }), 201


@auth_bp.route('/login', methods=['OPTIONS'])
def login_options():
    """Handle CORS preflight requests for login endpoint"""
    return '', 200

@auth_bp.post('/login')
def login():
    data = request.get_json() or {}
    if 'email' not in data or 'password' not in data:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400
    db = mongo_client.get_db()
    user = db.users.find_one({'email': data['email']})
    # Ensure password is present and hashed, then verify using bcrypt
    if not user or not user.get('password') or not bcrypt.checkpw(data['password'].encode('utf-8'), str(user.get('password')).encode('utf-8')):
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


@auth_bp.get('/verify-email/<token>')
def verify_email(token: str):
    db = mongo_client.get_db()
    email = verify_email_token(token)
    if not email:
        return jsonify({'success': False, 'error': 'Invalid or expired verification token'}), 400

    user = db.users.find_one({'email': email})
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    if user.get('email_verified'):
        return jsonify({'success': True, 'message': 'Email already verified'}), 200

    db.users.update_one({'_id': user['_id']}, {'$set': {'email_verified': True, 'updated_at': datetime.utcnow().isoformat()}})
    return jsonify({'success': True, 'message': 'Email verified successfully'}), 200


@auth_bp.post('/resend-verification')
def resend_verification():
    data = request.get_json() or {}
    email = data.get('email')
    
    if not email:
        return jsonify({'success': False, 'error': 'Email is required'}), 400
    
    db = mongo_client.get_db()
    user = db.users.find_one({'email': email})
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    if user.get('email_verified'):
        return jsonify({'success': False, 'error': 'Email already verified'}), 400
    
    # Send verification email
    mail_sent = False
    try:
        token = generate_email_token(user['email'])
        frontend_base = current_app.config.get('FRONTEND_BASE_URL', 'https://amala-joint.vercel.app').rstrip('/')
        verify_url = f"{frontend_base}/auth/verify-user/{token}"
        msg = Message(subject='Verify your Amala account')
        msg.recipients = [user['email']]
        msg.body = f"Please verify your account by visiting: {verify_url}"
        mail.send(msg)
        mail_sent = True
    except Exception as e:
        current_app.logger.exception('Mail send failed')
        return jsonify({'success': False, 'error': 'Failed to send verification email'}), 500
    
    return jsonify({
        'success': True, 
        'message': 'Verification email sent successfully',
        'mail_sent': mail_sent
    }), 200


@auth_bp.route('/google', methods=['OPTIONS'])
def google_login_options():
    """Handle CORS preflight requests for Google login endpoint"""
    return '', 200

@auth_bp.post('/google')
def google_login():
    data = request.get_json() or {}
    id_token = data.get('idToken') or data.get('id_token')
    if not id_token:
        return jsonify({'success': False, 'error': 'idToken is required'}), 400

    try:
        # Initialize Firebase Admin app lazily
        if not firebase_admin._apps:
            # Try to get service account from environment variable
            import os
            import json
            
            service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')
            if service_account_json:
                try:
                    service_account_info = json.loads(service_account_json)
                    cred = firebase_credentials.Certificate(service_account_info)
                except (json.JSONDecodeError, ValueError) as e:
                    current_app.logger.error(f'Invalid FIREBASE_SERVICE_ACCOUNT_JSON: {e}')
                    raise Exception('Invalid Firebase service account configuration')
            else:
                # Fall back to Application Default Credentials
                try:
                    cred = firebase_credentials.ApplicationDefault()
                except Exception as e:
                    current_app.logger.error(f'Failed to initialize Firebase credentials: {e}')
                    raise Exception('Firebase credentials not configured properly')
            
            firebase_admin.initialize_app(cred)

        payload = firebase_auth.verify_id_token(id_token)

        sub = payload.get('uid') or payload.get('sub')
        email = payload.get('email')
        email_verified = payload.get('email_verified', False)
        name = payload.get('name') or payload.get('given_name')
        picture = payload.get('picture')

        if not sub or not email:
            return jsonify({'success': False, 'error': 'Invalid Google token payload'}), 400

        db = mongo_client.get_db()
        user = db.users.find_one({'email': email})
        now = datetime.utcnow().isoformat()
        if not user:
            user_doc = {
                'name': name or email.split('@')[0],
                'email': email,
                'password': None,
                'google_uid': sub,
                'photo_url': picture,
                'provider': 'google',
                'created_at': now,
                'updated_at': now,
                'is_active': True,
                'email_verified': True if email_verified else True
            }
            result = db.users.insert_one(user_doc)
            user = user_doc
            user['_id'] = result.inserted_id
        else:
            update = {
                'google_uid': sub,
                'photo_url': picture or user.get('photo_url'),
                'provider': 'google',
                'email_verified': True if email_verified else True,
                'updated_at': now,
            }
            db.users.update_one({'_id': user['_id']}, {'$set': update})
            user.update(update)

        user_id = str(user['_id'])
        access_token = create_access_token(identity=user_id, expires_delta=timedelta(hours=1))
        refresh_token = create_refresh_token(identity=user_id, expires_delta=timedelta(days=7))

        safe_user = dict(user)
        safe_user['_id'] = user_id
        safe_user.pop('password', None)

        return jsonify({
            'success': True,
            'data': {
                'user': safe_user,
                'access_token': access_token,
                'refresh_token': refresh_token,
            }
        }), 200
    except firebase_auth.InvalidIdTokenError as e:
        return jsonify({'success': False, 'error': f'Invalid Firebase token: {str(e)}'}), 400
    except firebase_auth.ExpiredIdTokenError as e:
        return jsonify({'success': False, 'error': f'Expired Firebase token: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': f'Google auth failed: {str(e)}'}), 500


@auth_bp.get('/debug/mail-config')
# @jwt_required()
def debug_mail_config():
    cfg = current_app.config
    safe = {
        'MAIL_SERVER': cfg.get('MAIL_SERVER'),
        'MAIL_PORT': cfg.get('MAIL_PORT'),
        'MAIL_USE_TLS': cfg.get('MAIL_USE_TLS'),
        'MAIL_USE_SSL': cfg.get('MAIL_USE_SSL'),
        'MAIL_SUPPRESS_SEND': cfg.get('MAIL_SUPPRESS_SEND'),
        'MAIL_DEFAULT_SENDER': cfg.get('MAIL_DEFAULT_SENDER'),
        'MAIL_USERNAME_set': bool(cfg.get('MAIL_USERNAME')),
        'FRONTEND_BASE_URL': cfg.get('FRONTEND_BASE_URL'),
    }
    return jsonify({'success': True, 'data': safe}), 200


