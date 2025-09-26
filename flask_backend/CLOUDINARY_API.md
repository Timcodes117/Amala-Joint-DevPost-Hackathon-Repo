# Cloudinary Image Upload API

This document describes the Cloudinary integration for image uploads in the Amala app.

## Configuration

Add the following environment variables to your `config.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Endpoints

### 1. Upload Image
**POST** `/api/stores/upload-image`

Upload an image to Cloudinary.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `image` (file): Image file to upload
  - `folder` (string, optional): Cloudinary folder (default: "amala_uploads")

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/your_cloud/image/upload/v1234567890/amala_uploads/abc123.jpg",
    "public_id": "amala_uploads/abc123",
    "format": "jpg",
    "width": 800,
    "height": 600,
    "bytes": 45678
  }
}
```

### 2. Delete Image
**DELETE** `/api/stores/image/<public_id>`

Delete an image from Cloudinary.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Image deleted successfully"
  }
}
```

### 3. Get Image Info
**GET** `/api/stores/image/<public_id>/info`

Get information about an image.

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/your_cloud/image/upload/v1234567890/amala_uploads/abc123.jpg",
    "public_id": "amala_uploads/abc123",
    "format": "jpg",
    "width": 800,
    "height": 600,
    "bytes": 45678,
    "created_at": "2025-01-27T10:30:00Z"
  }
}
```

## Store Integration

### Adding a Store with Image
**POST** `/api/stores/add`

The store creation endpoint now automatically uploads images to Cloudinary:

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `name` (string): Store name
  - `phone` (string): Phone number
  - `location` (string): Store location
  - `opensAt` (string): Opening time
  - `closesAt` (string): Closing time
  - `description` (string): Store description
  - `image` (file, optional): Store image

**Response:**
```json
{
  "success": true,
  "data": {
    "store_id": "507f1f77bcf86cd799439011",
    "message": "Store added successfully and pending verification"
  },
  "store": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Amala Palace",
    "imageUrl": "https://res.cloudinary.com/your_cloud/image/upload/v1234567890/amala_stores/abc123.jpg",
    "cloudinary_public_id": "amala_stores/abc123",
    "is_verified": false,
    "verify_count": 0,
    "created_at": "2025-01-27T10:30:00Z"
  }
}
```

### Verifying a Store with Image
**POST** `/api/stores/<store_id>/verify`

The verification endpoint also supports image uploads:

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `reason` (string): Verification reason
  - `proofUrl` (string): Proof URL
  - `image` (file, optional): Proof image

## Image Optimization

Cloudinary automatically applies the following optimizations:

1. **Resize**: Images are resized to max 800x600 pixels
2. **Quality**: Auto quality optimization
3. **Format**: Auto format selection (WebP, AVIF when supported)
4. **Compression**: Automatic compression

## Folders

Images are organized in the following Cloudinary folders:

- `amala_stores/`: Store images
- `amala_verification/`: Verification proof images
- `amala_uploads/`: General uploads

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common error codes:
- `400`: Bad request (missing required fields)
- `500`: Internal server error (Cloudinary upload failed)

## Testing

Run the test script to verify Cloudinary configuration:

```bash
cd flask_backend
python test_cloudinary.py
```

## Security Notes

1. **API Keys**: Keep your Cloudinary API keys secure
2. **File Validation**: Only image files are accepted
3. **Size Limits**: Cloudinary has built-in size limits
4. **Access Control**: Consider implementing authentication for upload endpoints

## Usage Examples

### Frontend JavaScript
```javascript
// Upload image
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('folder', 'amala_stores');

const response = await fetch('/api/stores/upload-image', {
  method: 'POST',
  body: formData
});

const result = await response.json();
if (result.success) {
  console.log('Image URL:', result.data.url);
}
```

### Python Requests
```python
import requests

# Upload image
with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {'folder': 'amala_stores'}
    response = requests.post('http://localhost:5000/api/stores/upload-image', 
                           files=files, data=data)
    result = response.json()
    print(result['data']['url'])
```
