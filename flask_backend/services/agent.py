import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import requests
import re
import asyncio
import json
# from IPython.display import display, Markdown
import google.generativeai as genai
from google.adk.agents import Agent
from google.adk.tools import google_search, ToolContext
#from google.adk.tools import google_search, google_api_tool, ToolContext
#from IPython.display import display, Markdown
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService, Session
from google.genai.types import Content, Part
from google.adk.agents import Agent, SequentialAgent, LoopAgent
from getpass import getpass
from helpers.agent_query import session_service, my_user_id, run_agent_query


api_key = 'AIzaSyBIRn4U9-rPQg3bVFWweJR-RLRQhRpngUg'

# Get Your API Key HERE 👉 https://codelabs.developers.google.com/onramp/instructions#0
# Configure the generative AI library with the provided key
genai.configure(api_key=api_key)

# Set the API key as an environment variable for ADK to use
os.environ['GOOGLE_API_KEY'] = api_key

print("✅ API Key configured successfully! Let the fun begin.")

def getPlaces(lat, lng) -> list[dict]:
    req = requests.get(f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=4000&keyword=amala&key=AIzaSyA-4CieLYHjaqyxEvxOIBlKVazQtIBc528")
    return req.json();

def extract_json_from_response(response):
    """Extracts a clean JSON array from agent response text."""
    text = "".join(part.text for part in response.parts if hasattr(part, "text"))
    # Remove ```json fences if they exist
    text = text.strip()
    if text.startswith("```json"):
        text = text[len("```json"):]
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text)


def create_amala_finder_agent():
    """Create an Amala Spot Finder agent"""
    return Agent(
        name="amala_finder_agent",
        model="gemini-2.5-flash",  # or another Gemini model you have access to
        description="Agent specialized in finding and structuring information about Amala spots in Nigeria.",
        instruction="""
        You are the "Amala Spot Finder" 🍲 - a specialized AI assistant that helps users discover the best Amala joints near them.

        Your Mission:
        Transform the user's location (coordinates in Nigeria) into a list of recommended Amala spots with structured details.

        use 6.5244, 3.3792 (lat, long) respectively as the user's location

        Guidelines:
        1. **Local Search**: Use Google Search (and if available Google Places API) to find actual Amala restaurants/joints near the provided coordinates.
        2. **Structured Output**: Return results as an ARRAY OF JSON OBJECTS with this schema:
           {
             id: string,              // unique identifier
             name: string,            // restaurant/shop name
             description: string,     // short description of the spot
             rating: float,           // average user rating (if available)
             address: string,
             price_range: string,     // e.g., "cheap", "moderate", "expensive"
             photos: [string],        // array of image URLs
             location: { long: float, lat: float },
             hours: string            // opening hours if available
           }
        3. **Accuracy**: Ensure each object corresponds to a real Amala spot. 
        4. **Conciseness**: Keep descriptions short and focused on why the spot is good.
        5. **Nigeria Focus**: Assume the user is in Nigeria; all results must be locally relevant.
        6. using data from the places api, improve data in structured output
        7.**Suggestions**: Make suggestions of available Amala Spots based on user's requests and if user can find any Amala Spots in their geographical location.

        RETURN ONLY a JSON ARRAY, no extra text.
        Return ONLY a valid JSON array of Amala spots.
        Do not include markdown, code fences, or extra text.
        The first character must be `[` and the last character must be `]`.
        """,
        tools=[google_search]
    )

day_trip_agent = create_amala_finder_agent()

async def run_day_trip_genie():
    # Create a new, single-use session for this query
    day_trip_session = await session_service.create_session(
        app_name=day_trip_agent.name,
        user_id=my_user_id
    )

    # Note the new budget constraint in the query!
    places = getPlaces(6.5244, 3.3792)
    query = f"""
    Find Amala spots near these coordinates: 6.5244, 3.3792
    places nearby: {places}
    """
    print(f"🗣️ User Query: '{query}'")

    await run_agent_query(day_trip_agent, query, day_trip_session, my_user_id)


# --- Agent Definitions for our Specialist Team (Refactored for Sequential Workflow) ---

