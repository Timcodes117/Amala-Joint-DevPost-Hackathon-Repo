import cloudinary
import cloudinary.uploader
import cloudinary.api
from flask import current_app
import os
from typing import Optional, Dict, Any
import base64
from io import BytesIO

class CloudinaryService:
    def __init__(self):
        self.cloud_name = current_app.config.get('CLOUDINARY_CLOUD_NAME')
        self.api_key = current_app.config.get('CLOUDINARY_API_KEY')
        self.api_secret = current_app.config.get('CLOUDINARY_API_SECRET')
        
        if not all([self.cloud_name, self.api_key, self.api_secret]):
            raise ValueError("Cloudinary credentials not properly configured")
        
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=self.cloud_name,
            api_key=self.api_key,
            api_secret=self.api_secret
        )
    
    def upload_image(self, file, folder: str = "amala_stores", public_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Upload an image file to Cloudinary
        
        Args:
            file: File object from Flask request
            folder: Cloudinary folder to store the image
            public_id: Optional custom public ID for the image
            
        Returns:
            Dict containing upload result with URL and metadata
        """
        try:
            # Generate public_id if not provided
            if not public_id:
                import uuid
                public_id = f"{folder}/{uuid.uuid4().hex}"
            
            # Upload options
            upload_options = {
                'folder': folder,
                'public_id': public_id,
                'resource_type': 'image',
                'transformation': [
                    {'width': 800, 'height': 600, 'crop': 'limit'},  # Resize for optimization
                    {'quality': 'auto'},  # Auto quality optimization
                ],
            }
            
            # Upload the file
            result = cloudinary.uploader.upload(
                file,
                **upload_options
            )
            
            return {
                'success': True,
                'url': result['secure_url'],
                'public_id': result['public_id'],
                'format': result['format'],
                'width': result['width'],
                'height': result['height'],
                'bytes': result['bytes'],
                'created_at': result['created_at']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def upload_from_base64(self, base64_string: str, folder: str = "amala_stores", public_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Upload an image from base64 string to Cloudinary
        
        Args:
            base64_string: Base64 encoded image string
            folder: Cloudinary folder to store the image
            public_id: Optional custom public ID for the image
            
        Returns:
            Dict containing upload result with URL and metadata
        """
        try:
            # Generate public_id if not provided
            if not public_id:
                import uuid
                public_id = f"{folder}/{uuid.uuid4().hex}"
            
            # Upload options
            upload_options = {
                'folder': folder,
                'public_id': public_id,
                'resource_type': 'image',
                'transformation': [
                    {'width': 800, 'height': 600, 'crop': 'limit'},
                    {'quality': 'auto'},
                ],
                'format': 'auto',
            }
            
            # Upload from base64
            result = cloudinary.uploader.upload(
                base64_string,
                **upload_options
            )
            
            return {
                'success': True,
                'url': result['secure_url'],
                'public_id': result['public_id'],
                'format': result['format'],
                'width': result['width'],
                'height': result['height'],
                'bytes': result['bytes'],
                'created_at': result['created_at']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def delete_image(self, public_id: str) -> Dict[str, Any]:
        """
        Delete an image from Cloudinary
        
        Args:
            public_id: Public ID of the image to delete
            
        Returns:
            Dict containing deletion result
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            
            return {
                'success': result.get('result') == 'ok',
                'result': result.get('result'),
                'public_id': public_id
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_image_info(self, public_id: str) -> Dict[str, Any]:
        """
        Get information about an image
        
        Args:
            public_id: Public ID of the image
            
        Returns:
            Dict containing image information
        """
        try:
            result = cloudinary.api.resource(public_id)
            
            return {
                'success': True,
                'url': result['secure_url'],
                'public_id': result['public_id'],
                'format': result['format'],
                'width': result['width'],
                'height': result['height'],
                'bytes': result['bytes'],
                'created_at': result['created_at']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_thumbnail_url(self, public_id: str, width: int = 300, height: int = 200) -> str:
        """
        Generate a thumbnail URL for an image
        
        Args:
            public_id: Public ID of the image
            width: Thumbnail width
            height: Thumbnail height
            
        Returns:
            Thumbnail URL
        """
        try:
            url = cloudinary.CloudinaryImage(public_id).build_url(
                transformation=[
                    {'width': width, 'height': height, 'crop': 'fill'},
                    {'quality': 'auto'},
                ]
            )
            return url
        except Exception as e:
            return ""
    
    def generate_optimized_url(self, public_id: str, width: int = 800, height: int = 600) -> str:
        """
        Generate an optimized URL for an image
        
        Args:
            public_id: Public ID of the image
            width: Desired width
            height: Desired height
            
        Returns:
            Optimized image URL
        """
        try:
            url = cloudinary.CloudinaryImage(public_id).build_url(
                transformation=[
                    {'width': width, 'height': height, 'crop': 'limit'},
                    {'quality': 'auto'},
                ]
            )
            return url
        except Exception as e:
            return ""


# Utility function to get Cloudinary service instance
def get_cloudinary_service() -> CloudinaryService:
    """Get a Cloudinary service instance"""
    return CloudinaryService()
