from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

# Create blueprint
users_bp = Blueprint('users', __name__, url_prefix='/api/users')

# Initialize User model (will be set in main app)
user_model = None

def init_user_model(db):
    """Initialize user model with database connection"""
    global user_model
    user_model = User(db)

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    """Get all users (admin only - you can add role-based access later)"""
    try:
        users, error = user_model.get_all_users()
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 500
        
        return jsonify({
            'success': True,
            'data': users,
            'count': len(users)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@users_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get a specific user by ID"""
    try:
        current_user_id = get_jwt_identity()
        
        # Users can only view their own profile unless they're admin
        if user_id != current_user_id:
            # For now, allow users to view any profile
            # You can add admin role checking here later
            pass
        
        user = user_model.get_user_by_id(user_id)
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': user
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@users_bp.route('/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """Update a specific user"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Users can only update their own profile
        if user_id != current_user_id:
            return jsonify({
                'success': False,
                'error': 'You can only update your own profile'
            }), 403
        
        # Remove sensitive fields that shouldn't be updated via this endpoint
        data.pop('password', None)
        data.pop('email', None)  # Email changes should be handled separately
        data.pop('_id', None)
        data.pop('created_at', None)
        
        user, error = user_model.update_user(user_id, data)
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'User updated successfully',
            'data': user
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@users_bp.route('/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Delete a specific user (soft delete)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Users can only delete their own account
        if user_id != current_user_id:
            return jsonify({
                'success': False,
                'error': 'You can only delete your own account'
            }), 403
        
        success, error = user_model.delete_user(user_id)
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user's profile"""
    try:
        current_user_id = get_jwt_identity()
        user = user_model.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': user
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user's profile"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Remove sensitive fields
        data.pop('password', None)
        data.pop('email', None)
        data.pop('_id', None)
        data.pop('created_at', None)
        
        user, error = user_model.update_user(current_user_id, data)
        if error:
            return jsonify({
                'success': False,
                'error': error
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'data': user
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
