from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, verify_jwt_in_request
from ..extensions import mongo_client
from services.location import LocationService
import requests
import os
import traceback
import json
from dotenv import load_dotenv
import logging

from datetime import datetime
# Load environment variables from config.env (handled centrally in app __init__,
# but keep safe fallback for direct module usage)
load_dotenv(dotenv_path="../config.env")

logger = logging.getLogger(__name__)

# System instruction to guide AI behavior for the Amala Joint app
SYSTEM_INSTRUCTION = (
    "You are Amala Bot, a friendly and helpful assistant for the Amala Joint app. "
    "Your main purpose is to help users find the best Amala spots and provide helpful information about Nigerian cuisine and restaurants.\n\n"
    
    "Key capabilities:\n"
    "• Help users find Amala restaurants near their location\n"
    "• Provide information about Amala dishes, ingredients, and preparation\n"
    "• Suggest restaurants based on preferences (budget, location, ratings)\n"
    "• Answer questions about Nigerian food culture\n"
    "• Help users discover new Amala spots they might enjoy\n\n"
    
    "Communication style:\n"
    "• Be conversational, friendly, and enthusiastic about Nigerian food\n"
    "• Use simple, clear language that's easy to understand\n"
    "• Ask follow-up questions to better understand user needs\n"
    "• Provide helpful suggestions and recommendations\n"
    "• Always be encouraging and positive\n\n"
    
    "When users ask about finding Amala spots:\n"
    "• Ask about their location or preferred area\n"
    "• Inquire about their budget preferences\n"
    "• Ask about specific Amala dishes they're interested in\n"
    "• Suggest popular spots with good ratings\n"
    "• Provide practical information like opening hours and contact details\n\n"
    
    "Always respond in a natural, conversational way. Don't use formal JSON structures - just have a friendly chat! "
    "If you need to suggest specific actions (like finding nearby spots), mention it naturally in your response."
)

# Helper to access Google API key from the running Flask app config
def get_google_api_key() -> str | None:
    try:
        return current_app.config.get("GOOGLE_API_KEY")
    except Exception:
        # Fallback to environment if app context not active
        return os.getenv("GOOGLE_API_KEY")

# Import the wrapped agents
try:
    from services.agent_wrapper import (
        day_trip_agent_sync,
        router_agent_sync,
        iterative_planner_agent_sync,
        worker_agents_sync,
        ai_agent_sync
    )
    agents_imported = True
    logger.info("Wrapped agents imported successfully!")
except ImportError as e:
    logger.warning(f"Wrapped agent import error: {e}")
    # Try importing original agents as fallback
    try:
        from services.agent import (
            ai_agent as ai_agent_sync,
            day_trip_agent,
            router_agent,
            iterative_planner_agent,
            worker_agents
        )
        # These won't work directly but at least we have references
        day_trip_agent_sync = day_trip_agent
        router_agent_sync = router_agent
        iterative_planner_agent_sync = iterative_planner_agent
        worker_agents_sync = worker_agents
        agents_imported = False
        logger.warning("Using original agents (may not work without wrapper)")
    except ImportError:
        agents_imported = False
        day_trip_agent_sync = None
        router_agent_sync = None
        iterative_planner_agent_sync = None
        worker_agents_sync = {}
        ai_agent_sync = None
        logger.error("No agents available")



ai_chatbot_bp = Blueprint('ai_chatbot', __name__)
navigate_bp = Blueprint('navigate', __name__)
amala_finder_bp = Blueprint('amala_finder', __name__)
planner_bp = Blueprint('planner', __name__)
amala_ai_bp = Blueprint('amala_ai', __name__)




def safe_agent_response(response):
    """
    Safely process agent responses, handling both strings and dicts
    Preserves full response content without truncation
    """
    if isinstance(response, (dict, list)):
        return response
    elif isinstance(response, str):
        # strip Markdown JSON formatting like ```json ... ```
        response_text = response.strip()
        if response_text.startswith("```"):
            # Remove starting fence (with optional language like json)
            first_newline = response_text.find("\n")
            if first_newline != -1 and response_text[:3] == "```":
                response_text = response_text[first_newline + 1 :]
            # Remove trailing fence if present
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
        
        # Try to parse as JSON, but preserve full text if it fails
        try:
            parsed = json.loads(response_text)
            # If it's a simple string in JSON, return the string directly
            if isinstance(parsed, str):
                return {"text": parsed}
            return parsed
        except json.JSONDecodeError:
            # Return the full text as a message object
            return {"text": response_text}
    else:
        return {"text": str(response)}


