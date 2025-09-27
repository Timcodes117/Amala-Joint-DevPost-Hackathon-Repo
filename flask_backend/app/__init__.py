from flask import Flask
from dotenv import load_dotenv

# Load environment variables BEFORE importing anything that uses them
load_dotenv('config.env')

try:
    from .config import Config
    from .extensions import cors, jwt, mongo_client, init_mongo_indexes, mail
    from .routes import register_blueprints
    from .swagger_config import create_swagger_api, create_response_models, create_health_endpoint
    print("✅ Core app modules imported successfully")
except Exception as e:
    print(f"❌ Error importing core modules: {e}")
    import traceback
    traceback.print_exc()
    raise


# Try to import docs_bp separately to isolate issues
try:
    from .routes.docs import docs_bp
    print("✅ Docs blueprint imported successfully")
except Exception as e:
    print(f"⚠️ Could not import docs blueprint: {e}")
    docs_bp = None





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

    # Initialize Swagger API
    try:
        api = create_swagger_api(app)
        models = create_response_models(api)
        api.models = models  # Store models for use in endpoints
        create_health_endpoint(api)
        print("✅ Swagger API initialized successfully")
    except Exception as e:
        print(f"⚠️ Could not initialize Swagger API: {e}")
        api = None

    # Register blueprints centrally
    register_blueprints(app)
    
    # Register docs blueprint separately if available
    if docs_bp:
        app.register_blueprint(docs_bp)
        print("✅ Docs blueprint registered")
    else:
        print("⚠️ Docs blueprint not available")


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
                "docs": "/api/docs",
                "swagger": "/api/docs/swagger.yaml"
            },
        }

    return app


