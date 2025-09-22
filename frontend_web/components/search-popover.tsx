'use client'

import React from 'react'
import { Star } from 'lucide-react'

export type SearchResult = {
  id: string
  name: string
  distanceKm: number
  etaMinutes: number
  isOpen: boolean
  thumbnailUrl?: string
  rating: number
}

type SearchPopoverProps = {
  results: SearchResult[]
  visible: boolean
}

function SearchPopover({ results, visible }: SearchPopoverProps) {
  if (!visible) return null

  return (
    <div className='mt-2 w-full rounded-[16px] bg_2 border border-gray-800/40 overflow-hidden'>
      <div className='px-4 py-3 border-b border-gray-800/40'>
        <b className='text-base'>Recent Searches</b>
      </div>
      <div className='flex flex-col'>
        {results.map((r) => (
          <div key={r.id} className='px-4 py-3 flex items-center gap-3 border-b border-gray-800/30 last:border-b-0'>
            <div className='h-[48px] w-[48px] bg-gray-500/50 rounded-[12px] overflow-hidden flex-shrink-0'>
              {r.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.thumbnailUrl} alt={r.name} className='w-full h-full object-cover' />
              ) : null}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-[16px] font-semibold truncate'>{r.name}</p>
              <p className='text-sm text-gray-400 truncate'>
                {r.distanceKm}km ({r.etaMinutes}mins) · {r.isOpen ? 'Open' : 'Closed'}
              </p>
            </div>
            <div className='flex items-center gap-1 pry-yellow-color'>
              <Star size={18} className='fill-current' />
              <span className='font-semibold'>{r.rating.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchPopover


