import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://timcodes_db:JsU6n3PLFfFLmTwY@amalacluster.otvkknh.mongodb.net/?retryWrites=true&w=majority&appName=amalaCluster')
    MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'amala')


