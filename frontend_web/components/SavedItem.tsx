'use client'

import React from 'react'
import { MapPin, X } from 'lucide-react'
import Link from 'next/link'

export type SavedItemProps = {
  id: string | number
  name: string
  location: string
  opensAt: string
  closesAt: string
  imageUrl?: string
  onRemove?: (id: string | number) => void
}

function SavedItem({ id, name, location, opensAt, closesAt, imageUrl, onRemove }: SavedItemProps) {
  return (
    <div className="w-full min-h-fit !border-gray-600/90 p-2 overflow-hidden relative border-b flex flex-row gap-2">
      <div className="relative w-[84px] h-[84px] min-w-[84px] bg_3 rounded-[12px] overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : null}

        <button
          aria-label="remove saved item"
          onClick={() => onRemove?.(id)}
          className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center"
        >
          <X size={16} />
        </button>
      </div>

      <div className="w-full">
        <div className="flex items-start justify-between gap-2 w-full">
          <b className="text-[16px] md:text-[18px] font-semibold line-clamp-2">{name}</b>
        </div>

        <div className="mt-2 text_muted flex items-center gap-1 text-xs">
          <MapPin size={16} />
          <span>{location}</span>
        </div>

        <div className="mt-2 text_muted flex items-center gap-2 text-xs">
          <span>
            {opensAt} - {closesAt}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Link href={'/home/spot1'}>
            <button className="flex-1 h-[36px] rounded-full pry-bg cursor-pointer text-white px-4 text-sm">
              Open
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SavedItem


