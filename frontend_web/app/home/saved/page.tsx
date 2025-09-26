"use client"
import React from 'react'
import { useSavedPlaces } from '@/hooks/useSavedPlaces'
import { useRouter } from 'next/navigation'
import { Heart, MapPin } from 'lucide-react'
import { HiCheckBadge } from 'react-icons/hi2'

function Page() {
  const { savedPlaces, unsavePlace, clearAllSaved } = useSavedPlaces()
  const router = useRouter()

  const handleRemove = (placeId: string) => {
    unsavePlace(placeId)
  }

  const handleExplore = (placeId: string) => {
    router.push(`/home/${placeId}`)
  }

  const getPhotoUrl = (photoReference: string) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
  }

  return (
    <div className="max-w-3xl mx-auto w-full  py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
      <h1 className="text-2xl font-semibold ">Saved</h1>
          <p className="text-sm text-gray-800 text_muted ">here are your saved items</p>
        </div>
        {savedPlaces.length > 0 && (
          <button
            onClick={clearAllSaved}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className='w-full md:h-full md:max-h-[80vh] h-fit  flex-grow flex flex-col overflow-y-scroll csb gap-4'>
        {savedPlaces.length === 0 ? (
          <div className="p-6 text-center text_muted">No saved items yet.</div>
        ) : (
          savedPlaces.map((place) => (
            <div key={place.place_id} className="w-full min-h-fit !border-gray-600/90 p-2 overflow-hidden relative border-b flex flex-row gap-2">
              {/* Image + favorite */}
              <div className="relative w-[100px] h-[100px] min-w-[100px] bg_3 rounded-[12px] overflow-hidden">
                {place.photos && place.photos.length > 0 ? (
                  <img 
                    src={getPhotoUrl(place.photos[0].photo_reference)} 
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}

                {/* Heart button */}
                <button
                  onClick={() => handleRemove(place.place_id)}
                  aria-label="remove from saved"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
                >
                  <Heart
                    size={16}
                    className="fill-red-500 text-red-500"
                  />
                </button>
              </div>

              {/* Content */}
              <div className="w-full">
                <div className="flex items-start justify-between gap-2 w-full">
                  <b title={place.name} className="text-[18px] md:text-[20px] font-semibold !line-clamp-2 flex items-center flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      {place.name}
                      <HiCheckBadge className='pry-color ml-1 min-w-[18px]' size={18} />
                    </span>
                  </b>
                </div>

                {/* Location */}
                <div className="mt-2 text_muted flex items-center gap-1 flex-row text-xs">
                  <MapPin size={18} />
                  <span className='!line-clamp-1' title={place.vicinity}>{place.vicinity}</span>
                </div>

                {/* Meta: hours, rating */}
                {/* <div className="mt-2 text_muted flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock size={18} />
                    <span>
                      {place.opening_hours?.open_now ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                  {place.rating && (
                    <>
                      <span>•</span>
                      <span className='flex items-center gap-1 text-yellow-400 text-xs'>
                        <Star size={12} className='text-yellow-400' fill='var(--color-yellow-400)' />
                        {place.rating.toFixed(1)}
                      </span>
                    </>
                  )}
                </div> */}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.geometry?.location.lat},${place.geometry?.location.lng}`
                      window.open(url, '_blank')
                    }}
                    className="flex-1 h-[40px] rounded-full grey text-white px-4 text-sm cursor-pointer"
                  >
                    Directions
                  </button>
                  <button
                    onClick={() => handleExplore(place.place_id)}
                    className="flex-1 h-[40px] rounded-full pry-bg cursor-pointer text-white px-4 text-sm"
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <br />
        <br />
        <br />
      </div>
    </div>
  )
}

export default Page