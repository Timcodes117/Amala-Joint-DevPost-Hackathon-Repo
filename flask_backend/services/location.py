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
        response = requests.get(
            f"https://maps.googleapis.com/maps/api/geocode/json"
            f"?latlng={latitude},{longitude}&key={self.token}"
        )
        data = response.json()
        print(data)
        return data

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
    
    def get_location_details(self, place_id: str) -> dict:
        """
        Get details of a location using the Place ID with Google Place Details API.
        """
        response = requests.get(
            f"https://maps.googleapis.com/maps/api/place/details/json"
            f"?place_id={place_id}&key={self.token}"
        )
        data = response.json()
        print(data)
        return data


# lc = 