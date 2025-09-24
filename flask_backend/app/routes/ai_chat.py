<<<<<<< HEAD
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..extensions import mongo_client
from ..utils.mongo import serialize_document


ai_chatbot_bp = Blueprint('users', __name__)
=======
from flask import Blueprint, jsonify, request, FLASK
from flask_jwt_extended import jwt_required
from services.agent import process_text
from ..extensions import mongo_client
from ..utils.mongo import serialize_document
from helpers.agent_query import run_agent_query
import asyncio
from google.adk.sessions import SessionService
from services.agent import (worker_agents, router_agent, run_agent_query, session_service, my_user_id, day_trip_agent,iterative_planner_agent)
from flask_cors import CORS # Import CORS
from services.agent import ai_agent

app = FLASK(__name__)

#enable cors for all routes
CORS(app)
ai_chatbot_bp = Blueprint('users', __name__)
navigate_bp = Blueprint('navigate_bp', __name__)
amala_finder_bp = Blueprint('amala_finder_bp', __name__)
planner_bp = Blueprint('planner_bp', __name__)

>>>>>>> b668542b70487461f8af1815c72b440301c720fd


@ai_chatbot_bp.get('/ask/')
@jwt_required()
def list_users():
    return jsonify({'success': True, 'data': "respones"}), 200

<<<<<<< HEAD
=======
@ai_chatbot_bp.post('/chat')
def chat():
    
    data = request.get_json() 
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    message = data.get('message')
    lang = data.get('lang')
    if not message:
        return jsonify({"error": "No message provided"}), 400

    ai_response = ai_agent(message, lang)
    return jsonify({"response": ai_response})

@navigate_bp.post('/navigate')
def navigate_to_place():
    data = request.get_json()
    query = data.get('query')

    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    chosen_route = router_agent.run(query) 
    
    if chosen_route in worker_agents:
        worker_agent = worker_agents[chosen_route]
        final_response = worker_agent.run(query)
        return jsonify({"success": True, "data": final_response})
    else:
        return jsonify({"error": "No suitable agent found"}), 404
    
@amala_finder_bp.post('/amala_finder')
def find_amala():
    data = request.get_json()
    user_location = data.get('location') # e.g., {"lat": 6.5244, "long": 3.3792}
    query = data.get('query')

    if not user_location or not query:
        return jsonify({"error": "Location and query are required"}), 400

    amala_spots_data = day_trip_agent.run(query) 

    return jsonify({"success": True, "data": amala_spots_data})

@planner_bp.post('/plan')
def plan_activity():
    data = request.get_json()
    query = data.get('query')

    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    final_plan_data = iterative_planner_agent.run(query)
    
    return jsonify({"success": True, "data": final_plan_data})
    



>>>>>>> b668542b70487461f8af1815c72b440301c720fd


# hey victor
# this is just a comment to help you create endpoints
# if you want to create a new route, start by creating a new file in the same folder as this one

# then, create a bluePrint - this is just like the api router in FAST API
# blueprint_name = Blueprint('route_name', __name__) 

# to create an endpoint 
# use the blueprint decorator to call an api method [GET, POST, PUT, ...OTHERS]
<<<<<<< HEAD
# if you want to make the endpoint secure by expecting an access Token from the from the frontend
=======
# if you want to make the endpoint secure by expecting an access Token from the frontend
>>>>>>> b668542b70487461f8af1815c72b440301c720fd
# continue with the @jwt_required() decorator before calling the api function
#  then create the api function
# then do your logic and return a valid response conditionally or not.