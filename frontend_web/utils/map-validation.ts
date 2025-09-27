'use client'

/**
 * Validates Google Maps API key and provides fallback behavior
 */
export function validateGoogleMapsKey(): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  
  if (!apiKey) {
    console.warn('NEXT_PUBLIC_GOOGLE_MAPS_KEY is not set. Maps will not work properly.')
    return null
  }
  
  if (apiKey.length < 20) {
    console.warn('Google Maps API key appears to be invalid (too short).')
    return null
  }
  
  return apiKey
}

/**
 * Safe wrapper for Google Maps API loader
 */
export function createSafeMapLoader() {
  const apiKey = validateGoogleMapsKey()
  
  if (!apiKey) {
    return {
      isLoaded: false,
      loadError: new Error('Google Maps API key is not configured properly'),
    }
  }
  
  return null // Let the actual loader handle this
}
