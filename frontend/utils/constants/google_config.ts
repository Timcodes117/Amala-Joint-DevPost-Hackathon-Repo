// Google OAuth Configuration for Expo Managed Workflow
export const GOOGLE_CONFIG = {
  CLIENT_ID: "845567143902-82ounl7k8r3oa0b2a09l2h2ritjse7cv.apps.googleusercontent.com",
  
  // OAuth scopes
  SCOPES: ["openid", "profile", "email"],
  
  // Discovery endpoints
  DISCOVERY: {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
  }
};

// ✅ EXPO SETUP INSTRUCTIONS:
// 1. Go to Google Cloud Console (https://console.cloud.google.com/)
// 2. Create a new project or select an existing one
// 3. Enable the Google+ API (or Google Identity API)
// 4. Go to "Credentials" → Create credentials → OAuth client ID → Web application
// 5. Add this redirect URI: https://auth.expo.io/@your-username/your-app-slug
//    - Replace "your-username" with your Expo username
//    - Replace "your-app-slug" with your app's slug from app.json
//    - Example: https://auth.expo.io/@timcodes/myapp
// 6. Copy the Web Client ID and use it above
// 7. The useProxy: true option in makeRedirectUri() handles the Expo redirect automatically
