#!/usr/bin/env python3
"""
Test script for Cloudinary integration
Run this script to test if Cloudinary is properly configured
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv('config.env')

def test_cloudinary_config():
    """Test if Cloudinary credentials are properly configured"""
    print("Testing Cloudinary configuration...")
    
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    
    if not cloud_name:
        print("❌ CLOUDINARY_CLOUD_NAME not found in environment")
        return False
    
    if not api_key:
        print("❌ CLOUDINARY_API_KEY not found in environment")
        return False
    
    if not api_secret:
        print("❌ CLOUDINARY_API_SECRET not found in environment")
        return False
    
    print(f"✅ Cloud Name: {cloud_name}")
    print(f"✅ API Key: {api_key[:8]}...")
    print(f"✅ API Secret: {api_secret[:8]}...")
    
    return True

def test_cloudinary_import():
    """Test if Cloudinary can be imported"""
    print("\nTesting Cloudinary import...")
    
    try:
        import cloudinary
        import cloudinary.uploader
        import cloudinary.api
        print("✅ Cloudinary imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Failed to import Cloudinary: {e}")
        print("Run: pip install cloudinary")
        return False

def test_cloudinary_service():
    """Test if our Cloudinary service can be instantiated"""
    print("\nTesting Cloudinary service...")
    
    try:
        # Add the app directory to Python path
        sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))
        
        from services.cloudinary_service import CloudinaryService
        print("✅ CloudinaryService imported successfully")
        
        # Note: We can't actually instantiate it without Flask app context
        # but we can test the import
        return True
    except Exception as e:
        print(f"❌ Failed to import CloudinaryService: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Cloudinary Integration Test")
    print("=" * 40)
    
    tests = [
        test_cloudinary_config,
        test_cloudinary_import,
        test_cloudinary_service
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 40)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Cloudinary is ready to use.")
        print("\nNext steps:")
        print("1. Make sure your Cloudinary credentials are correct")
        print("2. Test the /api/stores/upload-image endpoint")
        print("3. Try uploading an image through the frontend")
    else:
        print("❌ Some tests failed. Please check the configuration.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
