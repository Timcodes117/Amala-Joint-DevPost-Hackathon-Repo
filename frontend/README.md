# Frontend - Amala App

A React Native frontend with Expo Router for the Amala app, integrated with Flask backend authentication.

## Features

- ✅ React Native with Expo Router
- ✅ Authentication screens (Login/Signup)
- ✅ Google OAuth integration
- ✅ Email/Password authentication
- ✅ JWT token management
- ✅ AsyncStorage for token persistence
- ✅ TypeScript support
- ✅ Modern UI components

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm start
```

### 3. Run on Device/Simulator

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Authentication Integration

The app is now connected to the Flask backend with the following features:

### API Configuration

The API base URL is configured in `utils/api.ts`:
```typescript
const API_BASE_URL = "http://localhost:5000";
```

### Authentication Service

The `utils/auth_service.ts` file contains all authentication functions:
- `login()` - Login with email/password
- `signup()` - Register new user
- `getCurrentUser()` - Get current user info
- `verifyToken()` - Verify JWT token
- `refreshToken()` - Refresh access token

### Auth Context

The `contexts/auth.tsx` provides authentication state management:
- `signInWithEmail()` - Login with email/password
- `signUpWithEmail()` - Register new user
- `signInWithGoogle()` - Google OAuth login
- `signOut()` - Logout user
- `checkAuthStatus()` - Check if user is logged in

### Login Screen

The login screen (`app/(auth)/login.tsx`) now includes:
- Email/password input fields
- Form validation
- Backend integration
- Loading states
- Error handling

### Signup Screen

The signup screen (`app/(auth)/signup.tsx`) now includes:
- First name, last name, email, password fields
- Form validation
- Backend integration
- Loading states
- Error handling

## Test Credentials

Use these credentials to test the app:

- **Email:** john@example.com, **Password:** password123
- **Email:** jane@example.com, **Password:** password123  
- **Email:** amala@example.com, **Password:** amala123

## Backend Setup

Make sure the Flask backend is running:

```bash
cd ../flask_backend
python start_server.py
```

The backend should be running at `http://localhost:5000`

## Dependencies

- React Native
- Expo Router
- AsyncStorage
- Axios
- Google Sign-In
- TypeScript

## Project Structure

```
frontend/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   └── signup.tsx     # Signup screen
│   └── home_screen/       # Main app screens
├── components/            # Reusable components
│   └── auth_screens/      # Auth-specific components
├── contexts/              # React contexts
│   └── auth.tsx           # Authentication context
├── utils/                 # Utility functions
│   ├── api.ts             # API configuration
│   └── auth_service.ts    # Authentication service
└── package.json           # Dependencies
```

## Environment Variables

For Google OAuth, make sure to configure:
- `GOOGLE_CLIENT_ID` in `utils/constants/google_config.ts`
- Update `app.json` with your OAuth configuration

## Notes

- The app automatically checks authentication status on startup
- Tokens are stored securely using AsyncStorage
- The app handles token refresh automatically
- Error messages are displayed to users
- Loading states are shown during API calls
