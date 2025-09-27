'use client'

/**
 * Safe geolocation access with proper error handling
 */
export interface GeolocationResult {
  lat: number
  lng: number
  error?: string
}

export const FALLBACK_LOCATION = { lat: 6.5244, lng: 3.3792 } // Lagos, Nigeria

/**
 * Safely get user's current location
 */
export function getCurrentLocation(): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser')
      resolve({ ...FALLBACK_LOCATION, error: 'Geolocation not supported' })
      return
    }

    // Check if we're in a secure context (HTTPS or localhost)
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      console.warn('Geolocation requires HTTPS in production')
      resolve({ ...FALLBACK_LOCATION, error: 'HTTPS required for geolocation' })
      return
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000, // 5 minutes
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.warn('Geolocation error:', error.message)
        let errorMessage = 'Location access denied'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        
        resolve({ ...FALLBACK_LOCATION, error: errorMessage })
      },
      options
    )
  })
}

/**
 * Check if geolocation is available
 */
export function isGeolocationAvailable(): boolean {
  return 'geolocation' in navigator && window.isSecureContext
}
