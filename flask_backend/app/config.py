import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    MONGO_DB_NAME = os.getenv('DATABASE_NAME', 'amala_app')
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

    # Flask-Mail configuration (fill real creds in environment)
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', '587'))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
    MAIL_USE_SSL = os.getenv('MAIL_USE_SSL', 'false').lower() == 'true'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME'))

    # Frontend base URL for verification links
    FRONTEND_BASE_URL = os.getenv('FRONTEND_BASE_URL', 'https://amala-joint.vercel.app')

    # Optional Google OAuth client ID for audience validation
    GOOGLE_OAUTH_CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID')


