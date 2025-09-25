'use client'

import React, { useState } from 'react'
import { Heart, MapPin, Clock, Star, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export type SpotCardProps = {
  name: string
  location: string
  opensAt: string
  closesAt: string
  distanceKm: number
  etaMinutes: number
  rating: number
  verified?: boolean
  imageUrl?: string
  isFavorite?: boolean
  onExplore?: () => void
  onDirections?: () => void
  onToggleFavorite?: (next: boolean) => void
}

function SpotCard({
  name,
  location,
  opensAt,
  closesAt,
  distanceKm,
  etaMinutes,
  rating,
  verified = false,
  imageUrl,
  isFavorite,
  onExplore: _onExplore,
  onDirections,
  onToggleFavorite,
}: SpotCardProps) {
  const [localFav, setLocalFav] = useState<boolean>(!!isFavorite)

  const toggleFav = () => {
    const next = !localFav
    setLocalFav(next)
    onToggleFavorite?.(next)
  }

  return (
    <div className="w-full min-h-fit rounded-[16px] p-3 overflow-hidden ">
      {/* Image + favorite */}
      <div className="relative w-full h-[150px] bg_3 rounded-[12px] overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : null}

        {/* Favorite button */}
        <button
          onClick={toggleFav}
          aria-label="favorite"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
        >
          <Heart
            size={18}
            className={localFav ? 'fill-white text-white' : 'text-white'}
          />
        </button>

        {/* Verified badge */}
        {verified ? (
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs flex items-center gap-1">
            <CheckCircle2 size={14} />
            <span>Verified</span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="mt-2 w-full">
        <div className="flex items-center justify-between gap-2 w-full mt-3">
          <b className="text-[18px] sm:text-[20px] font-semibold">{name}</b>
          <div className="flex items-center gap-1 pry-yellow-color ">
            <Star size={14} className="fill-current" />
            <span className="font-semibold text-sm">{rating.toFixed(2)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="mt-2 text_muted flex items-center gap-1 text-sm text-gray-800 ">
          <MapPin size={18} />
          <span>{location}</span>
        </div>

        {/* Meta: hours, distance, eta */}
        <div className="mt-2 text_muted flex items-center gap-2 text-sm text-gray-800">
          <div className="flex items-center gap-1">
            <Clock size={18} />
            <span>
              {opensAt} - {closesAt}
            </span>
          </div>
          <span>•</span>
          <span>
            {distanceKm}km ({etaMinutes} mins)
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={onDirections}
            className="flex-1 h-[40px] rounded-full grey text-white px-4 text-[15px]"
          >
            Directions
          </button>
          <Link
            href={'/home/spot1'}
            className="flex-1 flex items-center justify-center h-[40px] rounded-full pry-bg text-white px-4 text-[15px]"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SpotCard


