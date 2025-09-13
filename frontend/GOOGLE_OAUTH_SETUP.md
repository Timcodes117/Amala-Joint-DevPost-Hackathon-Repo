# Google OAuth Setup Instructions for Expo Managed Workflow

## Overview
This app now includes Google OAuth authentication using `expo-auth-session` with Expo's managed workflow. Users can sign in with their Google accounts to access the app.

## Setup Steps

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (or Google Identity API)
4. Go to "Credentials" → Create credentials → OAuth client ID → **Web application**

### 2. Configure OAuth Client (Expo Managed Workflow)
1. **Important**: Choose "Web application" (not Android/iOS for Expo managed workflow)
2. Add this redirect URI: `https://auth.expo.io/@your-username/amav1`
   - Replace `your-username` with your Expo username
   - Your app slug is `amav1` (from app.json)
   - Example: `https://auth.expo.io/@timcodes/amav1`
3. Copy the Web Client ID

### 3. Update Configuration
1. Open `utils/constants/google_config.ts`
2. Replace the Client ID with your Web Client ID
3. Save the file

### 4. Test the Implementation
1. Run the app: `npm start`
2. Navigate to the login screen
3. Tap "Sign in with Google"
4. Complete the OAuth flow
5. Verify that you're redirected to the home screen
6. Check the profile screen to see your Google account information

## Features Implemented

### ✅ Auth Context (`contexts/auth.tsx`)
- Google OAuth authentication using `expo-auth-session`
- User state management
- Loading states
- Automatic navigation after successful login
- Sign out functionality

### ✅ Login Screen (`app/(auth)/login.tsx`)
- Integrated Google sign-in button
- Loading indicator during authentication
- Disabled state during loading

### ✅ Profile Screen (`app/home_screen/profile.tsx`)
- Displays authenticated user information
- Shows Google profile picture
- Sign out functionality

### ✅ App Layout (`app/_layout.tsx`)
- AuthProvider wrapper for the entire app
- Proper context hierarchy

## Configuration File
The Google OAuth configuration is centralized in `utils/constants/google_config.ts` for easy management.

## Dependencies
- `expo-auth-session`: Already installed in package.json
- `expo-web-browser`: Required for OAuth flow completion

## Troubleshooting
- Make sure your Google Client ID is correctly configured
- Verify that your app's bundle identifier matches what's configured in Google Cloud Console
- Check that the Google+ API is enabled in your Google Cloud project
- Ensure your redirect URI is properly configured (expo-auth-session handles this automatically)
