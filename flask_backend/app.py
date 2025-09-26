import os
import sys

# Add the current directory to Python path to avoid import issues
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import create_app
    app = create_app()
    print("✅ Flask app created successfully")
except Exception as e:
    print(f"❌ Error creating Flask app: {e}")
    import traceback
    traceback.print_exc()
    # Create a minimal app as fallback
    from flask import Flask
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'fallback-key'
    
    @app.route('/')
    def fallback():
        return {"error": "App initialization failed", "details": str(e)}

# Only initialize LocationService if GOOGLE_API_KEY is available
if app.config.get("GOOGLE_API_KEY"):
    try:
        from services.location import LocationService
        ls = LocationService(app.config["GOOGLE_API_KEY"], 3000)
    except ImportError:
        print("Warning: LocationService not available")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)