# AI Chatbot routes
@ai_chatbot_bp.get('/ask/')
@jwt_required()
def list_users():
    return jsonify({'success': True, 'data': "response"}), 200

@ai_chatbot_bp.route('/chat', methods=['OPTIONS'])
def chat_options():
    """Handle CORS preflight requests for chat endpoint"""
    return '', 200

@ai_chatbot_bp.post('/chat')
def chat():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        
        message = data.get('message')
        lang = data.get('lang', 'en')
        user_formatted_address = data.get('address')
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        if not agents_imported or ai_agent_sync is None:
            return jsonify({"error": "AI agent service unavailable"}), 503
        
        # Call the AI agent function with a system instruction prefix
        address_note = f"\nUser formatted address: {user_formatted_address}" if user_formatted_address else ""
        composed_message = f"{SYSTEM_INSTRUCTION}\n\nUser: {message}{address_note}"
        
        logger.info(f"Sending message to AI agent: {composed_message[:200]}...")
        ai_response = ai_agent_sync(composed_message, lang)
        logger.info(f"AI agent response: {str(ai_response)[:200]}...")
        
        # Normalize response into { intent, message, data }
        processed = safe_agent_response(ai_response)
        logger.info(f"Processed response: {processed}")
        
        # Extract message text with better fallback handling
        msg = ""
        intent = "chat"
        
        if isinstance(processed, dict):
            msg = processed.get("text") or processed.get("message") or processed.get("response") or ""
            intent = processed.get("intent", "chat")
        else:
            msg = str(processed)
        
        # Ensure we have a message
        if not msg or msg.strip() == "":
            msg = "I received your message but couldn't generate a proper response. Please try again."
        
        envelope = {
            "success": True,
            "intent": intent,
            "message": msg,
            "data": processed,
            # Back-compat
            "response": ai_response
        }
        logger.info(f"Returning envelope with message: {msg[:100]}...")
        return jsonify(envelope)
        
    except Exception as e:
        current_app.logger.exception("Chat service error")
        return jsonify({
            "error": "Chat service error"
        }), 500

# Navigation routes
@navigate_bp.route('/navigate', methods=['OPTIONS'])
def navigate_to_place_options():
    """Handle CORS preflight requests for navigate endpoint"""
    return '', 200

@navigate_bp.post('/navigate')
@jwt_required()
def navigate_to_place():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        query = data.get('query')
        location = data.get('location')  # {lat, long} OR address string
        if not query:
            return jsonify({"error": "Query is required"}), 400

        location_str = ""
        location_details = {}

        # Ensure Google API key is configured before making requests
        google_api_key = get_google_api_key()
        if not google_api_key:
            return jsonify({"error": "Navigation service unavailable"}), 503

        # ---- If coordinates provided ----
        if isinstance(location, dict) and 'lat' in location and ('long' in location or 'lng' in location):
            lat = location['lat']
            lng = location.get('long', location.get('lng'))
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={google_api_key}"
            try:
                geo_resp = requests.get(geocode_url, timeout=10)
                geo_resp.raise_for_status()
                geo_response = geo_resp.json()
            except requests.RequestException:
                return jsonify({"error": "Failed to reach geocoding service"}), 503
            if geo_response.get("status") == "OK" and geo_response.get("results"):
                result = geo_response["results"][0]
                location_str = result.get("formatted_address")
                location_details = {
                    "lat": lat,
                    "long": lng,
                    "formatted_address": location_str,
                    "city": next((c["long_name"] for c in result["address_components"] if "locality" in c["types"]), None),
                    "state": next((c["long_name"] for c in result["address_components"] if "administrative_area_level_1" in c["types"]), None),
                    "country": next((c["long_name"] for c in result["address_components"] if "country" in c["types"]), None),
                }

        # ---- If address string provided ----
        elif isinstance(location, str):
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={requests.utils.quote(location)}&key={google_api_key}"
            try:
                geo_resp = requests.get(geocode_url, timeout=10)
                geo_resp.raise_for_status()
                geo_response = geo_resp.json()
            except requests.RequestException:
                return jsonify({"error": "Failed to reach geocoding service"}), 503
            if geo_response.get("status") == "OK" and geo_response.get("results"):
                result = geo_response["results"][0]
                location_str = result.get("formatted_address")
                location_details = {
                    "lat": result["geometry"]["location"]["lat"],
                    "long": result["geometry"]["location"]["lng"],
                    "formatted_address": location_str,
                    "city": next((c["long_name"] for c in result["address_components"] if "locality" in c["types"]), None),
                    "state": next((c["long_name"] for c in result["address_components"] if "administrative_area_level_1" in c["types"]), None),
                    "country": next((c["long_name"] for c in result["address_components"] if "country" in c["types"]), None),
                }
            else:
                # Fallback: Use string as formatted address
                location_str = location
                location_details = {
                    "lat": None,
                    "long": None,
                    "formatted_address": location_str,
                    "city": None,
                    "state": None,
                }

        else:
            return jsonify({"error": "Invalid location format. Provide lat/long or address string."}), 400

        # Append formatted location to query
        if location_str:
            query = f"{query} near {location_str}"

        if not agents_imported or router_agent_sync is None or not worker_agents_sync:
            return jsonify({"error": "Navigation service unavailable"}), 503

        # Get route choice from router agent
        chosen_route_response = router_agent_sync.run(query)
        chosen_route = str(chosen_route_response).strip().replace("'", "").replace('"', '')

        current_app.logger.info(f"Router chose: '{chosen_route}'")

        # Execute the chosen worker agent
        if chosen_route in worker_agents_sync:
            worker_agent = worker_agents_sync[chosen_route]
            final_response = worker_agent.run(query)
            
            processed_response = (safe_agent_response(final_response))
            envelope = {
                "success": True,
                "intent": "navigate",
                "message": "Navigation result",
                "data": {
                    "response": processed_response,
                    "user_location": location,
                    "location_details": location_details
                },
                # Back-compat
                "response": processed_response,
                "user_location": location,
                "location_details": location_details
            }
            return jsonify(envelope)
        else:
            return jsonify({
                "error": "No suitable agent found"
            }), 404

    except Exception as e:
        current_app.logger.exception("Navigation service error")
        return jsonify({
            "error": "Navigation service error"
        }), 500



