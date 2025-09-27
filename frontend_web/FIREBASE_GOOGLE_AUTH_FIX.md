# 🔥 Firebase Google Authentication Fix Guide

## 🚨 **Current Error**: `Firebase: Error (auth/configuration-not-found)`

This error means **Google Authentication is not enabled** in your Firebase project.

## ✅ **Step-by-Step Fix:**

### 1. **Enable Google Authentication in Firebase Console**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `amala-joint`
3. **Navigate to Authentication**:
   - Click on "Authentication" in the left sidebar
   - Click on "Sign-in method" tab
4. **Enable Google Provider**:
   - Find "Google" in the list of providers
   - Click on it
   - **Toggle "Enable" to ON**
   - Click "Save"

### 2. **Verify Project Configuration**

Your current Firebase config in `utils/firebase.ts`:
```typescript
const FIREBASE_API_KEY="AIzaSyC2BXrd4F1r1NOTULaDlXgsKZipn5svUgg"
const FIREBASE_AUTH_DOMAIN="amala-joint.firebaseapp.com"
const FIREBASE_PROJECT_ID="amala-joint"
const FIREBASE_APP_ID="1:882538035251:web:1373fd47d0e7d9fe030b46"
```

### 3. **Check Authorized Domains**

In Firebase Console > Authentication > Sign-in method:
- Scroll down to "Authorized domains"
- Ensure these domains are listed:
  - `localhost` (for development)
  - `amala-joint.vercel.app` (for production)
  - Any other domains you're using

### 4. **Verify OAuth Configuration**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select the same project**: `amala-joint`
3. **Navigate to APIs & Services > Credentials**
4. **Check OAuth 2.0 Client IDs**:
   - Should have a "Web client" for Firebase
   - Should have your domain in "Authorized JavaScript origins"

### 5. **Test the Fix**

After enabling Google Authentication:

1. **Restart your development server**:
   ```bash
   cd frontend_web
   npm run dev
   ```

2. **Test Google Sign-in**:
   - Go to `/auth/login` or `/auth/signup`
   - Click "Continue with Google" or "Login with Google"
   - Should open Google popup for authentication

## 🔍 **Common Issues & Solutions:**

### Issue 1: "Google provider not found"
**Solution**: Enable Google Authentication in Firebase Console

### Issue 2: "Domain not authorized"
**Solution**: Add your domain to Firebase Authorized domains

### Issue 3: "OAuth client not configured"
**Solution**: Check Google Cloud Console OAuth settings

### Issue 4: "API key restrictions"
**Solution**: Ensure Firebase Auth API is enabled for your API key

## 🎯 **Expected Result:**

After following these steps:
- ✅ Google Authentication popup should open
- ✅ User should be able to sign in with Google
- ✅ ID token should be generated successfully
- ✅ User should be redirected to home page

## 🚀 **Quick Test:**

1. Enable Google Auth in Firebase Console
2. Restart your dev server
3. Try the Google sign-in button
4. Should work immediately!

---

**Note**: The code is already properly configured. The issue is purely on the Firebase project settings side.
