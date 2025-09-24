from flask import Blueprint, jsonify, request, Flask
from flask_jwt_extended import jwt_required
from flask_cors import CORS
from ..extensions import mongo_client
import requests
from ..utils.mongo import serialize_document
import os
import traceback
from dotenv import load_dotenv

from datetime import datetime
from services.location import LocationService
# Create Flask app and blueprints
# Load environment variables from config.env (located outside app folder)
load_dotenv(dotenv_path="../config.env")

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Now set the config values from env
app.config["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# Initialize LocationService with the key
ls = LocationService(app.config["GOOGLE_API_KEY"], 4000)

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


ai_chatbot_bp = Blueprint('ai_chatbot', __name__, url_prefix='/api/ai')
navigate_bp = Blueprint('navigate', __name__, url_prefix='/api/navigate')
amala_finder_bp = Blueprint('amala_finder', __name__, url_prefix='/api/ai')  # Match your URL structure
planner_bp = Blueprint('planner', __name__, url_prefix='/api/planner')
amala_ai_bp = Blueprint('amala_ai', __name__, url_prefix='/api/veirfystore')

def safe_agent_response(response):
    """
    Safely process agent responses, handling both strings and dicts
    """
    if isinstance(response, dict):
        # If it's already a dict, return as is
        return response
    elif isinstance(response, str):
        # If it's a string that looks like JSON, try to parse it
        response_text = response.strip()
        if (response_text.startswith('[') and response_text.endswith(']')) or \
           (response_text.startswith('{') and response_text.endswith('}')):
            try:
                import json
                return json.loads(response_text)
            except json.JSONDecodeError:
                pass
        # Return as string if not JSON
        return response
    else:
        # Convert other types to string
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
        location = data.get('location') 
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        location_str = ""
        if isinstance(location, dict):  # {lat, long}
            lat = location.get("lat")
            lng = location.get("long")
            if lat and lng:
                addr_data = LocationService.get_current_address(lat, lng)
                if addr_data["status"] == "OK":
                    location_str = addr_data["results"][0]["formatted_address"]
        elif isinstance(location, str):  # already human-readable
            location_str = location
        
        # 🔗 Append location to query (if found)
        if location_str:
            query = f"{query} near {location_str}"
        
        if not agents_imported or router_agent_sync is None or not worker_agents_sync:
            return jsonify({"error": "Navigation service unavailable"}), 503
        
        # Get route choice from router agent
        chosen_route_response = router_agent_sync.run(query)
        
        # Extract the route name from the response
        if isinstance(chosen_route_response, str):
            chosen_route = chosen_route_response.strip().replace("'", "").replace('"', '')
        else:
            chosen_route = str(chosen_route_response)
        
        print(f"🚦 Router chose: '{chosen_route}'")
        
        # Execute the chosen worker agent
        if chosen_route in worker_agents_sync:
            worker_agent = worker_agents_sync[chosen_route]
            final_response = worker_agent.run(query)
            processed_response = safe_agent_response(final_response)
            return jsonify({"success": True, "response": processed_response})
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
        
        user_location = data.get('location')   # can be {lat, long} OR address string
        query = data.get('query')
        
        if not user_location or not query:
            return jsonify({"error": "Location and query are required"}), 400
        
        location_details = {}

        # ---- If coordinates provided ----
        if isinstance(user_location, dict) and 'lat' in user_location and 'long' in user_location:
            lat, lng = user_location['lat'], user_location['long']
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={os.getenv('GOOGLE_API_KEY')}"
            geo_response = requests.get(geocode_url).json()
            if geo_response.get("status") == "OK" and geo_response.get("results"):
                result = geo_response["results"][0]
                location_details = {
                    "lat": lat,
                    "long": lng,
                    "formatted_address": result.get("formatted_address"),
                    "city": next((c["long_name"] for c in result["address_components"] if "locality" in c["types"]), None),
                    "state": next((c["long_name"] for c in result["address_components"] if "administrative_area_level_1" in c["types"]), None),
                    "country": next((c["long_name"] for c in result["address_components"] if "country" in c["types"]), None),
                }

        # ---- If address provided ----
        elif isinstance(user_location, str):
            address = user_location
            geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={os.getenv('GOOGLE_API_KEY')}"
            geo_response = requests.get(geocode_url).json()
            if geo_response.get("status") == "OK" and geo_response.get("results"):
                result = geo_response["results"][0]
                location_details = {
                    "lat": result["geometry"]["location"]["lat"],
                    "long": result["geometry"]["location"]["lng"],
                    "formatted_address": result.get("formatted_address"),
                    "city": next((c["long_name"] for c in result["address_components"] if "locality" in c["types"]), None),
                    "state": next((c["long_name"] for c in result["address_components"] if "administrative_area_level_1" in c["types"]), None),
                    "country": next((c["long_name"] for c in result["address_components"] if "country" in c["types"]), None),
                }

        else:
            return jsonify({"error": "Invalid location format. Provide lat/long or address string."}), 400

        # ---- Enhance query with geocoded details ----
        enhanced_query = f"Find Amala spots in {location_details.get('city')}, {location_details.get('state')}, {location_details.get('country')}. User query: {query}"

        if not agents_imported or day_trip_agent_sync is None:
            return jsonify({"error": "Amala finder service unavailable"}), 503

        # Call the day trip agent (amala finder)
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


# Planner routes
@planner_bp.post('/plan')
def plan_activity():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        
        query = data.get('query')
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
        
        if not agents_imported or iterative_planner_agent_sync is None:
            return jsonify({"error": "Planner service unavailable"}), 503
        
        print(f"📅 Processing planner query: '{query}'")
        
        # Call the iterative planner agent
        final_plan_data = iterative_planner_agent_sync.run(query)
        
        # Process the response
        processed_data = safe_agent_response(final_plan_data)
        
        return jsonify({"success": True, "response": processed_data})
        
    except Exception as e:
        return jsonify({
            "error": f"Planner service error: {str(e)}",
            "traceback": traceback.format_exc()
        }), 500
    
@amala_ai_bp.post('/verify-store/')
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


    
    

# Debug endpoint
@app.route('/debug/agents')
def debug_agents():
    """Debug endpoint to check agent status"""
    return jsonify({
        "agents_imported": agents_imported,
        "ai_agent_available": ai_agent_sync is not None,
        "day_trip_agent_available": day_trip_agent_sync is not None,
        "router_agent_available": router_agent_sync is not None,
        "iterative_planner_available": iterative_planner_agent_sync is not None,
        "worker_agents_count": len(worker_agents_sync) if worker_agents_sync else 0,
        "worker_agent_keys": list(worker_agents_sync.keys()) if worker_agents_sync else []
    })



# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "message": "API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True)