# Amala finder routes
@amala_finder_bp.route('/amala_finder', methods=['OPTIONS'])
def find_amala_options():
    """Handle CORS preflight requests for amala finder endpoint"""
    return '', 200

@amala_finder_bp.post('/amala_finder')
def find_amala():
    try:
        # Allow optional JWT: will not block unauthenticated requests
        try:
            verify_jwt_in_request(optional=True)
        except Exception:
            pass

        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        user_location = data.get('location')  # can be {lat, long} OR address string
        query = data.get('query')
        if not user_location or not query:
            return jsonify({"error": "Location and query are required"}), 400

        location_details = {}
        formatted_address = None

        # Ensure Google API key is configured before making requests
        google_api_key = get_google_api_key()
        if not google_api_key:
            return jsonify({"error": "Amala finder service unavailable"}), 503

        # ---- If coordinates provided ----
        if isinstance(user_location, dict) and 'lat' in user_location and ('long' in user_location or 'lng' in user_location):
            lat = user_location['lat']
            lng = user_location.get('long', user_location.get('lng'))
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={google_api_key}"
            try:
                geo_resp = requests.get(geocode_url, timeout=10)
                geo_resp.raise_for_status()
                geo_response = geo_resp.json()
            except requests.RequestException:
                return jsonify({"error": "Failed to reach geocoding service"}), 503

            if geo_response.get("status") == "OK" and geo_response.get("results"):
                result = geo_response["results"][0]
                formatted_address = result.get("formatted_address")
                location_details = {
                    "lat": lat,
                    "long": lng,
                    "formatted_address": formatted_address,
                    "city": next((c["long_name"] for c in result["address_components"] 
                                  if "locality" in c["types"]), user_location),
                    "state": next((c["long_name"] for c in result["address_components"] 
                                   if "administrative_area_level_1" in c["types"]), None),
                    "country": next((c["long_name"] for c in result["address_components"] 
                                     if "country" in c["types"]), None),
                }
            else:
                # fallback
                location_details = {
                    "lat": lat,
                    "long": lng,
                    "formatted_address": str(user_location),
                    "city": str(user_location),
                    "state": None,
                    "country": None
                }

        # ---- If address provided ----
        elif isinstance(user_location, str):
            address = user_location
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={requests.utils.quote(address)}&key={google_api_key}"
            try:
                geo_resp = requests.get(geocode_url, timeout=10)
                geo_resp.raise_for_status()
                geo_response = geo_resp.json()
            except requests.RequestException:
                return jsonify({"error": "Failed to reach geocoding service"}), 503

            if geo_response.get("status") == "OK" and geo_response.get("results"):
                result = geo_response["results"][0]
                formatted_address = result.get("formatted_address")
                location_details = {
                    "lat": result["geometry"]["location"].get("lat"),
                    "long": result["geometry"]["location"].get("lng"),
                    "formatted_address": formatted_address,
                    "city": next((c["long_name"] for c in result["address_components"] 
                                  if "locality" in c["types"]), address),
                    "state": next((c["long_name"] for c in result["address_components"] 
                                   if "administrative_area_level_1" in c["types"]), None),
                    "country": next((c["long_name"] for c in result["address_components"] 
                                     if "country" in c["types"]), None),
                }
            else:
                # fallback if Google fails
                location_details = {
                    "lat": None,
                    "long": None,
                    "formatted_address": address,
                    "city": address,
                    "state": None,
                    "country": None
                }

        else:
            return jsonify({"error": "Invalid location format. Provide lat/long or address string."}), 400

        # ---- Build concise enhanced query for AI ----
        location_str = formatted_address or str(user_location)
        enhanced_query = f"Find Amala spots near {location_str}. User query: {query}"

        if not agents_imported or day_trip_agent_sync is None:
            return jsonify({"error": "Amala finder service unavailable"}), 503

        # Call the day trip agent
        amala_spots_data = day_trip_agent_sync.run(enhanced_query)
        processed_data = safe_agent_response(amala_spots_data)

        # Normalize agent spots into list[dict]
        def build_photo_url(photo_ref: str | None, api_key: str | None) -> str | None:
            if not photo_ref or not api_key:
                return None
            return (
                f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800"
                f"&photoreference={photo_ref}&key={api_key}"
            )

        def normalize_agent_spots(data):
            try:
                if isinstance(data, list):
                    items = data
                elif isinstance(data, dict):
                    # In case agent returns an envelope-like object
                    items = data.get("results") or data.get("spots") or data.get("data") or []
                    if not isinstance(items, list):
                        items = [items]
                else:
                    items = []
            except Exception:
                items = []
            normalized = []
            for item in items:
                if not isinstance(item, dict):
                    continue
                name = item.get("name") or item.get("title") or item.get("Name")
                address = (
                    item.get("formatted_address")
                    or item.get("address")
                    or item.get("vicinity")
                )
                geometry = item.get("geometry") or {}
                location = geometry.get("location") if isinstance(geometry, dict) else None
                lat = None
                lng = None
                if isinstance(location, dict):
                    lat = location.get("lat")
                    lng = location.get("lng") or location.get("long")
                else:
                    lat = item.get("latitude")
                    lng = item.get("longitude")
                photos = item.get("photos")
                # Support both object and array shapes
                photo_ref = None
                if isinstance(photos, list) and photos:
                    first = photos[0]
                    if isinstance(first, dict):
                        photo_ref = first.get("photo_reference") or first.get("photoRef")
                elif isinstance(photos, dict):
                    photo_ref = photos.get("photo_reference") or photos.get("photoRef")

                normalized.append({
                    "place_id": item.get("place_id") or item.get("id") or item.get("_id"),
                    "name": name,
                    "formatted_address": address,
                    "rating": item.get("rating") or item.get("user_ratings_total"),
                    "price_level": item.get("price_level"),
                    "geometry": {"location": {"lat": lat, "lng": lng}} if lat is not None and lng is not None else None,
                    "opening_hours": item.get("opening_hours"),
                    "vicinity": item.get("vicinity"),
                    "photos": photos,
                    "imageUrl": build_photo_url(photo_ref, google_api_key),
                    "source": item.get("source") or "agent"
                })
            return [i for i in normalized if i.get("name")]

        agent_spots = normalize_agent_spots(processed_data)

        # Fetch verified stores from MongoDB and normalize
        try:
            db = mongo_client.get_db()
            verified_cursor = db.stores.find({"is_verified": True})
            verified_stores = []
            for s in verified_cursor:
                lat = s.get("latitude")
                lng = s.get("longitude")
                # If no coordinates, geocode the address once to enable map markers
                if (lat is None or lng is None) and s.get("location") and google_api_key:
                    try:
                        addr = s.get("location")
                        geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={requests.utils.quote(addr)}&key={google_api_key}"
                        geo_resp = requests.get(geocode_url, timeout=8)
                        geo_resp.raise_for_status()
                        geo_json = geo_resp.json()
                        if geo_json.get("status") == "OK" and geo_json.get("results"):
                            loc = geo_json["results"][0]["geometry"]["location"]
                            lat = loc.get("lat")
                            lng = loc.get("lng")
                    except Exception:
                        pass

                verified_stores.append({
                    "place_id": s.get("place_id") or str(s.get("_id")),
                    "name": s.get("name"),
                    "formatted_address": s.get("location"),
                    "rating": s.get("rating"),
                    "price_level": s.get("price_level"),
                    "geometry": {"location": {"lat": lat, "lng": lng}} if lat is not None and lng is not None else None,
                    "imageUrl": s.get("imageUrl"),
                    "opensAt": s.get("opensAt"),
                    "closesAt": s.get("closesAt"),
                    "phone": s.get("phone"),
                    "description": s.get("description"),
                    "verifiedBy": s.get("verifiedBy"),
                    "source": "verified"
                })
            verified_stores = [i for i in verified_stores if i.get("name")]
        except Exception:
            verified_stores = []

        # Optionally fetch nearby places from Google if coordinates available
        nearby_places = []
        try:
            lat = location_details.get("lat")
            lng = location_details.get("long")
            if lat is not None and lng is not None:
                loc_service = LocationService(token=google_api_key, radius=5000)
                nearby = loc_service.get_nearby_places(str(lat), str(lng)) or {}
                for place in (nearby.get("results") or []):
                    photos = place.get("photos")
                    photo_ref = None
                    if isinstance(photos, list) and photos:
                        first = photos[0]
                        if isinstance(first, dict):
                            photo_ref = first.get("photo_reference")

                    nearby_places.append({
                        "place_id": place.get("place_id"),
                        "name": place.get("name"),
                        "formatted_address": place.get("vicinity") or place.get("formatted_address"),
                        "rating": place.get("rating"),
                        "price_level": place.get("price_level"),
                        "geometry": place.get("geometry"),
                        "opening_hours": place.get("opening_hours"),
                        "vicinity": place.get("vicinity"),
                        "photos": photos,
                        "imageUrl": build_photo_url(photo_ref, google_api_key),
                        "source": "google_places"
                    })
        except Exception:
            nearby_places = []

        # Combine and dedupe (by place_id if present, otherwise name+address)
        combined = []
        seen = set()
        def key_of(item):
            pid = item.get("place_id")
            if pid:
                return f"id::{pid}"
            return f"na::{(item.get('name') or '').lower()}::{(item.get('formatted_address') or '').lower()}"

        for bucket in (verified_stores, nearby_places, agent_spots):
            for it in bucket:
                k = key_of(it)
                if k in seen:
                    continue
                seen.add(k)
                combined.append(it)

        envelope = {
            "success": True,
            "intent": "amala_finder",
            "message": "Amala spots found",
            "data": {
                "response": processed_data,
                "places": combined,
                "verified_count": len(verified_stores),
                "agent_count": len(agent_spots),
                "nearby_count": len(nearby_places),
                "query": query,
                "user_location": user_location,
                "location_details": location_details
            },
            # Back-compat
            "response": processed_data,
            "places": combined,
            "query": query,
            "user_location": user_location,
            "location_details": location_details
        }
        return jsonify(envelope)

    except Exception as e:
        current_app.logger.exception("Amala finder service error")
        return jsonify({
            "error": "Failed to run amala finder agent"
        }), 500

