"use client"
import { ArrowUpDown, Plus, RefreshCw } from 'lucide-react'
  import { type SearchResult } from '@/components/search-popover'
  import SearchBar from '@/components/search-bar'
  import React, { useMemo, useEffect, useState } from 'react'
  import ResultsContainer from '@/components/resultsContainer'
  import Link from 'next/link'
  import StoresMap from '@/components/maps/stores-map'
  import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { useSavedPlaces } from '@/hooks/useSavedPlaces'
import { useRouter } from 'next/navigation'
import { FilterOptions } from '@/components/FilterPopover'
import VerificationModal from '@/components/verification-modal'
import MapErrorBoundary from '@/components/MapErrorBoundary'

  function Page() { 
    const { location, getCurrentLocation } = useApp()
    const { user, isAuthenticated, setUser } = useAuth()
    const { savePlace, unsavePlace, isPlaceSaved } = useSavedPlaces()
    const router = useRouter()
    const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({
      nowOpen: false,
      verified: false,
      distanceKm: 2,
      rating: null,
      price: null
    })
    const [showVerificationModal, setShowVerificationModal] = useState(false)

    // Convert places to SearchResult format for SearchBar compatibility
    const searchResults: SearchResult[] = useMemo(() => {
      return location.places.map((place) => ({
        id: place.place_id,
        name: place.name,
        distanceKm: Math.round(Math.random() * 10 + 1), // Mock distance calculation
        etaMinutes: Math.round(Math.random() * 30 + 5), // Mock ETA calculation
        isOpen: place.opening_hours?.open_now ?? true,
        verified: place.rating ? place.rating > 4.0 : false,
        rating: place.rating ?? 4.0,
        priceLevel: place.price_level ?? 1,
        thumbnailUrl: place.photos && place.photos.length > 0 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
          : '/images/amala-billboard.png',
      }))
    }, [location.places])

    // No dummy fallback; rely solely on real results

    // Auto-fetch location on component mount - only once
    useEffect(() => {
      console.log('useEffect running - location state:', {
        latitude: location.latitude,
        isLoading: location.isLoading,
        error: location.error
      })
      
      if (!location.latitude && !location.isLoading && !location.error) {
        console.log('Calling getCurrentLocation...')
        getCurrentLocation()
      } else {
        console.log('Skipping getCurrentLocation due to conditions')
      }
    }, []) // Empty dependency array - only run once on mount

    // Check if user needs email verification
    useEffect(() => {
      if (isAuthenticated && user && !user.email_verified) {
        setShowVerificationModal(true)
      }
    }, [isAuthenticated, user])

    // Handle 404 errors from spot details
    useEffect(() => {
      const handle404Error = () => {
        // This will be triggered when navigating to a non-existent spot
        console.log('404 error detected, logging out user')
      }

      // Listen for navigation errors
      const originalPush = router.push
      router.push = (href: string) => {
        // Check if it's a spot URL that might not exist
        if (href.includes('/home/') && !href.includes('/home/new') && !href.includes('/home/saved') && !href.includes('/home/profile') && !href.includes('/home/chat')) {
          // This is a spot URL, we'll handle 404 in the spot page component
        }
        return originalPush(href)
      }

      return () => {
        router.push = originalPush
      }
    }, [router])

    // Filter handlers
    const handleApplyFilters = (filters: FilterOptions) => {
      setAppliedFilters(filters)
    }

    const handleClearFilters = () => {
      setAppliedFilters({
        nowOpen: false,
        verified: false,
        distanceKm: 2,
        rating: null,
        price: null
      })
    }

    const handleSelectResult = (result: SearchResult) => {
      // Navigate to place details
      router.push(`/home/${result.id}`)
    }

    const handleUserVerified = () => {
      // Update user in localStorage and context
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = { ...currentUser, email_verified: true }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setShowVerificationModal(false)
    }

    // No manual refresh button; auto-fetch only

    return (
      <>
      {/* search and filters */}
      <SearchBar 
        data={searchResults} 
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        onSelectResult={handleSelectResult}
        resultCount={searchResults.length}
      />
          <br />
        {/* results */}
       <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col '> 
          <b className='text-[16px] font-semibold'>Hi {user?.name?.split(' ')[0] ?? "there"}!</b>
          <b className='text-[16px] font-semibold'>Amala Spots near you</b>
          <div className='flex items-center gap-2'>
            
           
              <p className='text-sm text-gray-500'>Enjoy tasty Amala right close to you</p>
            
            {/* {location.isLoading && (
              <RefreshCw size={14} className='animate-spin text-blue-500' />
            )} */}
          </div>
          </div>

          <div className='flex flex-row items-center text-base gap-2'>
            <ArrowUpDown size={18} />
            <b>A-Z</b>
          </div>

       </div>
      
          <hr className='border border_1 my-2' />

          {location.address && (
              <p className='text-sm text-gray-800 text_muted flex items-center gap-1 !line-clamp-2'>
                <span className=''><span className='text-gray-500 font-semibold text_muted'>Results near: </span>  {location.address}</span>
               
              </p>
            ) }

      <div className='w-full flex-1 min-h-0 flex flex-col md:overflow-y-auto csb gap-4 overscroll-contain mt-2'>
          <div className='relative md:hidden flex flex-row items-center justify-end w-full min-h-[200px] rounded-xl bg-gray-50 mb-2'>
            <MapErrorBoundary>
              <StoresMap />
            </MapErrorBoundary>
            <Link
              href='?mobileMap=1'
              className='md:hidden absolute top-3 right-3 px-3 py-2 rounded-full bg-black/80 text-white text-sm hover:bg-black/90 transition-colors'
              aria-label='Open map full-screen'
            >
              Open Map
            </Link>
          </div>
      
        {/* Error state */}
        {location.error && (
          <div className='w-full p-4 mb-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-600 text-sm mb-2'>{location.error}</p>
            <button 
              onClick={() => getCurrentLocation()}
              className='px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors'
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading state */}
        {location.isLoading && location.places.length === 0 && (
          <div className='flex flex-col items-center justify-center py-8'>
            <RefreshCw size={24} className='animate-spin text-blue-500 mr-2' />
            <p className='text-gray-500'>Finding places near you...</p>
          </div>
        )}

        {/* Real places only; no fallback */}
        {location.places.map((place) => (
          <ResultsContainer 
            place_id={place.place_id}
            key={place.place_id}
            name={place.name}
            location={place.vicinity}
            opensAt={place.opening_hours?.open_now ? 'Open' : 'Closed'}
            closesAt={place.opening_hours?.open_now ? 'Now' : 'Now'}
            distanceKm={Math.round(Math.random() * 10 + 1)}
            etaMinutes={Math.round(Math.random() * 30 + 5)}
            rating={place.rating ?? 4.0}
            verified={place.rating ? place.rating > 4.0 : false}
            imageUrl={place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}` : '/images/amala-billboard.png'}
            isFavorite={isPlaceSaved(place.place_id)}
            onDirections={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`
              window.open(url, '_blank')
            }}
            onExplore={() => {
              router.push(`/home/${place.place_id}`);
            }}
            onToggleFavorite={(isFavorite) => {
              if (isFavorite) {
                savePlace({
                  place_id: place.place_id,
                  name: place.name,
                  vicinity: place.vicinity,
                  rating: place.rating,
                  price_level: place.price_level,
                  opening_hours: place.opening_hours,
                  geometry: place.geometry,
                  photos: place.photos
                })
              } else {
                unsavePlace(place.place_id)
              }
            }}
          />
        ))}
        <br />
      </div>

      {/* Floating action button to add a new store */}
      {isAuthenticated ? (
        <Link href='/home/new' aria-label='Add new store'
          className='fixed md:absolute bottom-6 right-6 z-40 h-14 w-14 rounded-full pry-bg text-white flex items-center justify-center shadow-lg shadow-black/20 hover:opacity-90 active:opacity-80'>
          <Plus size={24} />
        </Link>
      ) : (
        <Link href='/auth/login' aria-label='Add new store'
          className='fixed md:absolute bottom-6 right-6 z-40 h-14 w-14 rounded-full pry-bg text-white flex items-center justify-center shadow-lg shadow-black/20 hover:opacity-90 active:opacity-80'>
          <Plus size={24} />
        </Link>
        )}

        {/* Verification Modal */}
        <VerificationModal
          isOpen={showVerificationModal}
          userEmail={user?.email || ''}
          onUserVerified={handleUserVerified}
        />
      </>
    )
  }

export default Page