from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask import current_app
from pymongo import MongoClient, ASCENDING


cors = CORS()
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


