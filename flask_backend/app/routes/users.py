from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from ..extensions import mongo_client
from ..utils.mongo import serialize_document
from services.location import LocationService
from flask import current_app



users_bp = Blueprint('users', __name__)

# @users_bp.get('/')
# @jwt_required()
# def list_users():
#     db = mongo_client.get_db()
#     users = []
#     for doc in db.users.find({}):
#         doc.pop('password', None)
#         users.append(serialize_document(doc))
#     return jsonify({'success': True, 'data': users}), 200

@users_bp.post('/get_current_address')
def get_address():
    print("=== GET CURRENT ADDRESS ENDPOINT CALLED ===")
    data = request.get_json() or {}
    print("Request data:", data)
    try:
        latitude = float(data.get("latitude")) if data.get("latitude") is not None else None
        longitude = float(data.get("longitude")) if data.get("longitude") is not None else None
    except (TypeError, ValueError):
        return jsonify({"error": "Latitude and longitude must be numbers"}), 400

    if latitude is None or longitude is None:
        provided = list(data.keys()) if isinstance(data, dict) else []
        return jsonify({
            "error": "Latitude and longitude are required",
            "provided_keys": provided
        }), 400

    # Initialize LocationService with Google API token and radius
    location_service = LocationService(
        token=current_app.config['GOOGLE_API_KEY'],
        radius=5000  # 5km radius
    )
    address = location_service.get_current_address(str(latitude), str(longitude))
    
    # Check if the API call was successful
    if address.get('status') == 'OK':
        return jsonify({'success': True, 'data': address}), 200
    else:
        return jsonify({
            'success': False, 
            'error': address.get('error_message', 'Failed to get address'),
            'data': address
        }), 400


# @jwt_required()
# def get_address():
#     data = LocationService.get_current_address()
#     return jsonify({'success': True, 'data': []}), 200


@users_bp.post('/get_places_nearby/<latitude>/<longitude>')
def get_places_nearby(latitude, longitude):
    print("=== GET PLACES NEARBY ENDPOINT CALLED ===")
    print("Coordinates:", latitude, longitude)
    latitude = float(latitude)
    longitude = float(longitude)
    
    # Initialize LocationService with Google API token and radius
    location_service = LocationService(
        token=current_app.config['GOOGLE_API_KEY'],
        radius=5000  # 5km radius
    )
    places = location_service.get_nearby_places(str(latitude), str(longitude))
    if places:
        places = places.get("results")
    else:
        places = []
    return jsonify({'success': True, 'data': places}), 200

@users_bp.post('/search_addresses')
def search_addresses():
    """Search for addresses using Google Places API"""
    print("=== SEARCH ADDRESSES ENDPOINT CALLED ===")
    data = request.get_json() or {}
    query = data.get('query', '').strip()
    
    if not query or len(query) < 3:
        return jsonify({'success': True, 'data': []}), 200
    
    try:
        # Initialize LocationService
        location_service = LocationService(
            token=current_app.config['GOOGLE_API_KEY'],
            radius=50000  # 50km radius for broader search
        )
        
        # Search for places using the query
        places = location_service.search_places(query)
        
        if places and places.get("results"):
            # Filter and format the results
            formatted_places = []
            for place in places["results"]:
                if place.get("formatted_address") or place.get("name"):
                    formatted_places.append({
                        "place_id": place.get("place_id"),
                        "name": place.get("name"),
                        "formatted_address": place.get("formatted_address"),
                        "geometry": place.get("geometry"),
                        "types": place.get("types", [])
                    })
            
            return jsonify({'success': True, 'data': formatted_places}), 200
        else:
            return jsonify({'success': True, 'data': []}), 200
            
    except Exception as e:
        print(f"Error searching addresses: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500



@users_bp.post('/get_place_details/<place_id>')
def get_place_details(place_id):
    print("=== GET PLACE DETAILS ENDPOINT CALLED ===")
    print("Place ID:", place_id)
    
    if not place_id:
        return jsonify({'success': False, 'error': 'Place ID is required'}), 400
    
    location_service = LocationService(
        token=current_app.config['GOOGLE_API_KEY'],
        radius=5000  # 5km radius
    )
    place = location_service.get_location_details(place_id)
    
    # Check if the API call was successful
    if place.get('status') == 'OK':
        return jsonify({'success': True, 'data': place}), 200
    else:
        return jsonify({
            'success': False, 
            'error': place.get('error_message', 'Failed to get place details'),
            'data': place
        }), 400