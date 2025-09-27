from flask_restx import Api, Resource, fields
from flask import Flask, jsonify
import yaml
import os

def create_swagger_api(app: Flask) -> Api:
    """Create and configure Flask-RESTX API with Swagger documentation"""
    
    # Configure API with Swagger UI
    api = Api(
        app,
        version='1.0.0',
        title='Amala Joint - AI-Powered Restaurant Discovery API',
        description='''
        An intelligent Flask backend that uses Google Cloud AI tools and agentic workflows 
        to help users discover the best Amala (Nigerian cuisine) restaurants. Built with 
        Google Maps API, Gemini AI, and Google ADK for seamless restaurant recommendations and navigation.
        
        ## Features
        - 🔍 AI-powered restaurant discovery
        - 🗺️ Google Maps integration
        - 🔐 JWT authentication
        - 📱 Mobile-friendly API
        - 🌍 Multi-language support (English/Yoruba)
        - 📸 Photo verification system
        ''',
        contact='Amala Joint Team',
        contact_url='https://amala-joint.vercel.app',
        license='MIT',
        license_url='https://opensource.org/licenses/MIT',
        doc='/api/docs/',  # Swagger UI endpoint
        prefix='/api'
    )
    
    return api

def load_swagger_yaml():
    """Load the swagger.yaml file and return its content"""
    try:
        yaml_path = os.path.join(os.path.dirname(__file__), 'swagger.yaml')
        with open(yaml_path, 'r', encoding='utf-8') as file:
            return yaml.safe_load(file)
    except FileNotFoundError:
        print("Warning: swagger.yaml not found")
        return None
    except yaml.YAMLError as e:
        print(f"Error parsing swagger.yaml: {e}")
        return None

# Define common response models
def create_response_models(api):
    """Create common response models for the API"""
    
    # Error model
    error_model = api.model('Error', {
        'error': fields.String(required=True, description='Error type'),
        'message': fields.String(required=True, description='Error message'),
        'details': fields.Raw(description='Additional error details')
    })
    
    # Success model
    success_model = api.model('Success', {
        'success': fields.Boolean(required=True, description='Operation success status'),
        'message': fields.String(description='Success message'),
        'data': fields.Raw(description='Response data')
    })
    
    # User model
    user_model = api.model('User', {
        'id': fields.String(description='User ID'),
        'email': fields.String(required=True, description='User email'),
        'name': fields.String(required=True, description='User name'),
        'created_at': fields.DateTime(description='Account creation date'),
        'is_verified': fields.Boolean(description='Email verification status')
    })
    
    # Restaurant model
    restaurant_model = api.model('Restaurant', {
        'id': fields.String(description='Restaurant ID'),
        'name': fields.String(required=True, description='Restaurant name'),
        'address': fields.String(required=True, description='Restaurant address'),
        'latitude': fields.Float(description='Latitude coordinate'),
        'longitude': fields.Float(description='Longitude coordinate'),
        'description': fields.String(description='Restaurant description'),
        'phone': fields.String(description='Contact phone number'),
        'opening_hours': fields.String(description='Business hours'),
        'cuisine_type': fields.String(description='Type of cuisine'),
        'price_range': fields.String(enum=['low', 'moderate', 'high'], description='Price range'),
        'rating': fields.Float(min=1, max=5, description='Average rating'),
        'is_verified': fields.Boolean(description='Verification status'),
        'image_url': fields.String(description='Restaurant image URL'),
        'created_at': fields.DateTime(description='Creation date')
    })
    
    return {
        'error': error_model,
        'success': success_model,
        'user': user_model,
        'restaurant': restaurant_model
    }

# Create a simple health check endpoint
def create_health_endpoint(api):
    """Create a health check endpoint"""
    
    @api.route('/health')
    class HealthCheck(Resource):
        @api.doc('health_check')
        @api.marshal_with(api.models['success'])
        def get(self):
            """Health check endpoint"""
            return {
                'success': True,
                'message': 'API is healthy',
                'data': {
                    'status': 'healthy',
                    'service': 'flask-backend',
                    'version': '1.0.0'
                }
            }

# Export functions for use in main app
__all__ = ['create_swagger_api', 'load_swagger_yaml', 'create_response_models', 'create_health_endpoint']
