"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import EmblaCarousel from '@/components/embla-carousel'
import { Clock, Heart, Star, X, MapPin, Phone } from 'lucide-react'
import { HiCheckBadge } from 'react-icons/hi2'
import ClipLoader from 'react-spinners/ClipLoader'
import { useSavedPlaces } from '@/hooks/useSavedPlaces'

// Types for place details
interface PlaceDetails {
  place_id: string
  name: string
  formatted_address?: string
  vicinity?: string
  rating?: number
  user_ratings_total?: number
  price_level?: number
  opening_hours?: {
    open_now: boolean
    weekday_text?: string[]
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
    html_attributions?: string[]
  }>
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  formatted_phone_number?: string
  website?: string
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    time: number
  }>
  business_status?: string
  editorial_summary?: {
    overview: string
  }
}

// Types for amala-joint store details
interface AmalaStoreDetails {
  _id: string
  place_id: string
  name: string
  location: string
  latitude?: number
  longitude?: number
  phone: string
  opensAt: string
  closesAt: string
  description: string
  imageUrl?: string  // Primary image for backward compatibility
  imageUrls?: string[]  // Array of all images (max 4)
  verifiedBy: string
  is_verified: boolean
  verify_count: number
  created_by: string
  created_by_email: string
  created_at: string
  updated_at: string
  verification_requests: Array<{
    submitted_by: string
    reason: string
    proof_url: string
    submitted_at: string
  }>
}

