#!/usr/bin/env python3
"""
Test script to verify the updated Flask backend works without MongoDB
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_backend():
    print("🧪 Testing Updated Flask Backend (No MongoDB)...")
    print("=" * 50)
    
    try:
        # Test home endpoint
        print("1. Testing home endpoint...")
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Home endpoint working")
            print(f"   📊 Message: {data.get('message', 'Unknown')}")
            print(f"   👥 Test users: {len(data.get('test_users', []))}")
        else:
            print(f"   ❌ Home endpoint failed: {response.status_code}")
            return False
        
        # Test health endpoint
        print("\n2. Testing health endpoint...")
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Health check passed")
            print(f"   📊 Database: {data.get('database', 'Unknown')}")
            print(f"   👥 Users count: {data.get('users_count', 'Unknown')}")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            return False
        
        # Test login with dummy user
        print("\n3. Testing login...")
        login_data = {
            "email": "john@example.com",
            "password": "password123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("   ✅ Login successful")
                access_token = data['data']['access_token']
                print(f"   🔑 Got access token: {access_token[:20]}...")
                user = data['data']['user']
                print(f"   👤 User: {user['name']} ({user['email']})")
            else:
                print(f"   ❌ Login failed: {data.get('error')}")
                return False
        else:
            print(f"   ❌ Login failed: {response.status_code}")
            return False
        
        # Test getting user info
        print("\n4. Testing get user info...")
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                user = data['data']
                print(f"   ✅ Got user info: {user['name']} ({user['email']})")
            else:
                print(f"   ❌ Get user info failed: {data.get('error')}")
                return False
        else:
            print(f"   ❌ Get user info failed: {response.status_code}")
            return False
        
        # Test signup
        print("\n5. Testing signup...")
        signup_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "test123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
        if response.status_code == 201:
            data = response.json()
            if data.get('success'):
                print("   ✅ Signup successful")
                print(f"   👤 Created user: {data['data']['user']['name']}")
            else:
                print(f"   ❌ Signup failed: {data.get('error')}")
                return False
        else:
            print(f"   ❌ Signup failed: {response.status_code}")
            return False
        
        print("\n🎉 All tests passed! Backend is working correctly.")
        print("\n🔐 Test Credentials:")
        print("   Email: john@example.com, Password: password123")
        print("   Email: jane@example.com, Password: password123")
        print("   Email: amala@example.com, Password: amala123")
        print("\n📱 Your frontend should work perfectly with this backend!")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend. Make sure it's running on http://localhost:5000")
        print("\n💡 Start the backend with:")
        print("   python app.py")
        return False
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        return False

if __name__ == "__main__":
    success = test_backend()
    if not success:
        print("\n💡 Make sure to start the backend first:")
        print("   cd flask_backend")
        print("   python app.py")
        exit(1)
