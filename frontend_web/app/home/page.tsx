"use client"
import { ArrowUpDown } from 'lucide-react'
import SpotCard from '@/components/spot-card'
import { type SearchResult } from '@/components/search-popover'
import SearchBar from '@/components/search-bar'
import React, { useMemo } from 'react'

function Page() {
  const DUMMY: SearchResult[] = useMemo(
    () =>
      new Array(8).fill(0).map((_, i) => ({
        id: `spot-${i}`,
        name: `The Amala Palace ${i + 1}`,
        distanceKm: 12,
        etaMinutes: 20,
        isOpen: true,
        rating: 4.8,
        thumbnailUrl: undefined,
      })),
    []
  )

  return (
    <>
    {/* search and filters */}
    <SearchBar data={DUMMY} />
        <br />
        {/* results */}
       <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-col '> 
          <b className='text-[16px] font-semibold'>Amala Spots near you</b>
          <p className='text-sm text-gray-500'>Enjoy tasty Amala right close to you</p>
          </div>

          <div className='flex flex-row items-center text-base gap-2'>
            <ArrowUpDown size={18} />
            <b>A-Z</b>
          </div>

       </div>
      
          <hr className='border border_1 my-2' />
      
      <div className='w-full h-full flex-grow flex flex-col overflow-y-scroll csb gap-4'>
        {new Array(5).fill("test").map((_, index) => (
          <SpotCard
            key={index}
            name={`The Amala Joint ${index + 1}`}
            location={'This is where I type the location'}
            opensAt={'8:00'}
            closesAt={'21:00'}
            distanceKm={12}
            etaMinutes={20}
            rating={4.8}
            verified
            imageUrl={'/images/amala-billboard.png'}
            onDirections={() => {}}
            onExplore={() => {}}
          />
        ))}
      </div>
    </>
  )
}

export default Page