function Page() {
    const router = useRouter()
    const params = useParams()
    const placeId = params.slug as string
    
    const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null)
    const [amalaStoreDetails, setAmalaStoreDetails] = useState<AmalaStoreDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAmalaStore, setIsAmalaStore] = useState(false)
    
    const { savePlace, unsavePlace, isPlaceSaved } = useSavedPlaces()

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

    // Memoize the fetchPlaceDetails function to prevent unnecessary re-renders
    const fetchPlaceDetails = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            
            // Check if it's an amala-joint store by looking for 'amala_' prefix
            if (placeId.startsWith('amala_')) {
                const token = localStorage.getItem('access_token') // Use correct token key
                if (token) {
                    const amalaResponse = await fetch(`${API_BASE_URL}/api/stores/${placeId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    })
                    
                    if (amalaResponse.ok) {
                        const amalaData = await amalaResponse.json()
                        if (amalaData.success && amalaData.data) {
                            setAmalaStoreDetails(amalaData.data)
                            setIsAmalaStore(true)
                            setIsLoading(false)
                            return
                        }
                    } else if (amalaResponse.status === 404) {
                        // Handle 404 case for Amala stores - redirect to not-found page
                        router.push('/home/[slug]/not-found')
                        return
                    }
                }
                setError('Amala-joint store not found')
                return
            }
            
            // For Google Places API (non-amala stores)
            const response = await fetch(`${API_BASE_URL}/api/users/get_place_details/${placeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await response.json()
            
            if (data.success && data.data?.result) {
                setPlaceDetails(data.data.result)
                setIsAmalaStore(false)
            } else {
                // Handle 404 case - redirect to not-found page
                if (response.status === 404 || data.error?.includes('not found')) {
                    router.push('/home/[slug]/not-found')
                    return
                }
                setError(data.error || 'Failed to load place details')
            }
        } catch (error) {
            console.error('Error fetching place details:', error)
            setError('Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [placeId, API_BASE_URL])

    useEffect(() => {
        if (placeId) {
            fetchPlaceDetails()
        }
    }, [placeId, fetchPlaceDetails])

    const CloseModal = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/home");
        }
    };

    const getDirections = () => {
        if (isAmalaStore && amalaStoreDetails?.latitude && amalaStoreDetails?.longitude) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${amalaStoreDetails.latitude},${amalaStoreDetails.longitude}`
            window.open(url, '_blank')
        } else if (placeDetails?.geometry?.location) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}`
            window.open(url, '_blank')
        }
    }

    const callPlace = () => {
        if (isAmalaStore && amalaStoreDetails?.phone) {
            window.open(`tel:${amalaStoreDetails.phone}`, '_self')
        } else if (placeDetails?.formatted_phone_number) {
            window.open(`tel:${placeDetails.formatted_phone_number}`, '_self')
        }
    }

    const getPriceLevel = (level?: number) => {
        if (!level) return 'From ₦1,000+'
        const prices = ['Free', 'From ₦1,000+', 'From ₦2,000+', 'From ₦3,000+', 'From ₦5,000+']
        return prices[level - 1] || 'From ₦1,000+'
    }

    const extractPricesFromReviews = () => {
        const priceRegex = /₦\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*₦/g
        const prices: number[] = []
        
        // Check reviews
        if (placeDetails?.reviews) {
            placeDetails.reviews.forEach(review => {
                const matches = review.text.match(priceRegex)
                if (matches) {
                    matches.forEach(match => {
                        const price = parseFloat(match.replace(/[₦,\s]/g, ''))
                        if (price > 0 && price < 10000) { // Reasonable price range
                            prices.push(price)
                        }
                    })
                }
            })
        }
        
        // Check editorial summary
        if (placeDetails?.editorial_summary?.overview) {
            const matches = placeDetails.editorial_summary.overview.match(priceRegex)
            if (matches) {
                matches.forEach(match => {
                    const price = parseFloat(match.replace(/[₦,\s]/g, ''))
                    if (price > 0 && price < 10000) {
                        prices.push(price)
                    }
                })
            }
        }
        
        if (prices.length > 0) {
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            return minPrice === maxPrice ? `₦${minPrice}` : `₦${minPrice} - ₦${maxPrice}`
        }
        
        return null
    }

    // Memoize photo URL generation to prevent unnecessary re-computations
    const getPhotoUrl = useCallback((photoReference: string) => {
        if (!GOOGLE_MAPS_KEY) {
            console.warn('Google Maps API key not found')
            return '/images/amala-billboard.png'
        }
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${GOOGLE_MAPS_KEY}`
    }, [GOOGLE_MAPS_KEY])

    // Memoize image URLs to prevent unnecessary re-renders
    const imageUrls = useMemo(() => {
        if (isAmalaStore) {
            // For Amala stores, use imageUrls array if available, otherwise fallback to imageUrl
            if (amalaStoreDetails?.imageUrls && amalaStoreDetails.imageUrls.length > 0) {
                return amalaStoreDetails.imageUrls.slice(0, 4) // Limit to 4 images
            } else if (amalaStoreDetails?.imageUrl) {
                return [amalaStoreDetails.imageUrl]
            }
            return ['/images/amala-billboard.png']
        } else if (placeDetails?.photos?.length) {
            // For Google Places, convert photo references to URLs
            return placeDetails.photos
                .filter((photo, index) => index < 4) // Limit to 4 images for performance
                .map(photo => getPhotoUrl(photo.photo_reference))
        }
        return ['/images/amala-billboard.png']
    }, [isAmalaStore, amalaStoreDetails?.imageUrls, amalaStoreDetails?.imageUrl, placeDetails?.photos, getPhotoUrl])

    const handleSaveToggle = () => {
        if (isAmalaStore && amalaStoreDetails) {
            if (isPlaceSaved(amalaStoreDetails.place_id)) {
                unsavePlace(amalaStoreDetails.place_id)
            } else {
                savePlace({
                    place_id: amalaStoreDetails.place_id,
                    name: amalaStoreDetails.name,
                    vicinity: amalaStoreDetails.location,
                    rating: 4.5, // Default rating for amala-joint stores
                    price_level: undefined,
                    opening_hours: { open_now: true }, // Default to open
                    geometry: amalaStoreDetails.latitude && amalaStoreDetails.longitude ? {
                        location: {
                            lat: amalaStoreDetails.latitude,
                            lng: amalaStoreDetails.longitude
                        }
                    } : undefined,
                    photos: undefined
                })
            }
        } else if (placeDetails) {
            if (isPlaceSaved(placeDetails.place_id)) {
                unsavePlace(placeDetails.place_id)
            } else {
                savePlace({
                    place_id: placeDetails.place_id,
                    name: placeDetails.name,
                    vicinity: placeDetails.vicinity || placeDetails.formatted_address || '',
                    rating: placeDetails.rating,
                    price_level: placeDetails.price_level,
                    opening_hours: placeDetails.opening_hours,
                    geometry: placeDetails.geometry,
                    photos: placeDetails.photos
                })
            }
        }
    } 

  return (
    <>
    <div className='fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4' onClick={CloseModal}>
      <div className='w-full md:max-w-[1000px] h-[92vh] md:h-[558px] max-h-[92vh] md:max-h-[558px] p-0 md:p-4 relative bg-white bg_2 md:rounded-[24px] rounded-t-[24px] shadow-xl border border-black/5 flex flex-col overflow-y-auto md:overflow-hidden' onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <div className='flex-1 flex items-center justify-center'>
            <ClipLoader 
              color="#3B82F6" 
              loading={true} 
              size={50} 
              aria-label="Loading Spinner"
            />
          </div>
        ) : (
          <>
            <div className='flex items-center justify-end w-fit absolute p-2 md:px-6 top-1 md:top-0 right-2 z-50'>
              <button onClick={CloseModal} aria-label='Close' className='p-2 hidden md:block rounded-full hover:bg-black/5 active:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/20'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='h-5 w-5 '>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 6l12 12M18 6L6 18' />
                </svg>
              </button>
            </div>
            <div className='flex-1 grid grid-cols-1 md:grid-cols-2  gap-0 md:gap-2 overflow-y-auto md:overflow-hidden md:h-[530px]'>
            <div className='w-full h-[40vh] md:h-auto max-h-[520px] md:rounded-[24px] rounded-t-[24px] bg-gray-100/10 relative'>
            
            {/* Save button */}
            <div className="absolute top-4 right-4 flex gap-2 z-50">
              <button
                onClick={handleSaveToggle}
                aria-label="save place"
                className="h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
              >
                <Heart
                  size={18}
                  className={isPlaceSaved(
                    isAmalaStore ? amalaStoreDetails?.place_id || '' : placeDetails?.place_id || ''
                  ) ? 'fill-red-500 text-red-500' : 'fill-white text-white'}
                />
              </button>
              {/* Close button */}
              <button
                onClick={CloseModal}
                aria-label="close"
                className="h-10 w-10 rounded-full bg-black/50 backdrop-blur md:hidden flex items-center justify-center"
              >
                <X
                  size={18}
                  className={'fill-white text-white'}
                />
              </button>
            </div>
            {error ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-red-500 text-center">
                  <p>{error}</p>
                  <button 
                    onClick={fetchPlaceDetails}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <EmblaCarousel 
                images={imageUrls}
                options={{ loop: true }}
              />
            )}
            </div>
            <div className='w-full h-auto md:h-full relative flex flex-col md:overflow-hidden'>
              <div className='w-full flex-1 relative flex flex-col overflow-y-auto md:overflow-y-auto md:overflow-x-hidden px-4 md:px-4 csb'>

                <br />
                <p className='text-xs md:text-sm text-gray-800 my-2 md:my-3 text_muted flex items-center gap-1'>
                  <MapPin size={14} className='min-w-[14px]' />
                  <span>
                    {isAmalaStore 
                      ? amalaStoreDetails?.location || 'Location not available'
                      : placeDetails?.formatted_address || placeDetails?.vicinity || 'Location not available'
                    }
                  </span>
                </p>
                <p className=' text-2xl md:text-4xl font-medium mt-2'>
                  {isAmalaStore 
                    ? amalaStoreDetails?.name || 'Loading...'
                    : placeDetails?.name || 'Loading...'
                  }
                </p>
                    
                <p className='text-xs md:text-sm text-gray-800 my-2 md:my-3 text_muted flex items-center gap-1'>
                  {isAmalaStore ? (
                    <>
                      Verified By Amala Joint <HiCheckBadge className='pry-color ml-1 min-w-[18px]' size={18} />
                      {amalaStoreDetails?.is_verified && (
                        <span className='ml-2 text-green-600 text-xs'>
                          ({amalaStoreDetails.verify_count} verifications)
                        </span>
                      )}
                    </>
                  ) : (
                    <>Verified By Google <HiCheckBadge className='pry-color ml-1 min-w-[18px]' size={18} /></>
                  )}
                </p>

                <div className='flex flex-row gap-2 items-center mt-2 md:mt-3'>

                <div className="flex items-center gap-1 pry-yellow-color ">
                  <Star size={14} className="fill-current" />
                  <span className="font-semibold text-sm">
                    {isAmalaStore 
                      ? '4.5' // Default rating for amala-joint stores
                      : placeDetails?.rating?.toFixed(1) || 'N/A'
                    }
                  </span>
                  {!isAmalaStore && placeDetails?.user_ratings_total && (
                    <span className="text-xs text-gray-500">
                      ({placeDetails.user_ratings_total})
                    </span>
                  )}
                </div>

                <span className='text-gray-800'>•</span>
              

              {/* Meta: hours, distance, eta */}
              <div className=" text_muted flex items-center gap-2 text-xs md:text-sm text-gray-800">
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>
                    {isAmalaStore 
                      ? `${amalaStoreDetails?.opensAt} - ${amalaStoreDetails?.closesAt}`
                      : placeDetails?.opening_hours?.open_now ? 'Open Now' : 'Closed'
                    }
                  </span>
                </div>
                {((isAmalaStore && amalaStoreDetails?.phone) || (!isAmalaStore && placeDetails?.formatted_phone_number)) && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      <span>
                        {isAmalaStore 
                          ? amalaStoreDetails?.phone
                          : placeDetails?.formatted_phone_number
                        }
                      </span>
                    </div>
                  </>
                )}
              </div>
              </div>
              <br />
                <p className=' text-2xl md:text-[28px] font-medium my-3 md:my-4 '>
                  {extractPricesFromReviews() || getPriceLevel(placeDetails?.price_level)}
                </p>
              <br />
                <p className='text-gray-800 text-sm md:text-base text_muted '>
                  {isAmalaStore 
                    ? amalaStoreDetails?.description || 'A great amala spot isn\'t just a place to eat it\'s an experience. The air greets you with the rich aroma of freshly made stews like ewedu, gbegiri, and spicy ata.'
                    : 'A great amala spot isn\'t just a place to eat it\'s an experience. The air greets you with the rich aroma of freshly made stews like ewedu, gbegiri, and spicy ata.'
                  }
                </p>
                <br />
                <div className='w-full flex flex-row items-center justify-end gap-2'>
                <button
                  onClick={handleSaveToggle}
                  className=" h-10 w-10 - rounded-full bg-black/10 backdrop-blur flex items-center justify-center"
                >
                <Heart
                  size={18}
                  className={isPlaceSaved(
                    isAmalaStore ? amalaStoreDetails?.place_id || '' : placeDetails?.place_id || ''
                  ) ? 'fill-red-500 text-red-500' : 'fill-white text-white'}
                />
              </button>
              <p>{isPlaceSaved(
                isAmalaStore ? amalaStoreDetails?.place_id || '' : placeDetails?.place_id || ''
              ) ? 'Saved' : 'Save Spot'}</p>
                </div>
                <br />

                <hr />
                <br />
                {isAmalaStore && amalaStoreDetails?.created_by_email && (
                  <>
                    <div className='w-full flex items-center justify-between'>
                      <p className='text-sm md:text-base'>Added by</p>
                    </div>
                    <div className='w-full flex flex-col mt-2'>
                      <p className='text-sm md:text-base font-bold'>
                        {amalaStoreDetails.created_by_email}
                      </p>
                      <p className='text-gray-800 text-sm md:text-base text_muted '>
                        Added on {new Date(amalaStoreDetails.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <br />
                    <hr />
                    <br />
                  </>
                )}
                <div className='w-full flex items-center justify-between'>
                  <p className='text-sm md:text-base'>Reviews</p>
                  <p className='text-gray-800 text-xs md:text-sm text_muted '>See all</p>
                </div>
                {isAmalaStore ? (
                  <div className='w-full flex flex-col mt-2'>
                    <p className='text-sm md:text-base font-bold'>Community Verified</p>
                    <p className='text-gray-800 text-sm md:text-base text_muted '>
                      This amala spot has been verified by {amalaStoreDetails?.verify_count || 0} community members.
                    </p>
                    {amalaStoreDetails?.verification_requests && amalaStoreDetails.verification_requests.length > 0 && (
                      <div className='mt-2'>
                        <p className='text-xs text-gray-600'>Recent verifications:</p>
                        {amalaStoreDetails.verification_requests.slice(0, 2).map((req, index) => (
                          <p key={index} className='text-xs text-gray-500 mt-1'>
                            • {req.reason} - {new Date(req.submitted_at).toLocaleDateString()}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : placeDetails?.reviews?.[0] ? (
                  <div className='w-full flex flex-col mt-2'>
                    <p className='text-sm md:text-base font-bold flex items-center gap-2'>
                      {placeDetails.reviews[0].author_name}
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={12} className="fill-current text-yellow-400" />
                        <span className="text-xs">{placeDetails.reviews[0].rating}</span>
                      </div>
                    </p>
                    <p className='text-gray-800 text-sm md:text-base text_muted '>
                      &quot;{placeDetails.reviews[0].text}&quot;
                    </p>
                  </div>
                ) : (
                  <div className='w-full flex flex-col mt-2'>
                    <p className='text-sm md:text-base font-bold'>No reviews yet</p>
                    <p className='text-gray-800 text-sm md:text-base text_muted '>
                      Be the first to review this place!
                    </p>
                  </div>
                )}
                <br />
                <hr />
                <br />
                <div className="mt-2 md:mt-4 flex items-center gap-3 sticky bottom-0 left-0 right-0  backdrop-blur-3xl py-3">
                <button
                  onClick={getDirections}
                  className="flex-1 h-[48px] md:h-[43px] rounded-full pry-bg text-white px-4 text-[16px] md:text-[15px]"
                >
                  Get Directions
                </button>
                <button
                  onClick={callPlace}
                  className="flex-1 h-[48px] md:h-[43px] rounded-full bg-gray-500/50 text-white px-4 text-[16px] md:text-[15px]"
                  disabled={isAmalaStore ? !amalaStoreDetails?.phone : !placeDetails?.formatted_phone_number}
                >
                  {isAmalaStore 
                    ? (amalaStoreDetails?.phone ? 'Call Now' : 'No Phone')
                    : (placeDetails?.formatted_phone_number ? 'Call Now' : 'No Phone')
                  }
                </button>
              </div>
              <br />
              <br />
              </div>
            </div>
        </div>
          </>
        )}
      </div>
    </div>
    </>
  )
}

export default Page