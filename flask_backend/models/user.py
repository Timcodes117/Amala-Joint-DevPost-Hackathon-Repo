from datetime import datetime
from bson import ObjectId
from utils.auth_utils import hash_password, verify_password

class User:
    def __init__(self, db):
        self.collection = db.users
    
    def create_user(self, user_data):
        """Create a new user"""
        # Check if user already exists
        existing_user = self.collection.find_one({'email': user_data['email']})
        if existing_user:
            return None, 'User with this email already exists'
        
        # Hash the password
        hashed_password = hash_password(user_data['password'])
        
        # Create user document
        user_doc = {
            'name': user_data['name'],
            'email': user_data['email'],
            'password': hashed_password,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'is_active': True
        }
        
        # Add optional fields
        if 'phone' in user_data:
            user_doc['phone'] = user_data['phone']
        if 'age' in user_data:
            user_doc['age'] = user_data['age']
        
        try:
            result = self.collection.insert_one(user_doc)
            user_doc['_id'] = str(result.inserted_id)
            # Remove password from response
            user_doc.pop('password', None)
            return user_doc, None
        except Exception as e:
            return None, str(e)
    
    def get_user_by_email(self, email):
        """Get user by email"""
        try:
            user = self.collection.find_one({'email': email})
            if user:
                user['_id'] = str(user['_id'])
            return user
        except Exception as e:
            return None
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            user = self.collection.find_one({'_id': ObjectId(user_id)})
            if user:
                user['_id'] = str(user['_id'])
                # Remove password from response
                user.pop('password', None)
            return user
        except Exception as e:
            return None
    
    def verify_user_password(self, email, password):
        """Verify user password"""
        user = self.get_user_by_email(email)
        if not user:
            return None, 'User not found'
        
        if not verify_password(password, user['password']):
            return None, 'Invalid password'
        
        # Remove password from response
        user.pop('password', None)
        return user, None
    
    def update_user(self, user_id, update_data):
        """Update user information"""
        try:
            # Remove password from update data if present
            update_data.pop('password', None)
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_data}
            )
            
            if result.modified_count > 0:
                return self.get_user_by_id(user_id), None
            else:
                return None, 'No changes made'
        except Exception as e:
            return None, str(e)
    
    def delete_user(self, user_id):
        """Delete user (soft delete)"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'is_active': False, 'updated_at': datetime.utcnow().isoformat()}}
            )
            
            if result.modified_count > 0:
                return True, None
            else:
                return False, 'User not found'
        except Exception as e:
            return False, str(e)
    
    def get_all_users(self):
        """Get all active users"""
        try:
            users = list(self.collection.find({'is_active': True}, {'password': 0}))
            for user in users:
                user['_id'] = str(user['_id'])
            return users, None
        except Exception as e:
            return None, str(e)
