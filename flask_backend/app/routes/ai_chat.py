from flask import Blueprint, jsonify, request, Flask
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..extensions import mongo_client
from ..utils.mongo import serialize_document


ai_chatbot_bp = Blueprint('users', __name__)
from flask import Blueprint, jsonify, request, Flask
from flask_jwt_extended import jwt_required
from services.agent import ai_agent
from ..extensions import mongo_client
import asyncio
from services.agent import (worker_agents, router_agent, run_agent_query, session_service, my_user_id, day_trip_agent,iterative_planner_agent)
from flask_cors import CORS # Import CORS
from services.agent import ai_agent
from crewai import Crew, Process, Task, Agent

app = Flask(__name__)

#enable cors for all routes
CORS(app)
ai_chatbot_bp = Blueprint('ai_chatbot_bp', __name__)
navigate_bp = Blueprint('navigate_bp', __name__)
amala_finder_bp = Blueprint('amala_finder_bp', __name__)
planner_bp = Blueprint('planner_bp', __name__)



ai_chatbot_bp = Blueprint('ai_chatbot_bp', __name__)
navigate_bp = Blueprint('navigate_bp', __name__)
amala_finder_bp = Blueprint('amala_finder_bp', __name__)
planner_bp = Blueprint('planner_bp', __name__)


# AI Chatbot Blueprint
@ai_chatbot_bp.get('/ask/')
@jwt_required()
def list_users():
    """Returns a success response for listing users."""
    return jsonify({'success': True, 'data': "response"}), 200

@ai_chatbot_bp.post('/chat')
def chat():
    """Handles chatbot queries and returns a response from the AI agent."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    
    message = data.get('message')
    lang = data.get('lang')
    
    if not message:
        return jsonify({"error": "No message provided"}), 400

    try:
        ai_response = ai_agent(message, lang)
        return jsonify({"response": ai_response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Navigation Blueprint
@navigate_bp.post('/navigate')
def navigate_to_place():
    """Navigates to a place based on a query using a router and worker agents."""
    data = request.get_json()
    query = data.get('query')

    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    try:
        # Assumes router_agent.run() exists as it's not the LlmAgent
        chosen_route = router_agent.run(query) 
        
        if chosen_route in worker_agents:
            worker_agent = worker_agents[chosen_route]
            final_response = worker_agent.run(query)
            return jsonify({"success": True, "data": final_response}), 200
        else:
            return jsonify({"error": "No suitable agent found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Amala Finder Blueprint
@amala_finder_bp.post('/amala_finder')
def find_amala():
    """
    Finds places to get 'amala' using the day_trip_agent.
    Corrected to use the CrewAI framework kickoff method.
    """
    data = request.get_json()
    user_location = data.get('location')  # e.g., {"lat": 6.5244, "long": 3.3792}
    query = data.get('query')

    if not user_location or not query:
        return jsonify({"error": "Location and query are required"}), 400

    try:
        # Define a task for the day_trip_agent
        find_amala_task = Task(
            description=f"Find the best places to get amala near {user_location} based on the user's query: '{query}'.",
            expected_output="A list of the best 'amala' spots in JSON format.",
            agent=day_trip_agent
        )

        # Create a crew with the agent and task
        amala_crew = Crew(
            agents=[day_trip_agent],
            tasks=[find_amala_task],
            process=Process.sequential,
        )

        # Run the crew to execute the task
        amala_spots_data = amala_crew.kickoff()
        
        return jsonify({"success": True, "data": amala_spots_data}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to run amala finder agent: {str(e)}"}), 500


# Planner Blueprint
@planner_bp.post('/plan')
def plan_activity():
    """
    Plans an activity using the iterative_planner_agent.
    Corrected to use the CrewAI framework kickoff method.
    """
    data = request.get_json()
    query = data.get('query')

    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    try:
        # Define a task for the planner agent
        planning_task = Task(
            description=f"Create a detailed plan for the activity based on the user's query: '{query}'.",
            expected_output="A comprehensive plan in a structured text format.",
            agent=iterative_planner_agent
        )

        # Create a crew with the planner agent and task
        planner_crew = Crew(
            agents=[iterative_planner_agent],
            tasks=[planning_task],
            process=Process.sequential
        )

        # Run the crew to execute the task
        final_plan_data = planner_crew.kickoff()
        
        return jsonify({"success": True, "data": final_plan_data}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to run planning agent: {str(e)}"}), 500


# hey victor
# this is just a comment to help you create endpoints
# if you want to create a new route, start by creating a new file in the same folder as this one

# then, create a bluePrint - this is just like the api router in FAST API
# blueprint_name = Blueprint('route_name', __name__) 

# to create an endpoint 
# use the blueprint decorator to call an api method [GET, POST, PUT, ...OTHERS]
# if you want to make the endpoint secure by expecting an access Token from the from the frontend

# if you want to make the endpoint secure by expecting an access Token from the frontend
# continue with the @jwt_required() decorator before calling the api function
#  then create the api function
# then do your logic and return a valid response conditionally or not.