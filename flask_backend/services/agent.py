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
from google.adk.tools import google_search, google_api_tool
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService, Session
from google.genai.types import Content, Part
from getpass import getpass
from helpers.agent_query import session_service, my_user_id, run_agent_query


api_key = 'AIzaSyBbZHx_zJZL8ga_JBxI8d7piyMyh1T7Rko'

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

if __name__ == "__main__":
    asyncio.run(run_day_trip_genie()) 