from flask import Flask
from dotenv import load_dotenv

# Load environment variables BEFORE importing anything that uses them
load_dotenv('config.env')

try:
    from .config import Config
    from .extensions import cors, jwt, mongo_client, init_mongo_indexes, mail
    from .routes import register_blueprints
    print("✅ Core app modules imported successfully")
except Exception as e:
    print(f"❌ Error importing core modules: {e}")
    import traceback
    traceback.print_exc()
    raise

# Try to import translate_bp separately to isolate issues
try:
    from .routes.ai_chat import translate_bp
    print("✅ Translate blueprint imported successfully")
except Exception as e:
    print(f"⚠️ Could not import translate blueprint: {e}")
    translate_bp = None





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
    
    # Register translate blueprint separately if available
    if translate_bp:
        app.register_blueprint(translate_bp, url_prefix="/api/translate")
        print("✅ Translate blueprint registered")
    else:
        print("⚠️ Translate blueprint not available")


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


