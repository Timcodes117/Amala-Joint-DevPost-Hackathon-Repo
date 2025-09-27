#!/usr/bin/env python3
"""
Simple test script to verify Swagger setup
"""
import sys
import os

# Add the flask_backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_swagger_yaml():
    """Test if swagger.yaml can be loaded"""
    try:
        import yaml
        yaml_path = os.path.join(os.path.dirname(__file__), 'swagger.yaml')
        
        if not os.path.exists(yaml_path):
            print("❌ swagger.yaml file not found")
            return False
            
        with open(yaml_path, 'r', encoding='utf-8') as file:
            yaml_content = yaml.safe_load(file)
            
        print("✅ swagger.yaml loaded successfully")
        print(f"   - Title: {yaml_content.get('info', {}).get('title', 'N/A')}")
        print(f"   - Version: {yaml_content.get('info', {}).get('version', 'N/A')}")
        print(f"   - Paths: {len(yaml_content.get('paths', {}))}")
        return True
        
    except Exception as e:
        print(f"❌ Error loading swagger.yaml: {e}")
        return False

def test_swagger_routes():
    """Test if Swagger routes can be imported"""
    try:
        from app.routes.swagger import swagger_bp
        print("✅ Swagger routes imported successfully")
        return True
    except Exception as e:
        print(f"❌ Error importing Swagger routes: {e}")
        return False

def test_flask_restx():
    """Test if Flask-RESTX is available"""
    try:
        from flask_restx import Api
        print("✅ Flask-RESTX is available")
        return True
    except Exception as e:
        print(f"❌ Flask-RESTX not available: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Swagger Setup...")
    print("=" * 50)
    
    tests = [
        test_flask_restx,
        test_swagger_yaml,
        test_swagger_routes,
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Swagger setup is ready.")
        print("\n📚 Available endpoints:")
        print("   - Swagger UI: http://localhost:5000/api/docs")
        print("   - Swagger YAML: http://localhost:5000/api/docs/swagger.yaml")
        print("   - Swagger JSON: http://localhost:5000/api/docs/swagger.json")
    else:
        print("⚠️ Some tests failed. Check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

