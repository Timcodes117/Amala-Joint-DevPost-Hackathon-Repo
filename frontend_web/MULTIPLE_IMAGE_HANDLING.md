# Multiple Image Handling Implementation

## 🖼️ **Image Types Handled**

### **1. Google Places Images**
- **Source**: Google Places API with photo_reference tokens
- **URL Format**: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={token}&key={API_KEY}`
- **Handling**: Convert photo_reference to actual image URLs
- **Limit**: Maximum 4 images per place

### **2. User-Uploaded Images**
- **Source**: Users uploading images when adding stores
- **Storage**: Cloudinary cloud storage
- **Format**: Direct image URLs from Cloudinary
- **Limit**: Maximum 4 images per store

## 🔧 **Backend Changes (stores.py)**

### **Multiple Image Upload Support:**
```python
# Handle multiple file uploads (max 4 images)
image_urls = []
upload_results = []

# Get all uploaded files
for key in request.files:
    if key.startswith('image') and request.files[key].filename:
        uploaded_files.append(request.files[key])

# Validate number of images
if len(uploaded_files) > 4:
    return jsonify({'success': False, 'error': 'Maximum 4 images allowed.'}), 400
```

### **Store Document Structure:**
```python
store_doc = {
    'imageUrls': image_urls,  # Array of image URLs (max 4)
    'imageUrl': image_urls[0] if image_urls else None,  # Primary image for backward compatibility
    'cloudinary_public_ids': [result.get('public_id') for result in upload_results],
    'cloudinary_public_id': upload_results[0].get('public_id') if upload_results else None,
    # ... other fields
}
```

### **New API Endpoints:**

#### **1. Single Image Upload:**
- **Endpoint**: `POST /api/stores/upload-image`
- **Purpose**: Upload single image
- **Response**: Image URL and metadata

#### **2. Multiple Image Upload:**
- **Endpoint**: `POST /api/stores/upload-images`
- **Purpose**: Upload up to 4 images
- **Response**: Array of image URLs and metadata

### **Validation Rules:**
- **File Types**: PNG, JPG, JPEG, GIF, WebP only
- **File Size**: Maximum 5MB per image
- **Image Count**: Maximum 4 images per store
- **Error Handling**: Detailed error messages for each validation failure

## 🎨 **Frontend Changes (page.tsx)**

### **Image URL Handling:**
```typescript
const imageUrls = useMemo(() => {
    if (isAmalaStore) {
        // For Amala stores, use imageUrls array if available
        if (amalaStoreDetails?.imageUrls && amalaStoreDetails.imageUrls.length > 0) {
            return amalaStoreDetails.imageUrls.slice(0, 4) // Limit to 4 images
        } else if (amalaStoreDetails?.imageUrl) {
            return [amalaStoreDetails.imageUrl] // Fallback to single image
        }
        return ['/images/amala-billboard.png'] // Default fallback
    } else if (placeDetails?.photos?.length) {
        // For Google Places, convert photo references to URLs
        return placeDetails.photos
            .filter((photo, index) => index < 4) // Limit to 4 images
            .map(photo => getPhotoUrl(photo.photo_reference))
    }
    return ['/images/amala-billboard.png']
}, [isAmalaStore, amalaStoreDetails?.imageUrls, amalaStoreDetails?.imageUrl, placeDetails?.photos, getPhotoUrl])
```

### **Type Definitions:**
```typescript
interface AmalaStoreDetails {
    imageUrl?: string  // Primary image for backward compatibility
    imageUrls?: string[]  // Array of all images (max 4)
    // ... other fields
}
```

## 📊 **Image Processing Flow**

### **Google Places Images:**
1. **API Call**: Fetch place details with photo_reference tokens
2. **URL Generation**: Convert tokens to actual image URLs using Google API
3. **Display**: Show images in carousel with loading states
4. **Fallback**: Default image if no photos available

### **User-Uploaded Images:**
1. **Upload**: Multiple images uploaded to Cloudinary
2. **Validation**: File type, size, and count validation
3. **Storage**: Images stored with public URLs
4. **Database**: URLs stored in `imageUrls` array
5. **Display**: Images shown in carousel

## 🚀 **Performance Optimizations**

### **Image Loading:**
- **Preloading**: Images load in background while showing loading state
- **Progressive Loading**: Images appear as they become available
- **Error Handling**: Graceful fallback for failed image loads
- **Caching**: Memoized image URL generation

### **API Efficiency:**
- **Batch Upload**: Multiple images uploaded in single request
- **Validation**: Server-side validation before processing
- **Error Recovery**: Detailed error messages for debugging

## 🧪 **Testing Scenarios**

### **Google Places Images:**
1. Test with places that have photos
2. Test with places that have no photos
3. Test with invalid photo_reference tokens
4. Test with missing API key

### **User-Uploaded Images:**
1. Upload 1-4 valid images
2. Try to upload more than 4 images
3. Upload invalid file types
4. Upload oversized files
5. Test with no images

### **Mixed Scenarios:**
1. Store with both Google and user images
2. Store with only Google images
3. Store with only user images
4. Store with no images

## 🎯 **Expected Results**

- **Flexible Image Handling**: Support for both Google Places and user-uploaded images
- **Multiple Image Support**: Up to 4 images per store
- **Better Performance**: Optimized loading and caching
- **Robust Error Handling**: Graceful fallbacks and detailed error messages
- **Backward Compatibility**: Existing single image stores still work

The system now properly handles both Google Places images (with photo_reference tokens) and user-uploaded images, with support for up to 4 images per store!
