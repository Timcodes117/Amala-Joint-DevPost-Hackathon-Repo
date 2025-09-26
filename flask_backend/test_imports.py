#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
"""

def test_imports():
    print("Testing Flask app imports...")
    
    try:
        from app import create_app
        print("✅ Flask app import successful")
        
        app = create_app()
        print("✅ Flask app creation successful")
        
        # Test that we can import the stores blueprint
        from app.routes.stores import stores_bp
        print("✅ Stores blueprint import successful")
        
        # Test that we can import the agent functions
        from services.agent import ai_agent
        print("✅ AI agent import successful")
        
        # Test that we can import translate functions
        from helpers.translate_helper import translate_text, detect_language
        print("✅ Translate helper import successful")
        
        print("\n🎉 All imports working correctly!")
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_imports()
    exit(0 if success else 1)