@amala_ai_bp.route('/verify-store/', methods=['OPTIONS'])
def verify_store_options():
    """Handle CORS preflight requests for verify store endpoint"""
    return '', 200

@amala_ai_bp.post('/verify-store/')
@jwt_required()
def verify_store():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        reason = data.get("Reason")
        proof_link = data.get("ProofLink")
        image = data.get("image")  # could be a URL or base64 string

        if not reason or not proof_link or not image:
            return jsonify({"error": "Reason, ProofLink, and image are required"}), 400

        # Process the verification request here
        # For example, save it to MongoDB
        verification_doc = {
            "reason": reason,
            "proof_link": proof_link,
            "image": image,
            "status": "pending",  # default status
            "submitted_at": datetime.utcnow()
        }

        result = mongo_client.db.store_verifications.insert_one(verification_doc)

        return jsonify({
            "success": True,
            "message": "Store verification submitted successfully",
            "verification_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        current_app.logger.exception("Failed to submit verification")
        return jsonify({
            "error": "Failed to submit verification"
        }), 500


    
    

# Optional debug info under AI namespace
@ai_chatbot_bp.get('/debug/agents')
@jwt_required()
def debug_agents():
    return jsonify({
        "agents_imported": agents_imported,
        "ai_agent_available": ai_agent_sync is not None,
        "day_trip_agent_available": day_trip_agent_sync is not None,
        "router_agent_available": router_agent_sync is not None,
        "iterative_planner_available": iterative_planner_agent_sync is not None,
        "worker_agents_count": len(worker_agents_sync) if worker_agents_sync else 0,
        # Do not expose exact worker keys in production
    })