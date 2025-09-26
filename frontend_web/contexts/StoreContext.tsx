'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { axiosGet } from '@/utils/http/api'

interface Store {
  _id: string
  place_id: string
  name: string
  phone: string
  location: string
  opensAt: string
  closesAt: string
  description: string
  imageUrl?: string
  cloudinary_public_id?: string
  verifiedBy: string
  is_verified: boolean
  verify_count: number
  created_at: string
  updated_at: string
  created_by: string
  created_by_email?: string
  verification_requests: any[]
}

interface StoreContextType {
  // State
  unverifiedStores: Store[]
  verifiedStores: Store[]
  userStores: Store[]
  loadingStores: boolean
  error: string | null
  
  // Actions
  fetchUnverifiedStores: () => Promise<void>
  fetchVerifiedStores: () => Promise<void>
  fetchUserStores: () => Promise<void>
  addStore: (store: Store) => void
  removeStore: (storeId: string) => void
  updateStore: (storeId: string, updates: Partial<Store>) => void
  ignoreStore: (storeId: string) => void
  refreshStores: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [unverifiedStores, setUnverifiedStores] = useState<Store[]>([])
  const [verifiedStores, setVerifiedStores] = useState<Store[]>([])
  const [userStores, setUserStores] = useState<Store[]>([])
  const [loadingStores, setLoadingStores] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { accessToken, isAuthenticated, user } = useAuth()

  // Helper function to get JWT token
  const getAuthToken = () => {
    return accessToken
  }

  // Fetch unverified stores
  const fetchUnverifiedStores = async () => {
    try {
      setLoadingStores(true)
      setError(null)
      
      const token = getAuthToken()
      if (!token || !isAuthenticated) {
        console.log('User not authenticated, skipping store fetch')
        setUnverifiedStores([])
        return
      }

      const response = await axiosGet('/api/stores/unverified', {
        Authorization: `Bearer ${token}`,
      })

      const result = response.data

      if (!response.status || response.status >= 400) {
        throw new Error(result.error || 'Failed to fetch unverified stores')
      }

      if (result.success) {
        setUnverifiedStores(result.data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch unverified stores'
      setError(errorMessage)
      console.error('Error fetching unverified stores:', err)
    } finally {
      setLoadingStores(false)
    }
  }

  // Fetch verified stores
  const fetchVerifiedStores = async () => {
    try {
      setLoadingStores(true)
      setError(null)
      
      const token = getAuthToken()
      if (!token || !isAuthenticated) {
        console.log('User not authenticated, skipping store fetch')
        setVerifiedStores([])
        return
      }

      const response = await axiosGet('/api/stores/verified', {
        Authorization: `Bearer ${token}`,
      })

      const result = response.data

      if (!response.status || response.status >= 400) {
        throw new Error(result.error || 'Failed to fetch verified stores')
      }

      if (result.success) {
        setVerifiedStores(result.data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch verified stores'
      setError(errorMessage)
      console.error('Error fetching verified stores:', err)
    } finally {
      setLoadingStores(false)
    }
  }

  // Fetch user's stores
  const fetchUserStores = async () => {
    try {
      setLoadingStores(true)
      setError(null)
      
      const token = getAuthToken()
      if (!token || !isAuthenticated || !user?.email) {
        console.log('User not authenticated or no email, skipping user stores fetch')
        setUserStores([])
        return
      }

      const response = await axiosGet(`/api/stores/user/${encodeURIComponent(user.email)}`, {
        Authorization: `Bearer ${token}`,
      })

      const result = response.data

      if (!response.status || response.status >= 400) {
        throw new Error(result.error || 'Failed to fetch user stores')
      }

      if (result.success) {
        setUserStores(result.data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user stores'
      setError(errorMessage)
      console.error('Error fetching user stores:', err)
    } finally {
      setLoadingStores(false)
    }
  }

  // Add a new store to the list
  const addStore = (store: Store) => {
    setUnverifiedStores(prev => [store, ...prev])
  }

  // Remove a store from the list
  const removeStore = (storeId: string) => {
    setUnverifiedStores(prev => prev.filter(store => store._id !== storeId))
    setVerifiedStores(prev => prev.filter(store => store._id !== storeId))
    setUserStores(prev => prev.filter(store => store._id !== storeId))
  }

  // Update a store in the list
  const updateStore = (storeId: string, updates: Partial<Store>) => {
    setUnverifiedStores(prev => 
      prev.map(store => 
        store._id === storeId ? { ...store, ...updates } : store
      )
    )
    setVerifiedStores(prev => 
      prev.map(store => 
        store._id === storeId ? { ...store, ...updates } : store
      )
    )
    setUserStores(prev => 
      prev.map(store => 
        store._id === storeId ? { ...store, ...updates } : store
      )
    )
  }

  // Ignore a store (local removal only)
  const ignoreStore = (storeId: string) => {
    // Simply remove the store from the unverified list locally
    removeStore(storeId)
  }

  // Refresh all stores
  const refreshStores = async () => {
    if (isAuthenticated && accessToken) {
      await Promise.all([
        fetchUnverifiedStores(),
        fetchVerifiedStores(),
        fetchUserStores()
      ])
    }
  }

  // Initial fetch on mount - only if authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchUnverifiedStores()
      fetchVerifiedStores()
      fetchUserStores()
    } else {
      // Clear stores if not authenticated
      setUnverifiedStores([])
      setVerifiedStores([])
      setUserStores([])
      setError(null)
    }
  }, [isAuthenticated, accessToken, user?.email])

  const value: StoreContextType = {
    // State
    unverifiedStores,
    verifiedStores,
    userStores,
    loadingStores,
    error,
    
    // Actions
    fetchUnverifiedStores,
    fetchVerifiedStores,
    fetchUserStores,
    addStore,
    removeStore,
    updateStore,
    ignoreStore,
    refreshStores,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

// Custom hook to use the store context
export function useStores() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStores must be used within a StoreProvider')
  }
  return context
}

// Export the context for direct access if needed
export { StoreContext }
