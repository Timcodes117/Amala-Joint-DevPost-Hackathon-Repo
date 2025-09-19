import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    MONGO_DB_NAME = os.getenv('DATABASE_NAME', 'amala_app')
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')


