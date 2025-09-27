from flask import Blueprint, jsonify, request, current_app
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="../config.env")

# Create blueprint for Google Places API proxy
places_bp = Blueprint('places', __name__)

def get_google_api_key() -> str | None:
    """Get Google API key from environment or app config"""
    try:
        return current_app.config.get("GOOGLE_API_KEY")
    except Exception:
        return os.getenv("GOOGLE_API_KEY")

@places_bp.route('/autocomplete', methods=['OPTIONS'])
def autocomplete_options():
    """Handle CORS preflight requests for autocomplete endpoint"""
    return '', 200

@places_bp.route('/autocomplete', methods=['POST'])
def autocomplete():
    """Proxy endpoint for Google Places Autocomplete API"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        input_text = data.get('input')
        if not input_text:
            return jsonify({"error": "Input text is required"}), 400

        # Get Google API key
        api_key = get_google_api_key()
        if not api_key:
            return jsonify({"error": "Google API key not configured"}), 503

        # Build Google Places Autocomplete API URL
        url = f"https://maps.googleapis.com/maps/api/place/autocomplete/json"
        params = {
            'input': input_text,
            'types': 'establishment|geocode',
            'components': 'country:ng',
            'key': api_key
        }

        # Make request to Google Places API
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        google_data = response.json()
        
        # Return the Google API response directly
        return jsonify(google_data)

    except requests.RequestException as e:
        return jsonify({"error": f"Failed to reach Google Places API: {str(e)}"}), 503
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@places_bp.route('/details', methods=['OPTIONS'])
def details_options():
    """Handle CORS preflight requests for details endpoint"""
    return '', 200

@places_bp.route('/details', methods=['POST'])
def details():
    """Proxy endpoint for Google Places Details API"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        place_id = data.get('place_id')
        if not place_id:
            return jsonify({"error": "Place ID is required"}), 400

        # Get Google API key
        api_key = get_google_api_key()
        if not api_key:
            return jsonify({"error": "Google API key not configured"}), 503

        # Build Google Places Details API URL
        url = f"https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            'place_id': place_id,
            'fields': 'geometry,formatted_address',
            'key': api_key
        }

        # Make request to Google Places API
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        google_data = response.json()
        
        # Return the Google API response directly
        return jsonify(google_data)

    except requests.RequestException as e:
        return jsonify({"error": f"Failed to reach Google Places API: {str(e)}"}), 503
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@places_bp.route('/geocode', methods=['OPTIONS'])
def geocode_options():
    """Handle CORS preflight requests for geocode endpoint"""
    return '', 200

@places_bp.route('/geocode', methods=['POST'])
def geocode():
    """Proxy endpoint for Google Geocoding API"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        lat = data.get('lat')
        lng = data.get('lng')
        if lat is None or lng is None:
            return jsonify({"error": "Latitude and longitude are required"}), 400

        # Get Google API key
        api_key = get_google_api_key()
        if not api_key:
            return jsonify({"error": "Google API key not configured"}), 503

        # Build Google Geocoding API URL
        url = f"https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            'latlng': f"{lat},{lng}",
            'key': api_key
        }

        # Make request to Google Geocoding API
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        google_data = response.json()
        
        # Return the Google API response directly
        return jsonify(google_data)

    except requests.RequestException as e:
        return jsonify({"error": f"Failed to reach Google Geocoding API: {str(e)}"}), 503
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
