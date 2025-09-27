'use client'

// Minimal Firebase Web SDK integration for Google popup sign-in.
// Requires NEXT_PUBLIC_FIREBASE_* env vars and the 'firebase' package.

import type { FirebaseApp } from 'firebase/app'

let appPromise: Promise<FirebaseApp> | null = null

const FIREBASE_API_KEY="AIzaSyC2BXrd4F1r1NOTULaDlXgsKZipn5svUgg"
const FIREBASE_AUTH_DOMAIN="amala-joint.firebaseapp.com"
const FIREBASE_PROJECT_ID="amala-joint"
const FIREBASE_APP_ID="1:882538035251:web:1373fd47d0e7d9fe030b46"

async function getFirebaseApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    appPromise = (async () => {
      const [{ initializeApp, getApps }, { GoogleAuthProvider, getAuth } ] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth')
      ])

      const config = {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        appId: FIREBASE_APP_ID,
      }

      if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
        throw new Error('Missing NEXT_PUBLIC_FIREBASE_* environment variables. Please check your .env.local file.')
      }

      const app = getApps().length ? getApps()[0] : initializeApp(config)
      // Initialize auth to ensure compat
      getAuth(app)
      return app
    })()
  }
  return appPromise
}

export async function getIdTokenWithPopup(): Promise<string> {
  try {
    const [{ GoogleAuthProvider, getAuth, signInWithPopup }, app] = await Promise.all([
      import('firebase/auth'),
      getFirebaseApp(),
    ])
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    
    // Add custom parameters for better UX
    provider.addScope('email')
    provider.addScope('profile')
    
    const result = await signInWithPopup(auth, provider)
    const idToken = await result.user.getIdToken()
    return idToken
  } catch (error) {
    console.error('Firebase popup authentication error:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('popup-closed-by-user')) {
        throw new Error('Authentication cancelled by user')
      } else if (error.message.includes('popup-blocked')) {
        throw new Error('Popup blocked by browser. Please allow popups and try again.')
      } else if (error.message.includes('network-request-failed')) {
        throw new Error('Network error. Please check your internet connection.')
      } else if (error.message.includes('Missing NEXT_PUBLIC_FIREBASE_*')) {
        throw new Error('Firebase configuration missing. Please contact support.')
      }
    }
    
    throw error
  }
}


