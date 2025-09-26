# Firebase Setup Guide

## Issues Found and Fixed

### 1. Backend Firebase Configuration Issues ✅ FIXED
- **Problem**: Firebase Admin SDK was not properly initialized
- **Solution**: Updated `flask_backend/app/routes/auth.py` to properly handle Firebase service account credentials
- **Solution**: Added Firebase configuration to `flask_backend/app/config.py`

### 2. Missing Environment Variables ❌ NEEDS SETUP
- **Problem**: Frontend Firebase configuration expects environment variables that are not set
- **Required Variables**:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

## Setup Instructions

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Authentication > Sign-in method > Google

### Step 2: Get Firebase Web App Configuration
1. In Firebase Console, go to Project Settings > General
2. Scroll down to "Your apps" section
3. Click "Add app" > Web app
4. Copy the configuration object:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  appId: "your-app-id"
};
```

### Step 3: Set Frontend Environment Variables
Create `frontend_web/.env.local` with:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 4: Get Firebase Service Account Key
1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Convert the JSON to a single-line string and add to `flask_backend/config.env`:
```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"your-project-id",...}
```

### Step 5: Test Firebase Integration
1. Start the backend: `cd flask_backend && python wsgi.py`
2. Start the frontend: `cd frontend_web && npm run dev`
3. Try Google login on the frontend

## Current Status
- ✅ Backend Firebase Admin SDK configuration fixed
- ✅ Frontend Firebase client configuration exists
- ❌ Environment variables need to be set
- ❌ Firebase project needs to be created and configured

## Next Steps
1. Create Firebase project
2. Set up environment variables
3. Test the integration
4. Deploy with proper environment variables
