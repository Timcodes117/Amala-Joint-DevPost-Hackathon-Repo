#!/usr/bin/env python3
"""
Flask Backend Startup Script with Dummy Data
This script starts the Flask backend with in-memory storage (no MongoDB required!)
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('config.env')

def main():
    """Main function to start the Flask app"""
    print("🚀 Starting Flask Backend with In-Memory Storage...")
    print("📱 No MongoDB required - using in-memory storage!")
    print("")
    
    # Start Flask app
    print("🌐 Starting Flask server...")
    from app import app
    
    PORT = int(os.getenv('PORT', 5000))
    HOST = os.getenv('HOST', '0.0.0.0')
    
    print(f"📡 Server running at: http://{HOST}:{PORT}")
    print("🔗 API Endpoints:")
    print(f"   - Health Check: http://{HOST}:{PORT}/api/health")
    print(f"   - Login: http://{HOST}:{PORT}/api/auth/login")
    print(f"   - Signup: http://{HOST}:{PORT}/api/auth/signup")
    print(f"   - User Info: http://{HOST}:{PORT}/api/auth/me")
    print("")
    print("🔐 Test Credentials:")
    print("   Email: john@example.com, Password: password123")
    print("   Email: jane@example.com, Password: password123")
    print("   Email: amala@example.com, Password: amala123")
    print("")
    print("💡 Press Ctrl+C to stop the server")
    print("")
    
    app.run(debug=True, host=HOST, port=PORT)

if __name__ == '__main__':
    main()
