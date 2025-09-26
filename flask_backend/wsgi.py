print("🚀 Starting app.py import...")

import os
print("✅ os imported")

import sys
print("✅ sys imported")

# Add the current directory to Python path to avoid import issues
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
print("✅ sys.path updated")

# Create a minimal Flask app first to ensure Gunicorn can find it
from flask import Flask
print("✅ Flask imported") 

app = Flask(__name__)
print("✅ Flask app created")

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
print("✅ Config set")

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

print("✅ Routes defined")

# Try to import and initialize the full app
try:
    print("🔄 Attempting to import full app...")
    # Import from the app package (directory)
    from app import create_app as create_full_app
    print("✅ Successfully imported create_app function")
    
    full_app = create_full_app()
    print("✅ Successfully created full app")
    
    # Replace the minimal app with the full app
    app = full_app
    print("✅ Successfully replaced with full app")
    
    print("✅ Full app imported and merged successfully")
    
except Exception as e:
    print(f"❌ CRITICAL: Could not import full app: {e}")
    print("📝 Running in minimal mode - this will cause 404 errors for API routes!")
    import traceback
    traceback.print_exc()
    # Don't continue with minimal app in production
    raise e

print(f"🔍 Final app object: {app}")
print(f"🔍 App type: {type(app)}")
print(f"🔍 App has routes: {len(app.url_map._rules)}")

print("🎉 wsgi.py import completed successfully!")

if __name__ == '__main__':
    # Only run Flask dev server when running locally
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)