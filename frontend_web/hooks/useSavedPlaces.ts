import { useState, useEffect } from 'react'

export interface SavedPlace {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  price_level?: number
  opening_hours?: {
    open_now: boolean
  }
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  savedAt: number // timestamp when saved
}

const STORAGE_KEY = 'amala_saved_places'

export const useSavedPlaces = () => {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load saved places from localStorage on mount
  useEffect(() => {
    try {
      // Check if we're in the browser (not SSR)
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          setSavedPlaces(parsed)
        }
        setIsInitialized(true)
      }
    } catch (error) {
      console.error('Error loading saved places:', error)
      setIsInitialized(true)
    }
  }, [])

  // Save to localStorage whenever savedPlaces changes (but not on initial load)
  useEffect(() => {
    if (!isInitialized) return // Don't save on initial mount
    
    try {
      // Check if we're in the browser (not SSR)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlaces))
      }
    } catch (error) {
      console.error('Error saving places to localStorage:', error)
    }
  }, [savedPlaces, isInitialized])

  const savePlace = (place: Omit<SavedPlace, 'savedAt'>) => {
    const savedPlace: SavedPlace = {
      ...place,
      savedAt: Date.now()
    }
    
    setSavedPlaces(prev => {
      // Check if already saved
      const exists = prev.some(p => p.place_id === place.place_id)
      if (exists) {
        return prev // Don't add duplicates
      }
      return [...prev, savedPlace]
    })
  }

  const unsavePlace = (placeId: string) => {
    setSavedPlaces(prev => prev.filter(p => p.place_id !== placeId))
  }

  const isPlaceSaved = (placeId: string) => {
    return savedPlaces.some(p => p.place_id === placeId)
  }

  const clearAllSaved = () => {
    setSavedPlaces([])
  }

  return {
    savedPlaces,
    savePlace,
    unsavePlace,
    isPlaceSaved,
    clearAllSaved
  }
}
