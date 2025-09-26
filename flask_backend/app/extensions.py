from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask import current_app
from pymongo import MongoClient, ASCENDING


cors = CORS(
    origins=[
        "http://localhost:3000",
        "https://amala-joint.vercel.app",
        "http://localhost:8081",  # React Native dev server
        "http://192.168.43.48:8081",  # Mobile device IP
        "http://192.168.43.48:3000",  # Mobile device IP for web
    ],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    supports_credentials=True,
    automatic_options=True
)
jwt = JWTManager()
mail = Mail()


class MongoClientWrapper:
    def __init__(self):
        self.client: MongoClient | None = None
        self.db = None

    def init_app(self, app):
        uri = app.config['MONGO_URI']
        db_name = app.config['MONGO_DB_NAME']
        # Add SSL configuration for MongoDB Atlas
        self.client = MongoClient(uri, ssl=True, tlsAllowInvalidCertificates=False)
        self.db = self.client[db_name]

    def get_db(self):
        if self.db is None:
            # Late init if needed
            self.init_app(current_app)
        return self.db


mongo_client = MongoClientWrapper()


def init_mongo_indexes():
    db = mongo_client.get_db()
    # Users indexes
    db.users.create_index([('email', ASCENDING)], unique=True, name='idx_users_email_unique')
    
    # Stores indexes
    db.stores.create_index([('name', ASCENDING)], name='idx_stores_name')
    db.stores.create_index([('location', ASCENDING)], name='idx_stores_location')
    db.stores.create_index([('is_verified', ASCENDING)], name='idx_stores_verified')
    db.stores.create_index([('created_at', ASCENDING)], name='idx_stores_created_at')


