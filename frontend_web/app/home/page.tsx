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

  function Page() { 
    const { location, getCurrentLocation } = useApp()
    const { user, isAuthenticated } = useAuth()
    const { savePlace, unsavePlace, isPlaceSaved } = useSavedPlaces()
    const router = useRouter()
    const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({
      nowOpen: false,
      verified: false,
      distanceKm: 2,
      rating: null,
      price: null
    })

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
        thumbnailUrl: undefined,
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
          <div  className='relative md:hidden flex flex-row items-center justify-end w-full min-h-[200px] overflow-hidden rounded-xl bg-gray-100 mb-2'>
            <StoresMap />
            <Link
              href='?mobileMap=1'
              className='md:hidden absolute top-3 right-3 px-3 py-2 rounded-full bg-black/80 text-white text-sm'
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
              console.log('Explore place:', place.name)
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
        <div className='fixed md:absolute bottom-6 right-6 z-40'>
          <div className='flex flex-col gap-2'>
            <Link 
              href='/auth/login'
              className='h-12 w-12 rounded-full pry-bg text-white flex items-center justify-center shadow-lg shadow-black/20 hover:opacity-90 active:opacity-80'
              aria-label='Login to add store'
            >
              <span className='text-xs font-medium'>Login</span>
            </Link>
            <Link 
              href='/auth/signup'
              className='h-12 w-12 rounded-full bg-white border-2 border-gray-300 text-gray-700 flex items-center justify-center shadow-lg shadow-black/20 hover:bg-gray-50 active:opacity-80'
              aria-label='Sign up to add store'
            >
              <span className='text-xs font-medium'>Signup</span>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Page