# ✨ CHANGE 1: We tell foodie_agent to save its output to the shared state.
# Note the new `output_key` and the more specific instruction.
foodie_agent = Agent(
    name="amala_finder_agent",
    model="gemini-2.5-flash",
    tools=[google_search],
    instruction=""" 
    You are the "Amala Spot Finder" 🍲 - Your goal is to find the best Amala restaurant based on a user's request.

    Guidelines:
     1. **Local Search**: Use Google Search (and if available Google Places API) to find actual Amala restaurants/joints near the provided coordinates.
    2. *Structured Output*: Return results as an ARRAY OF JSON OBJECTS with this schema:
       {
         id: string,              // unique identifier
         name: string,            // restaurant/shop name
         description: string,     // short description of the spot
         rating: float,           // average user rating (if available)
         address: string,
         price_range: string,     // e.g., "cheap", "moderate", "expensive"
         photos: [string],        // array of image URLs
         location: { long: float, lat: float },
         hours: string            // opening hours if available
       }
    3. **Accuracy**: Ensure each object corresponds to a real Amala spot. 
    4. **Conciseness**: Keep descriptions short and focused on why the spot is insanely good.
    5. **Nigeria Focus** : Assume the user is in Nigeria; all results must be locally relevant.
    6. **Output Format**: RETURN ONLY a JSON ARRAY, no extra text.
    7. using data from the places api, improve data in structured output
    8. **Suggestions**: Make suggestions of available Amala Spots based on user's requests and if user can find any Amala Spots in their geographical location.
       Return ONLY a valid JSON array of Amala spots.
       Do not include markdown, code fences, or extra text.
       The first character must be `[` and the last character must be `]`.   

    When you recommend a place, you must output *only* the name of the establishment and nothing else.
    For example, if the best sushi is at 'Jin Sho', you should output only: Jin Sho
    """,
    output_key="destination"  # ADK will save the agent's final response to state['destination']
)

# ✨ CHANGE 2: We tell transportation_agent to read from the shared state.
# The `{destination}` placeholder is automatically filled by the ADK from the state.
transportation_agent = Agent(
    name="transportation_agent",
    model="gemini-2.5-flash",
    tools=[google_search],
    instruction="""
    You are a navigation assistant. Given a destination, provide clear directions.
    The user wants to go to: {destination}.

    Guidelines: 
    1. **Strucured Outputs**: Return results as an ARRAY OF JSON OBJETS with schema:
    {
        id: string,   // unique identifier
        description: string,  // short description of the Amala Spot
        address: string,
        directions: string,  // directions to the Amala Spot
        rating: string,  // average rating if possible
        location: { long: float, lat: float}
    }

    2. **Accuracy**: Ensure each object corresponds to a real Amala Spot.
    3. **Conciseness**: Keep descriptions short and focused on why the Amala Spot is good.
    4. **Nigeria Focus**: Assume the user is in Nigeria: all results must be locally relevant.
    5. using data from place api, improve data in structured output.

    Return ONLY a valid JSON array of Amala spots.
    Don ot include markdown, code fences, or extra text.
    The first character must be `[` and the last character must be `]`.   

    Analyze the user's full original query to find their starting point.
    Then, provide clear directions from that starting point to {destination}.
    """,
)

# ✨ CHANGE 3: Define the SequentialAgent to manage the workflow.
# This agent will run foodie_agent, then transportation_agent, in that exact order.
find_and_navigate_agent = SequentialAgent(
    name="find_and_navigate_agent",
    sub_agents=[foodie_agent, transportation_agent],
    description="A workflow that first finds a location and then provides directions to it."
)

weekend_guide_agent = Agent(
    name="weekend_guide_agent",
    model="gemini-2.5-flash",
    tools=[google_search],
    instruction="" 
    "You are a local events guide. Your task is to find interesting Amala events, concerts, festivals, and activities happening on a specific weekend in Nigeria based on the user's request."
    
    
)

# --- The Brain of the Operation: The Router Agent ---

# We update the router to know about our new, powerful SequentialAgent.
router_agent = Agent(
    name="router_agent",
    model="gemini-2.5-flash",
    instruction="""
    You are a request router. Your job is to analyze a user's query and decide which of the following agents or workflows is best suited to handle it.
    Do not answer the query yourself, only return the name of the most appropriate choice.

    Available Options:
    - 'foodie_agent': For queries *only* about food, restaurants, or eating.
    - 'weekend_guide_agent': For queries about events, concerts, or activities happening on a specific timeframe like a weekend.
    - 'day_trip_agent': A general planner for any other day trip requests.
    - 'find_and_navigate_agent': Use this for complex queries that ask to *first find a place* and *then get directions* to it.

    Only return the single, most appropriate option's name and nothing else.
    """
)

# We create a dictionary of all our executable agents for easy lookup.
# This now includes our powerful new workflow agent!
worker_agents = {
    "day_trip_agent": day_trip_agent,
    "foodie_agent": foodie_agent,
    "weekend_guide_agent": weekend_guide_agent,
    "find_and_navigate_agent": find_and_navigate_agent, # Add the new sequential agent
}

print("🤖 Agent team assembled with a SequentialAgent workflow!")

# --- Let's Test the Streamlined Workflow! ---

