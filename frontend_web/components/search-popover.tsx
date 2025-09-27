'use client'

import React from 'react'
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react'

export type SearchResult = {
  id: string
  name: string
  distanceKm: number
  etaMinutes: number
  isOpen: boolean
  verified: boolean
  thumbnailUrl?: string
  rating: number
  priceLevel?: number
}

type SearchPopoverProps = {
  results: SearchResult[]
  visible: boolean
  onSelectResult?: (result: SearchResult) => void
}

function SearchPopover({ results, visible, onSelectResult }: SearchPopoverProps) {
  if (!visible) return null

  return (
    <div className='mt-2 w-full rounded-[16px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg'>
      <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'>
        <b className='text-base text-gray-900 dark:text-gray-100'>Search Results</b>
        <span className='ml-2 text-sm text-gray-500 dark:text-gray-400'>({results.length} found)</span>
      </div>
      <div className='flex flex-col max-h-80 overflow-y-auto'>
        {results.map((r) => (
          <div 
            key={r.id} 
            className='px-4 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group'
            onClick={() => onSelectResult?.(r)}
          >
            {/* Image */}
            <div className='h-[56px] w-[56px] bg-gray-200 dark:bg-gray-600 rounded-[12px] overflow-hidden flex-shrink-0 relative'>
              {r.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={r.thumbnailUrl} 
                  alt={r.name} 
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200' 
                />
              ) : (
                <div className='w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center'>
                  <span className='text-gray-500 dark:text-gray-400 text-xs font-medium'>No Image</span>
                </div>
              )}
              
              {/* Verified Badge */}
              {r.verified && (
                <div className='absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center'>
                  <CheckCircle size={12} className='text-white' />
                </div>
              )}
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-1'>
                <p className='text-[16px] font-semibold text-gray-900 dark:text-gray-100 truncate'>{r.name}</p>
                {r.verified && (
                  <div className='flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900 rounded-full'>
                    <CheckCircle size={12} className='text-green-600 dark:text-green-400' />
                    <span className='text-xs text-green-700 dark:text-green-300 font-medium'>Verified</span>
                  </div>
                )}
              </div>
              
              <div className='flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400'>
                <div className='flex items-center gap-1'>
                  <MapPin size={14} />
                  <span>{r.distanceKm}km</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock size={14} />
                  <span>{r.etaMinutes}mins</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  r.isOpen 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {r.isOpen ? 'Open' : 'Closed'}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className='flex items-center gap-1 text-yellow-500 dark:text-yellow-400'>
              <Star size={18} className='fill-current' />
              <span className='font-semibold text-gray-900 dark:text-gray-100'>{r.rating.toFixed(1)}</span>
            </div>
          </div>
        ))}
        
        {results.length === 0 && (
          <div className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'>
            <p>No results found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPopover


