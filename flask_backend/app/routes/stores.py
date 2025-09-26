from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import mongo_client
from ..utils.mongo import serialize_document, to_object_id
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename
try:
    from services.agent import ai_agent
    AI_AGENT_AVAILABLE = True
except (ImportError, Exception) as e:
    print(f"Warning: Could not import ai_agent: {e}")
    ai_agent = None
    AI_AGENT_AVAILABLE = False
from services.cloudinary_service import get_cloudinary_service

stores_bp = Blueprint('stores', __name__)

# Cloudinary configuration is handled in the service

@stores_bp.route('/add', methods=['OPTIONS'])
def add_store_options():
    """Handle CORS preflight requests for add store endpoint"""
    return '', 200

@stores_bp.post('/add')
@jwt_required()
def add_store():
    """Add a new unverified store to the database"""
    try:
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json() or {}
        else:
            data = request.form.to_dict()
        
        # Validate required fields
        required_fields = ['name', 'phone', 'location', 'opensAt', 'closesAt', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'{field} is required'}), 400
        
        db = mongo_client.get_db()
        
        # Handle file upload if present
        image_url = None
        upload_result = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                try:
                    # Upload to Cloudinary
                    cloudinary_service = get_cloudinary_service()
                    upload_result = cloudinary_service.upload_image(file, folder="amala_stores")
                    
                    if upload_result['success']:
                        image_url = upload_result['url']
                    else:
                        return jsonify({'success': False, 'error': f"Image upload failed: {upload_result['error']}"}), 500
                except Exception as e:
                    return jsonify({'success': False, 'error': f"Image upload error: {str(e)}"}), 500
        
        # Get current user from JWT
        current_user = get_jwt_identity()
        
        # Get user email from database
        user = db.users.find_one({'_id': to_object_id(current_user)})
        user_email = user.get('email') if user else None
        
        # Generate a unique place_id for amala-joint stores
        import uuid
        place_id = f"amala_{uuid.uuid4().hex[:12]}"
        
        # Create store document
        store_doc = {
            'place_id': place_id,  # Use place_id like Google Places
            'name': data['name'],
            'phone': data['phone'],
            'location': data['location'],
            'latitude': float(data.get('latitude')) if data.get('latitude') else None,
            'longitude': float(data.get('longitude')) if data.get('longitude') else None,
            'opensAt': data['opensAt'],
            'closesAt': data['closesAt'],
            'description': data['description'],
            'imageUrl': image_url or data.get('imageUrl'),  # Use uploaded file or provided URL
            'cloudinary_public_id': upload_result.get('public_id') if upload_result and upload_result.get('success') else None,
            'verifiedBy': 'amala-joint',  # Default verification source
            'is_verified': False,  # Initially unverified
            'verify_count': 0,  # No verifications yet
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'created_by': current_user,  # User ID from JWT
            'created_by_email': user_email,  # User email for contact
            'verification_requests': []  # Store verification attempts
        }
        
        # Insert store
        result = db.stores.insert_one(store_doc)
        store_id = str(result.inserted_id)
        
        return jsonify({
            'success': True, 
            'data': {'store_id': store_id, 'message': 'Store added successfully and pending verification'},
            'store': serialize_document({**store_doc, '_id': result.inserted_id})
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@stores_bp.get('/unverified')
@jwt_required()
def get_unverified_stores():
    """Get all unverified stores for verification"""
    try:
        db = mongo_client.get_db()
        
        # Get unverified stores
        stores = list(db.stores.find({'is_verified': False}).sort('created_at', -1))
        
        # Serialize and return
        serialized_stores = [serialize_document(store) for store in stores]
        
        return jsonify({
            'success': True,
            'data': serialized_stores,
            'count': len(serialized_stores)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@stores_bp.get('/verified')
@jwt_required()
def get_verified_stores():
    """Get all verified stores for public listing"""
    try:
        db = mongo_client.get_db()
        
        # Get verified stores
        stores = list(db.stores.find({'is_verified': True}).sort('created_at', -1))
        
        # Serialize and return
        serialized_stores = [serialize_document(store) for store in stores]
        
        return jsonify({
            'success': True,
            'data': serialized_stores,
            'count': len(serialized_stores)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@stores_bp.get('/<store_id>')
@jwt_required()
def get_store(store_id):
    """Get a specific store by ID or place_id"""
    try:
        db = mongo_client.get_db()
        
        # Try to find by place_id first (for amala-joint stores)
        store = db.stores.find_one({'place_id': store_id})
        
        # If not found by place_id, try by _id (for backward compatibility)
        if not store:
            store = db.stores.find_one({'_id': to_object_id(store_id)})
        
        if not store:
            return jsonify({'success': False, 'error': 'Store not found'}), 404
        
        return jsonify({
            'success': True,
            'data': serialize_document(store)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@stores_bp.route('/<store_id>/verify', methods=['OPTIONS'])
def verify_store_options(store_id):
    """Handle CORS preflight requests for verify store endpoint"""
    return '', 200

@stores_bp.post('/<store_id>/verify')
@jwt_required()
def verify_store(store_id):
    """Verify a store using AI agent"""
    try:
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json() or {}
        else:
            data = request.form.to_dict()
        
        # Validate required fields
        if not data.get('reason'):
            return jsonify({'success': False, 'error': 'Reason is required'}), 400
        
        if not data.get('proofUrl'):
            return jsonify({'success': False, 'error': 'Proof URL is required'}), 400
        
        db = mongo_client.get_db()
        
        # Get the store
        store = db.stores.find_one({'_id': to_object_id(store_id)})
        if not store:
            return jsonify({'success': False, 'error': 'Store not found'}), 404
        
        # Handle file upload if present
        image_url = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename:
                try:
                    # Upload to Cloudinary
                    cloudinary_service = get_cloudinary_service()
                    upload_result = cloudinary_service.upload_image(file, folder="amala_verification")
                    
                    if upload_result['success']:
                        image_url = upload_result['url']
                    else:
                        return jsonify({'success': False, 'error': f"Image upload failed: {upload_result['error']}"}), 500
                except Exception as e:
                    return jsonify({'success': False, 'error': f"Image upload error: {str(e)}"}), 500
        
        # Get current user from JWT
        current_user = get_jwt_identity()
        
        # Create verification request
        verification_request = {
            'reason': data['reason'],
            'proofUrl': data['proofUrl'],
            'imageUrl': image_url or data.get('imageUrl'),  # Use uploaded file or provided URL
            'cloudinary_public_id': upload_result.get('public_id') if upload_result and upload_result.get('success') else None,
            'submitted_at': datetime.utcnow(),
            'submitted_by': current_user,  # User ID from JWT
            'status': 'pending'  # pending, approved, rejected
        }
        
        # Create prompt for AI evaluation
        evaluation_prompt = f"""
        Evaluate this store verification request:
        
        Store: {store['name']}
        Location: {store['location']}
        Description: {store['description']}
        
        Verification Reason: {data['reason']}
        Proof URL: {data['proofUrl']}
        
        Please evaluate if this store should be verified based on:
        1. Legitimacy of the business
        2. Quality of the proof provided
        3. Reasonableness of the verification reason
        
        Respond with either 'APPROVE' or 'REJECT' followed by a brief explanation.
        """
        
        # Get AI evaluation
        if AI_AGENT_AVAILABLE and ai_agent:
            try:
                ai_response = ai_agent(evaluation_prompt)
            except Exception as e:
                print(f"Error calling AI agent: {e}")
                ai_response = "APPROVE - AI agent error, auto-approved"
        else:
            # Fallback: auto-approve if AI agent is not available
            ai_response = "APPROVE - AI agent not available, auto-approved"
        
        # Parse AI response
        is_approved = 'APPROVE' in ai_response.upper()
        verification_request['ai_evaluation'] = ai_response
        verification_request['status'] = 'approved' if is_approved else 'rejected'
        
        # Update store with verification request
        db.stores.update_one(
            {'_id': to_object_id(store_id)},
            {
                '$push': {'verification_requests': verification_request},
                '$inc': {'verify_count': 1},
                '$set': {'updated_at': datetime.utcnow()}
            }
        )
        
        # If approved, check if store should be verified (3+ approvals)
        if is_approved:
            updated_store = db.stores.find_one({'_id': to_object_id(store_id)})
            approved_count = sum(1 for req in updated_store.get('verification_requests', []) 
                               if req.get('status') == 'approved')
            
            if approved_count >= 3:
                # Mark store as verified
                db.stores.update_one(
                    {'_id': to_object_id(store_id)},
                    {'$set': {'is_verified': True, 'verified_at': datetime.utcnow()}}
                )
        
        return jsonify({
            'success': True,
            'data': {
                'verification_status': verification_request['status'],
                'ai_evaluation': ai_response,
                'message': 'Verification request processed successfully'
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@stores_bp.get('/user/<user_email>')
@jwt_required()
def get_user_stores(user_email):
    """Get all stores created by a specific user"""
    try:
        db = mongo_client.get_db()
        
        # Get stores created by the user
        stores = list(db.stores.find({'created_by_email': user_email}).sort('created_at', -1))
        
        # Serialize and return
        serialized_stores = [serialize_document(store) for store in stores]
        
        return jsonify({
            'success': True,
            'data': serialized_stores,
            'count': len(serialized_stores)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@stores_bp.get('/stats')
@jwt_required()
def get_store_stats():
    """Get store statistics"""
    try:
        db = mongo_client.get_db()
        
        total_stores = db.stores.count_documents({})
        verified_stores = db.stores.count_documents({'is_verified': True})
        unverified_stores = db.stores.count_documents({'is_verified': False})
        
        return jsonify({
            'success': True,
            'data': {
                'total_stores': total_stores,
                'verified_stores': verified_stores,
                'unverified_stores': unverified_stores,
                'verification_rate': round((verified_stores / total_stores * 100) if total_stores > 0 else 0, 2)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@stores_bp.route('/upload-image', methods=['OPTIONS'])
def upload_image_options():
    """Handle CORS preflight requests for upload image endpoint"""
    return '', 200

@stores_bp.post('/upload-image')
@jwt_required()
def upload_image():
    """Dedicated endpoint for image uploads to Cloudinary"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if not file or not file.filename:
            return jsonify({'success': False, 'error': 'No image file selected'}), 400
        
        # Get folder from request (optional)
        folder = request.form.get('folder', 'amala_uploads')
        
        # Upload to Cloudinary
        cloudinary_service = get_cloudinary_service()
        upload_result = cloudinary_service.upload_image(file, folder=folder)
        
        if upload_result['success']:
            return jsonify({
                'success': True,
                'data': {
                    'url': upload_result['url'],
                    'public_id': upload_result['public_id'],
                    'format': upload_result['format'],
                    'width': upload_result['width'],
                    'height': upload_result['height'],
                    'bytes': upload_result['bytes']
                }
            }), 200
        else:
            return jsonify({'success': False, 'error': upload_result['error']}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@stores_bp.route('/image/<public_id>', methods=['OPTIONS'])
def delete_image_options(public_id):
    """Handle CORS preflight requests for delete image endpoint"""
    return '', 200

@stores_bp.delete('/image/<public_id>')
@jwt_required()
def delete_image(public_id):
    """Delete an image from Cloudinary"""
    try:
        cloudinary_service = get_cloudinary_service()
        delete_result = cloudinary_service.delete_image(public_id)
        
        if delete_result['success']:
            return jsonify({
                'success': True,
                'data': {'message': 'Image deleted successfully'}
            }), 200
        else:
            return jsonify({'success': False, 'error': delete_result.get('error', 'Failed to delete image')}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@stores_bp.get('/image/<public_id>/info')
@jwt_required()
def get_image_info(public_id):
    """Get information about an image"""
    try:
        cloudinary_service = get_cloudinary_service()
        info_result = cloudinary_service.get_image_info(public_id)
        
        if info_result['success']:
            return jsonify({
                'success': True,
                'data': info_result
            }), 200
        else:
            return jsonify({'success': False, 'error': info_result['error']}), 404
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
