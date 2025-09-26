from app import create_app
import os

app = create_app()

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