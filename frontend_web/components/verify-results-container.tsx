'use client'

import React from 'react'
import { MapPin } from 'lucide-react'
import { HiCheckBadge } from 'react-icons/hi2'

export type VerifyResultsContainerProps = {
  name: string
  location: string
  opensAt: string
  closesAt: string
  distanceKm: number
  etaMinutes: number
  rating: number
  verified?: boolean
  imageUrl?: string
  onIgnore?: () => void
  onVerify?: () => void
}

export default function VerifyResultsContainer({
  name,
  location,
  opensAt,
  closesAt,
  distanceKm,
  etaMinutes,
  rating: _rating,
  verified = false,
  imageUrl,
  onIgnore,
  onVerify,
}: VerifyResultsContainerProps) {
  return (
    <div className="w-full min-h-fit !border-gray-600/90 p-2 overflow-hidden  relative border-b flex flex-row gap-2">
      <div className="relative w-[100px] h-[100px] min-w-[100px] bg_3 rounded-[12px] overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : null}
      </div>

      <div className=" w-full">
        <div className="flex items-start justify-between gap-2 w-full">
          <b className="text-[18px] md:text-[20px] font-semibold line-clamp-2 flex items-center flex-wrap">
            <span className="inline-flex items-center gap-1 ">
              {name}
              {verified ? <HiCheckBadge className='pry-color ml-1 min-w-[18px]' size={18}  /> : null}
            </span>
          </b>
        </div>

        <div className="mt-2 text_muted flex items-center gap-1 text-xs">
          <MapPin size={18} />
          <span>{location}</span>
        </div>

        <div className="mt-2 text_muted flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>
              {opensAt} - {closesAt}
            </span>
          </div>
          <span>•</span>
          <span>
            {distanceKm}km ({etaMinutes} mins)
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={onIgnore}
            className="flex-1 h-[40px] rounded-full grey text-white px-4 text-sm"
          >
            Ignore
          </button>
          <button
            onClick={onVerify}
            className="flex-1 h-[40px] rounded-full pry-bg cursor-pointer text-white px-4 text-sm"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  )
}


