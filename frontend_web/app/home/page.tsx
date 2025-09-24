"use client"
import { ArrowUpDown, Plus } from 'lucide-react'
import { type SearchResult } from '@/components/search-popover'
import SearchBar from '@/components/search-bar'
import React, { useMemo } from 'react'
import ResultsContainer from '@/components/resultsContainer'
import Link from 'next/link'
import StoresMap from '@/components/maps/stores-map'

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

      <div className='w-full flex-1 min-h-0 flex flex-col md:overflow-y-auto csb gap-4 overscroll-contain'>
          <div  className='relative md:hidden flex flex-row items-center justify-end w-full min-h-[200px] overflow-hidden rounded-xl bg-gray-100 mb-2'>
            <StoresMap />
            <Link
              href='?mobileMap=1'
              className='md:hidden absolute top-3 right-3 px-3 py-2 rounded-full bg-black/80 text-white text-sm'
              aria-label='Open map full-screen'
            >
              Open Map
            </Link>
          </div>
      
        {new Array(5).fill("test").map((_, index) => (
          <ResultsContainer
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
        <br />
      </div>

      {/* Floating action button to add a new store */}
      <Link href='/home/new' aria-label='Add new store'
        className='absolute bottom-6 right-6 z-40 h-14 w-14 rounded-full pry-bg text-white flex items-center justify-center shadow-lg shadow-black/20 hover:opacity-90 active:opacity-80'>
        <Plus size={24} />
      </Link>
    </>
  )
}

export default Page