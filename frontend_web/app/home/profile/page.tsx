'use client'
import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { useSavedPlaces } from '@/hooks/useSavedPlaces'
import { useRouter } from 'next/navigation'
import { Heart, MapPin, Star, LogOut, Edit3, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

function ProfilePage() {
  const { user, logout } = useAuth()
  const { savedPlaces, unsavePlace } = useSavedPlaces()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const handleRemovePlace = (placeId: string) => {
    unsavePlace(placeId)
  }

  const handlePlaceClick = (place: any) => {
    router.push(`/home/${place.place_id}`)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen ">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
          <div className="w-8" /> {/* Spacer */}
        </div>

        <div className="p-4">
          {/* Profile Information */}
          <div className="text-center py-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <Image
                src="/images/bot.png"
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
            
            <div className="flex items-center justify-center mb-2">
              <h2 className="text-xl font-bold mr-2">{user?.name || 'User'}</h2>
              <Edit3 size={16} className="text-gray-500" />
            </div>
            
            <p className="text-gray-500 mb-4">{user?.email || 'user@example.com'}</p>
          </div>

          {/* Saved Places Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Saved Places</h3>
              <Link 
                href="/home/saved" 
                className="text-blue-600 text-sm hover:underline"
              >
                See all
              </Link>
            </div>

            {savedPlaces.length > 0 ? (
              <div className="space-y-3">
                {savedPlaces.slice(0, 2).map((place) => (
                  <div
                    key={place.place_id}
                    className="flex items-center bg-white/20 rounded-lg p-3 border hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handlePlaceClick(place)}
                  >
                    <div className="w-16 h-16 rounded-lg bg-gray-200 mr-3 overflow-hidden">
                      {place.photos && place.photos.length > 0 ? (
                        <Image
                          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`}
                          alt={place.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200/20 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{place.name}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin size={12} className="mr-1" />
                        <span>{place.vicinity || 'Location not available'}</span>
                      </div>
                      {place.rating && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Star size={12} className="mr-1" />
                          <span>{place.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemovePlace(place.place_id)
                      }}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Heart size={16} className="fill-red-500 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/20 rounded-lg p-6 text-center border">
                <p className="text-gray-500">No saved places yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Save your favorite restaurants to see them here
                </p>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="bg-white/10 rounded-lg border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 text-red-600 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <LogOut size={20} className="mr-3" />
                <span className="font-medium">Log out</span>
              </div>
              <ArrowLeft size={16} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ProfilePage