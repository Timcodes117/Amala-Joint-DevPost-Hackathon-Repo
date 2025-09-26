import os
import sys

# Add the current directory to Python path to avoid import issues
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Create a minimal Flask app first to ensure Gunicorn can find it
from flask import Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

@app.route('/')
def health_check():
    return {
        "message": "Amala App - Flask Backend",
        "status": "running",
        "version": "1.0.0"
    }

@app.route('/api/health')
def api_health():
    return {"status": "healthy", "service": "flask-backend"}

# Try to import and initialize the full app
try:
    print("🔄 Attempting to import full app...")
    # Import from the app package (directory)
    from app import create_app as create_full_app
    print("✅ Successfully imported create_app function")
    
    full_app = create_full_app()
    print("✅ Successfully created full app")
    
    # Merge the full app's routes and configuration
    app.config.update(full_app.config)
    print("✅ Successfully updated config")
    
    # Register blueprints from the full app
    for blueprint in full_app.blueprints.values():
        app.register_blueprint(blueprint)
    print("✅ Successfully registered blueprints")
    
    print("✅ Full app imported and merged successfully")
    
except Exception as e:
    print(f"⚠️ Could not import full app: {e}")
    print("📝 Running in minimal mode")
    import traceback
    traceback.print_exc()

print(f"🔍 Final app object: {app}")
print(f"🔍 App type: {type(app)}")
print(f"🔍 App has routes: {len(app.url_map._rules)}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)