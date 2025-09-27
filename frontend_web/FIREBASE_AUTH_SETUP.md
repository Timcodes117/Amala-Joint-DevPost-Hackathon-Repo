# Firebase Authentication Setup Guide

## 🚨 Critical: Environment Variables Required

Your Firebase authentication will fail without these environment variables. Create a `.env.local` file in your `frontend_web` directory with:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🔧 How to Get Firebase Config Values:

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project** (or create one if you don't have one)
3. **Go to Project Settings** (gear icon)
4. **Scroll to "Your apps" section**
5. **Click on your web app** (or create one if needed)
6. **Copy the config values** from the Firebase config object

## 🔧 Backend Firebase Setup:

For the backend, you need to set up Firebase Admin SDK:

1. **Go to Firebase Console > Project Settings > Service Accounts**
2. **Click "Generate new private key"**
3. **Download the JSON file**
4. **Set environment variable** in your backend:
   ```bash
   FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
   ```

## 🧪 Testing Firebase Auth:

### Frontend Test:
1. Start your frontend: `npm run dev`
2. Go to `/auth/login` or `/auth/signup`
3. Click "Login with Google" or "Continue with Google"
4. Should open Google popup for authentication

### Backend Test:
1. Start your backend Flask server
2. The `/api/auth/google` endpoint should handle the ID token
3. Check logs for any Firebase initialization errors

## 🐛 Common Issues:

### Issue 1: "Missing NEXT_PUBLIC_FIREBASE_* environment variables"
**Solution**: Create `.env.local` file with proper Firebase config

### Issue 2: "Firebase credentials not configured properly"
**Solution**: Set `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable in backend

### Issue 3: "Invalid Firebase token"
**Solution**: Check if Firebase project is properly configured and tokens are valid

### Issue 4: Popup blocked by browser
**Solution**: Ensure popup is triggered by user interaction (button click)

## 📋 Current Implementation Status:

✅ **Frontend Firebase SDK**: Properly installed and configured
✅ **Popup Authentication**: Correctly implemented with `signInWithPopup`
✅ **Error Handling**: Comprehensive error handling
✅ **UI Components**: Google Auth buttons on both login and signup pages
✅ **Backend Integration**: Proper Firebase Admin SDK integration
✅ **Token Verification**: Correct ID token verification
✅ **User Management**: Automatic user creation/update

❌ **Environment Variables**: Missing Firebase configuration
❌ **Backend Firebase Config**: Missing service account configuration

## 🎯 Next Steps:

1. **Set up Firebase project** (if not already done)
2. **Create `.env.local`** with Firebase config values
3. **Configure backend** with Firebase service account
4. **Test authentication flow** end-to-end
5. **Handle any remaining configuration issues**

## 🔍 Code Review Summary:

Your Firebase authentication implementation is **architecturally sound** and follows best practices. The main issue is **missing configuration**, not code problems. Once you add the environment variables, it should work perfectly.
