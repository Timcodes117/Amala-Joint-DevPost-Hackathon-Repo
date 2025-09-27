# Centralized blueprint registration
from flask import Flask

from .auth import auth_bp
from .users import users_bp
from .health import health_bp
from .stores import stores_bp
from .places import places_bp
from .swagger import swagger_bp
from .ai_chat import (
    ai_chatbot_bp,
    amala_finder_bp,
    planner_bp,
    navigate_bp,
    amala_ai_bp,
)


def register_blueprints(app: Flask) -> None:
    """Register all app blueprints with their URL prefixes.

    Keeping registration in one place helps keep routes organized and avoids
    duplicate or conflicting prefixes.
    """
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(health_bp, url_prefix="/api/health")
    app.register_blueprint(stores_bp, url_prefix="/api/stores")
    app.register_blueprint(places_bp, url_prefix="/api/places")
    app.register_blueprint(swagger_bp)  # No prefix for Swagger routes

    # AI related
    app.register_blueprint(ai_chatbot_bp, url_prefix="/api/ai")
    app.register_blueprint(amala_finder_bp, url_prefix="/api/ai")
    app.register_blueprint(planner_bp, url_prefix="/api/ai")
    app.register_blueprint(navigate_bp, url_prefix="/api/ai")
    app.register_blueprint(amala_ai_bp, url_prefix="/api/ai")