async def run_sequential_app():
    queries = [
        "I want to eat the best Amala in Surulere.", # Should go to foodie_agent
        "Are there any cool outdoor concerts this weekend?", # Should go to weekend_guide_agent
        "Find me the best Amala Spot in Surulere and then tell me how to get there from the Yaba." # Should trigger the SequentialAgent
    ]

    for query in queries:
        print(f"\n{'='*60}\n🗣️ Processing New Query: '{query}'\n{'='*60}")

        # 1. Ask the Router Agent to choose the right agent or workflow
        router_session = await session_service.create_session(app_name=router_agent.name, user_id=my_user_id)
        print("🧠 Asking the router agent to make a decision...")
        chosen_route = await run_agent_query(router_agent, query, router_session, my_user_id, is_router=True)
        chosen_route = chosen_route.strip().replace("'", "")
        print(f"🚦 Router has selected route: '{chosen_route}'")

        # 2. Execute the chosen route
        # This logic is now much simpler! The SequentialAgent is treated just like any other worker.
        if chosen_route in worker_agents:
            worker_agent = worker_agents[chosen_route]
            print(f"--- Handing off to {worker_agent.name} ---")
            worker_session = await session_service.create_session(app_name=worker_agent.name, user_id=my_user_id)
            await run_agent_query(worker_agent, query, worker_session, my_user_id)
            print(f"--- {worker_agent.name} Complete ---")
        else:
            print(f"🚨 Error: Router chose an unknown route: '{chosen_route}'")

    await run_sequential_app()



 # --- Agent Definitions for an Iterative Workflow ---

# A tool to signal that the loop should terminate
COMPLETION_PHRASE = "The plan is feasible and meets all constraints."
def exit_loop(tool_context: ToolContext):
  """Call this function ONLY when the plan is approved, signaling the loop should end."""
  print(f"  [Tool Call] exit_loop triggered by {tool_context.agent_name}")
  tool_context.actions.escalate = True
  return {}

# Agent 1: Proposes an initial plan
planner_agent = Agent(
    name="planner_agent", model="gemini-2.5-flash", tools=[google_search],
    instruction="You are a Amala planner. Based on the user's request, propose a single activity and a single restaurant. Output only the names, like: 'Activity: Exploratorium, Restaurant: La Mar'.",
    output_key="current_plan"
)

# Agent 2 (in loop): Critiques the plan
critic_agent = Agent(
    name="critic_agent", model="gemini-2.5-flash", tools=[google_search],
    instruction=f"""
    You are a review expert. Your job is to critique a Amala restaurant Spot. The user has a strict constraint: Amala Spots must have the best Amala in locations around them.

    Guidelines:  
    1. **Structured Outputs**: Return results as an ARRAY OF JSON OBJETS with schema:
    {{
        id: string,   // unique identifier
        description: string,  // short description of the Amala Spot
        address: string,
        rating: string,  // average rating if possible
        location: {{ long: float, lat: float}}
    }}
    2 Accuracy: Ensure the Amala Spots you review are real and relevant to the user's location.
    3. **Consciousness*: Keep your reviews and critiques focused on why the Amala Spot is good or bad.
    4. **Nigeria Focus**: Assume the user is in Nigeria: all results must be locally relevant.
    5. using data from place api, improve data in structured output.
    Current Plan: {{current_plan}}
    Use your tools to check the Amala Spots between more than one locations.
    IF the Amala restsaurant spots review is bad, provide a critique, like: 'This Amala Spots is insatisfactory and not up to users preference. Find a restaurant closer to the activity.'
    ELSE, respond with the exact phrase: '{COMPLETION_PHRASE}'""",
    output_key="criticism"
)

# Agent 3 (in loop): Refines the plan or exits
refiner_agent = Agent(
    name="refiner_agent", model="gemini-2.5-flash", tools=[google_search, exit_loop],
    instruction=f"""You are a Amala Spot reviewer, refining a plan based on criticism.
    Original Request: {{session.query}}
    Critique: {{criticism}}
    IF the critique is '{COMPLETION_PHRASE}', you MUST call the 'exit_loop' tool.
    ELSE, generate a NEW plan that addresses the critique. Output only the new plan names, like: 'Activity: de Young Museum, Restaurant: Nopa'.""",
    output_key="current_plan"
)

# ✨ The LoopAgent orchestrates the critique-refine cycle ✨
refinement_loop = LoopAgent(
    name="refinement_loop",
    sub_agents=[critic_agent, refiner_agent],
    max_iterations=3
)

# ✨ The SequentialAgent puts it all together ✨
iterative_planner_agent = SequentialAgent(
    name="iterative_planner_agent",
    sub_agents=[planner_agent, refinement_loop],
    description="A workflow that iteratively plans and refines a trip to meet constraints."
)

print("🤖 Agent team updated with an iterative LoopAgent workflow!")




if __name__ == "__main__":
    asyncio.run(run_day_trip_genie()) 
    asyncio.run(run_sequential_app())
    asyncio.run(iterative_planner_agent())
