'use client'

import React, { useState } from 'react'
import { Heart, MapPin, Clock, Star, CheckCircle2 } from 'lucide-react'
import { HiCheckBadge } from 'react-icons/hi2'
import Link from 'next/link'

export type ResultsContainerProps = {
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

function ResultsContainer({
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
  onExplore,
  onDirections,
  onToggleFavorite,
}: ResultsContainerProps) {
  const [localFav, setLocalFav] = useState<boolean>(!!isFavorite)

  const toggleFav = () => {
    const next = !localFav
    setLocalFav(next)
    onToggleFavorite?.(next)
  }

  return (
    <div className="w-full min-h-fit !border-gray-600/90 p-2 overflow-hidden  relative border-b flex flex-row gap-2">
      {/* Image + favorite */}
      <div className="relative w-[100px] h-[100px] min-w-[100px] bg_3 rounded-[12px] overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : null}

        

        {/* Verified badge */}
        {/* {verified ? (
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs flex items-center gap-1">
            <CheckCircle2 size={14} />
            <span>Verified</span>
          </div>
        ) : null} */}
      </div>

      {/* Content */}
      <div className=" w-full">
        <div className="flex items-start justify-between gap-2 w-full">
          <b className="text-[18px] md:text-[20px] font-semibold line-clamp-2 flex items-center flex-wrap">
            <span className="inline-flex items-center gap-1 ">
              {name}
              <HiCheckBadge className='pry-color ml-1 min-w-[18px]' size={18}  />
            </span>
          </b>
          {/* Favorite button */}
        {/* <button
          onClick={toggleFav}
          aria-label="favorite"
          className="  top-4 right-4 h-10 w-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
        >
          <Heart
            size={18}
            className={localFav ? 'fill-white text-white' : 'text-white'}
          />
        </button> */}
        </div>

        {/* Location */}
        <div className="mt-2 text_muted flex items-center gap-1 text-xs">
          <MapPin size={18} />
          <span>{location}</span>
        </div>

        {/* Meta: hours, distance, eta */}
        <div className="mt-2 text_muted flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            {/* <Clock size={18} /> */}
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
            className="flex-1 h-[40px] rounded-full grey text-white px-4 text-sm"
          >
            Directions
          </button>
          <Link
            href={'/home/spot1'}>
          <button
            onClick={onExplore}
            className="flex-1 h-[40px] rounded-full pry-bg cursor-pointer text-white px-4 text-sm"
          >
            Explore
          </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResultsContainer


