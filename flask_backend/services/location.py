import requests
import app.config as config

class LocationService:
    def __init__(self,  token: str, radius: int):
        self.token = token
        self.radius = radius

        print(token, radius, sep=" | ")

    def get_current_address(self, latitude: str, longitude: str) -> dict:
        """
        Get the user's current location formatted address from latitude/longitude
        using Google Geocoding API.
        """
        try:
            response = requests.get(
                f"https://maps.googleapis.com/maps/api/geocode/json"
                f"?latlng={latitude},{longitude}&key={self.token}"
            )
            data = response.json()
            
            # Check API status
            if data.get('status') != 'OK':
                print(f"Google Geocoding API error: {data.get('status')} - {data.get('error_message', 'Unknown error')}")
                return {
                    'status': data.get('status'),
                    'error_message': data.get('error_message', 'Failed to get address'),
                    'results': []
                }
            
            print(f"Geocoding successful: {len(data.get('results', []))} results")
            return data
            
        except requests.RequestException as e:
            print(f"Request error: {e}")
            return {
                'status': 'REQUEST_ERROR',
                'error_message': str(e),
                'results': []
            }
        except Exception as e:
            print(f"Unexpected error: {e}")
            return {
                'status': 'UNKNOWN_ERROR',
                'error_message': str(e),
                'results': []
            }

    def get_nearby_places(self, latitude: str, longitude: str) -> dict:
        """
        Get places near the current user location using Google Places API.
        """
        response = requests.get(
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            f"?location={latitude},{longitude}&radius={self.radius}&keyword=amala&key={self.token}"
        )
        data = response.json()
        print(data)
        return data
    
    def search_places(self, query: str) -> dict:
        """
        Search for places using Google Places Text Search API.
        """
        try:
            response = requests.get(
                f"https://maps.googleapis.com/maps/api/place/textsearch/json"
                f"?query={query}&key={self.token}"
            )
            data = response.json()
            
            # Check API status
            if data.get('status') != 'OK':
                print(f"Google Places Text Search API error: {data.get('status')} - {data.get('error_message', 'Unknown error')}")
                return {
                    'status': data.get('status'),
                    'error_message': data.get('error_message', 'Failed to search places'),
                    'results': []
                }
            
            print(f"Places search successful: {len(data.get('results', []))} results for query: {query}")
            return data
            
        except requests.RequestException as e:
            print(f"Request error: {e}")
            return {
                'status': 'REQUEST_ERROR',
                'error_message': str(e),
                'results': []
            }
        except Exception as e:
            print(f"Unexpected error: {e}")
            return {
                'status': 'UNKNOWN_ERROR',
                'error_message': str(e),
                'results': []
            }
    
    def get_location_details(self, place_id: str) -> dict:
        """
        Get details of a location using the Place ID with Google Place Details API.
        """
        try:
            response = requests.get(
                f"https://maps.googleapis.com/maps/api/place/details/json"
                f"?place_id={place_id}&fields=place_id,name,formatted_address,vicinity,rating,user_ratings_total,price_level,opening_hours,photos,geometry,formatted_phone_number,website,reviews,editorial_summary&key={self.token}"
            )
            data = response.json()
            
            # Check API status
            if data.get('status') != 'OK':
                print(f"Google Place Details API error: {data.get('status')} - {data.get('error_message', 'Unknown error')}")
                return {
                    'status': data.get('status'),
                    'error_message': data.get('error_message', 'Failed to get place details'),
                    'result': {}
                }
            
            print(f"Place details successful for place_id: {place_id}")
            return data
            
        except requests.RequestException as e:
            print(f"Request error: {e}")
            return {
                'status': 'REQUEST_ERROR',
                'error_message': str(e),
                'result': {}
            }
        except Exception as e:
            print(f"Unexpected error: {e}")
            return {
                'status': 'UNKNOWN_ERROR',
                'error_message': str(e),
                'result': {}
            }


# lc = 