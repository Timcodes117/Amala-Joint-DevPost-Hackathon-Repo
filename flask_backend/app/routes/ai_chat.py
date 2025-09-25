from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from ..extensions import mongo_client
import requests
from ..utils.mongo import serialize_document
import os
import traceback
import json
from dotenv import load_dotenv

from datetime import datetime
from services.location import LocationService
# Load environment variables from config.env (handled centrally in app __init__,
# but keep safe fallback for direct module usage)
load_dotenv(dotenv_path="../config.env")

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
    print(" Wrapped agents imported successfully!")
except ImportError as e:
    print(f" Wrapped agent import error: {e}")
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
        print(" Using original agents (may not work without wrapper)")
    except ImportError:
        agents_imported = False
        day_trip_agent_sync = None
        router_agent_sync = None
        iterative_planner_agent_sync = None
        worker_agents_sync = {}
        ai_agent_sync = None
        print(" No agents available")


ai_chatbot_bp = Blueprint('ai_chatbot', __name__)
navigate_bp = Blueprint('navigate', __name__)
amala_finder_bp = Blueprint('amala_finder', __name__)
planner_bp = Blueprint('planner', __name__)
amala_ai_bp = Blueprint('amala_ai', __name__)



import json

def safe_agent_response(response):
    """
         Safely process agent responses, handling both strings and dicts
    """
    if isinstance(response, (dict, list)):
        return response
    elif isinstance(response, str):
        # strip Markdown JSON formatting like ```json ... ```
        response_text = response.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:].rstrip("```").strip()
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            return {"text": response_text}  # fallback
    else:
        return str(response)


# AI Chatbot routes
@ai_chatbot_bp.get('/ask/')
@jwt_required()
def list_users():
    return jsonify({'success': True, 'data': "response"}), 200

@ai_chatbot_bp.post('/chat')
def chat():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        
        message = data.get('message')
        lang = data.get('lang', 'en')
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        if not agents_imported or ai_agent_sync is None:
            return jsonify({"error": "AI agent service unavailable"}), 503
        
        # Call the AI agent function
        ai_response = ai_agent_sync(message, lang)
        
        return jsonify({"success": True, "response": ai_response})
        
    except Exception as e:
        return jsonify({
            "error": f"Chat service error: {str(e)}",
            "traceback": traceback.format_exc()
        }), 500

# Navigation routes
@navigate_bp.post('/navigate')
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

        # ---- If coordinates provided ----
        if isinstance(location, dict) and 'lat' in location and 'long' in location:
            lat, lng = location['lat'], location['long']
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={get_google_api_key()}"
            geo_response = requests.get(geocode_url).json()
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
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={requests.utils.quote(location)}&key={get_google_api_key()}"
            geo_response = requests.get(geocode_url).json()
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

        print(f"🚦 Router chose: '{chosen_route}'")

        # Execute the chosen worker agent
        if chosen_route in worker_agents_sync:
            worker_agent = worker_agents_sync[chosen_route]
            final_response = worker_agent.run(query)
            
            processed_response = (safe_agent_response(final_response))
            return jsonify({
                "success": True,
                "response": processed_response,
                "user_location": location,
                "location_details": location_details
            })
        else:
            return jsonify({
                "error": "No suitable agent found",
                "chosen_route": chosen_route,
                "available_routes": list(worker_agents_sync.keys())
            }), 404

    except Exception as e:
        return jsonify({
            "error": f"Navigation service error: {str(e)}",
            "traceback": traceback.format_exc()
        }), 500



# Amala finder routes
@amala_finder_bp.post('/amala_finder')
def find_amala():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        user_location = data.get('location')  # can be {lat, long} OR address string
        query = data.get('query')
        if not user_location or not query:
            return jsonify({"error": "Location and query are required"}), 400

        location_details = {}
        formatted_address = None

        # ---- If coordinates provided ----
        if isinstance(user_location, dict) and 'lat' in user_location and 'long' in user_location:
            lat, lng = user_location['lat'], user_location['long']
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={get_google_api_key()}"
            geo_response = requests.get(geocode_url).json()

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
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={requests.utils.quote(address)}&key={get_google_api_key()}"
            geo_response = requests.get(geocode_url).json()

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

        return jsonify({
            "success": True,
            "response": processed_data,
            "query": query,
            "user_location": user_location,
            "location_details": location_details
        })

    except Exception as e:
        return jsonify({
            "error": f"Failed to run amala finder agent: {str(e)}",
            "traceback": traceback.format_exc(),
            "debug_info": {
                "agent_available": day_trip_agent_sync is not None,
                "agents_imported": agents_imported
            }
        }), 500

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

        mongo_client.db.store_verifications.insert_one(verification_doc)

        return jsonify({
            "success": True,
            "message": "Store verification submitted successfully",
            "verification_id": str(verification_doc["_id"])
        }), 201

    except Exception as e:
        return jsonify({
            "error": f"Failed to submit verification: {str(e)}",
            "traceback": traceback.format_exc()
        }), 500


    
    

# Optional debug info under AI namespace
@ai_chatbot_bp.get('/debug/agents')
def debug_agents():
    return jsonify({
        "agents_imported": agents_imported,
        "ai_agent_available": ai_agent_sync is not None,
        "day_trip_agent_available": day_trip_agent_sync is not None,
        "router_agent_available": router_agent_sync is not None,
        "iterative_planner_available": iterative_planner_agent_sync is not None,
        "worker_agents_count": len(worker_agents_sync) if worker_agents_sync else 0,
        "worker_agent_keys": list(worker_agents_sync.keys()) if worker_agents_sync else []
    })