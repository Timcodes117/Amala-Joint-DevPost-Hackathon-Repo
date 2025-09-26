'use client'

import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react'

export interface Place {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  price_level?: number
  opening_hours?: {
    open_now: boolean
  }
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
    html_attributions?: string[]
  }>
}

export interface LocationState {
  latitude: number | null
  longitude: number | null
  address: string | null
  places: Place[]
  isLoading: boolean
  error: string | null
}

type AppContextValue = {
  locale: string
  setLocale: (v: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (v: boolean) => void
  location: LocationState
  getCurrentLocation: () => Promise<void>
  getNearbyPlaces: (lat: number, lng: number) => Promise<void>
  clearLocationError: () => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>('en')
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    address: null,
    places: [],
    isLoading: false,
    error: null
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    console.log('getCurrentLocation called')
    
    if (!navigator.geolocation) {
      console.log('Geolocation not supported')
      setLocation(prev => ({ ...prev, error: 'Geolocation is not supported by this browser' }))
      return
    }

    console.log('Setting loading state and requesting geolocation...')
    setLocation(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      console.log('Requesting geolocation permission...')
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('Geolocation success:', pos.coords)
            resolve(pos)
          },
          (error) => {
            console.error('Geolocation error:', error)
            reject(error)
          },
          {
            enableHighAccuracy: true,
            timeout: 15000, // Increased timeout
            maximumAge: 300000 // 5 minutes
          }
        )
      })

      const { latitude, longitude } = position.coords
      
      // Get address from coordinates
      try {
        console.log('Making address API call to:', `${API_BASE_URL}/api/users/get_current_address`)
        console.log('With coordinates:', { latitude, longitude })
        
        const addressResponse = await fetch(`${API_BASE_URL}/api/users/get_current_address`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude, longitude })
        })
        
        console.log('Address API response status:', addressResponse.status)

        const addressData = await addressResponse.json()
        const formattedAddress = addressData.success && addressData.data?.results?.[0]?.formatted_address

        setLocation(prev => ({
          ...prev,
          latitude,
          longitude,
          address: formattedAddress || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          isLoading: false
        }))

        // Automatically get nearby places
        await getNearbyPlaces(latitude, longitude)
      } catch (error) {
        console.error('Error getting address:', error)
        setLocation(prev => ({
          ...prev,
          latitude,
          longitude,
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          isLoading: false
        }))
      }
    } catch (error) {
      console.error('Error getting location:', error)
      
      let errorMessage = 'Failed to get location'
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access and refresh the page.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please check your device settings.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
          default:
            errorMessage = 'Failed to get location. Please try again.'
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      setLocation(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
    }
  }, [API_BASE_URL])

  const getNearbyPlaces = useCallback(async (lat: number, lng: number): Promise<void> => {
    try {
      console.log('Making places API call to:', `${API_BASE_URL}/api/users/get_places_nearby/${lat}/${lng}`)
      
      const response = await fetch(`${API_BASE_URL}/api/users/get_places_nearby/${lat}/${lng}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (data.success && data.data) {
        setLocation(prev => ({
          ...prev,
          places: data.data,
          isLoading: false
        }))
      } else {
        setLocation(prev => ({
          ...prev,
          places: [],
          isLoading: false,
          error: 'Failed to fetch nearby places'
        }))
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error)
      setLocation(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch nearby places'
      }))
    }
  }, [API_BASE_URL])

  const clearLocationError = (): void => {
    setLocation(prev => ({ ...prev, error: null }))
  }

  const value = useMemo<AppContextValue>(() => ({
    locale,
    setLocale,
    isSidebarOpen,
    setIsSidebarOpen,
    location,
    getCurrentLocation,
    getNearbyPlaces,
    clearLocationError,
  }), [locale, isSidebarOpen, location])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}


