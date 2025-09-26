from flask import Flask
from dotenv import load_dotenv

# Load environment variables BEFORE importing anything that uses them
load_dotenv('config.env')

from .config import Config
from .extensions import cors, jwt, mongo_client, init_mongo_indexes, mail
from .routes import register_blueprints




def create_app(config_class: type[Config] = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    cors.init_app(app) 
    jwt.init_app(app)
    mail.init_app(app)

    # Initialize Mongo connection
    mongo_client.init_app(app)
    with app.app_context():
        init_mongo_indexes()

    # Register blueprints centrally
    register_blueprints(app)

    @app.get("/")
    def root():
        return {
            "message": "Amala App - Flask Backend",
            "status": "running",
            "endpoints": {
                "auth": "/api/auth",
                "users": "/api/users",
                "health": "/api/health",
                "stores": "/api/stores",
                "chatbot": "/api/ai",
            },
        }

    return app


