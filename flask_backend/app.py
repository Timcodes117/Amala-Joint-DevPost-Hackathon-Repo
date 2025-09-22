from app import create_app
from services.location import LocationService

app = create_app()
ls = LocationService(app.config["GOOGLE_API_KEY"], 4000)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
