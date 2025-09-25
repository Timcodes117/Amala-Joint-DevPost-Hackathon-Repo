from flask import Flask
from dotenv import load_dotenv

# Load environment variables BEFORE importing anything that uses them
load_dotenv('config.env')

from .config import Config
from .extensions import cors, jwt, mongo_client, init_mongo_indexes
from .routes.auth import auth_bp
from .routes.users import users_bp
from .routes.health import health_bp
from .routes.ai_chat import ai_chatbot_bp
from .routes.ai_chat import amala_finder_bp
from .routes.ai_chat import planner_bp
from .routes.ai_chat import navigate_bp
from .routes.ai_chat import amala_ai_bp
from .routes.ai_chat import translate_bp




def create_app(config_class: type[Config] = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    cors.init_app(app)
    jwt.init_app(app)

    # Initialize Mongo connection
    mongo_client.init_app(app)
    with app.app_context():
        init_mongo_indexes()

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(health_bp, url_prefix="/api/health")
    app.register_blueprint(ai_chatbot_bp, url_prefix="/api/ai/")
    app.register_blueprint(amala_finder_bp, url_prefix="/api/ai/")
    app.register_blueprint(planner_bp, url_prefix="/api/ai/")
    app.register_blueprint(navigate_bp, url_prefix="/api/ai/")    
    app.register_blueprint(amala_ai_bp, url_prefix="/api/ai")
    app.register_blueprint(translate_bp, url_prefix="/api/translate")

    @app.get("/")
    def root():
        return {
            "message": "Amala App - Flask Backend",
            "status": "running",
            "endpoints": {
                "auth": "/api/auth",
                "users": "/api/users",
                "health": "/api/health",
                "chatbot": "/api/ai",
            },
        }

    return app


