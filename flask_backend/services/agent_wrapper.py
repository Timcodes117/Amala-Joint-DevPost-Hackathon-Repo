# services/agent_wrapper.py - Wrapper for Google ADK agents
import asyncio
import json
import re
from typing import Dict, Any, Union
from google.adk.sessions import InMemorySessionService, Session
from google.adk.runners import Runner

# Import your existing agent setup
from services.agent import (
    day_trip_agent,
    router_agent, 
    worker_agents,
    iterative_planner_agent,
    ai_agent as ai_agent_function,
    session_service,
    my_user_id,
    run_agent_query,
    extract_json_from_response
)

class GoogleADKAgentWrapper:
    """
    Wrapper class to make Google ADK agents work with Flask's synchronous routes
    """
    def __init__(self, adk_agent, session_service, user_id):
        self.adk_agent = adk_agent
        self.session_service = session_service
        self.user_id = user_id
    
    def run(self, query: str) -> Union[str, Dict[str, Any]]:
        """
        Synchronous wrapper that runs the async ADK agent
        """
        try:
            # Create a new event loop if one doesn't exist
            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            
            # Run the async agent query
            if loop.is_running():
                # If we're already in an async context, we need to use run_coroutine_threadsafe
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(self._run_async_agent, query)
                    return future.result(timeout=30)  # 30 second timeout
            else:
                # Run directly
                return loop.run_until_complete(self._run_async_agent(query))
        
        except Exception as e:
            return {
                "error": f"Agent execution failed: {str(e)}",
                "agent_name": self.adk_agent.name if hasattr(self.adk_agent, 'name') else 'Unknown',
                "query": query
            }
    
    async def _run_async_agent(self, query: str) -> Union[str, Dict[str, Any]]:
        """
        Async method to run the ADK agent
        """
        try:
            # Create a session for this specific query
            session = await self.session_service.create_session(
                app_name=self.adk_agent.name,
                user_id=self.user_id
            )
            
            # Run the agent query using your existing function
            response = await run_agent_query(
                self.adk_agent, 
                query, 
                session, 
                self.user_id
            )
            
            # Try to extract JSON if the response looks like JSON
            if isinstance(response, str):
                response_text = response.strip()
                if (response_text.startswith('[') and response_text.endswith(']')) or \
                   (response_text.startswith('{') and response_text.endswith('}')):
                    try:
                        return json.loads(response_text)
                    except json.JSONDecodeError:
                        try:
                            return extract_json_from_response(type('obj', (), {'parts': [type('part', (), {'text': response_text})]})())
                        except:
                            return response_text
            
            return response
            
        except Exception as e:
            raise Exception(f"Async agent execution failed: {str(e)}")

# Create wrapped versions of your agents
try:
    # Wrap the day_trip_agent (amala finder)
    wrapped_day_trip_agent = GoogleADKAgentWrapper(
        day_trip_agent, 
        session_service, 
        my_user_id
    )
    
    # Wrap the router agent
    wrapped_router_agent = GoogleADKAgentWrapper(
        router_agent,
        session_service,
        my_user_id
    )
    
    # Wrap the iterative planner agent
    wrapped_iterative_planner_agent = GoogleADKAgentWrapper(
        iterative_planner_agent,
        session_service,
        my_user_id
    )
    
    # Wrap worker agents
    wrapped_worker_agents = {}
    for key, agent in worker_agents.items():
        wrapped_worker_agents[key] = GoogleADKAgentWrapper(
            agent,
            session_service,
            my_user_id
        )
    
    print("✅ Google ADK agents wrapped successfully!")
    
except Exception as e:
    print(f"❌ Error wrapping agents: {e}")
    # Fallback to None values
    wrapped_day_trip_agent = None
    wrapped_router_agent = None
    wrapped_iterative_planner_agent = None
    wrapped_worker_agents = {}

# Export the wrapped agents for use in Flask routes
day_trip_agent_sync = wrapped_day_trip_agent
router_agent_sync = wrapped_router_agent
iterative_planner_agent_sync = wrapped_iterative_planner_agent
worker_agents_sync = wrapped_worker_agents

# The ai_agent function already works synchronously, so we can use it directly
ai_agent_sync = ai_agent_function