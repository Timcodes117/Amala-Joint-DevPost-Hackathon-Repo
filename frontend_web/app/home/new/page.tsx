"use client"
import React from 'react'
import VerifyResultsContainer from '@/components/verify-results-container'

function Page() {

  return (
    <>
    {/* search and filters */}
    <div className='flex flex-col '> 
      <br />
          <b className='text-[20px] font-semibold'>Verify Stores near you!</b>
          <p className='text-sm text-gray-500'>Help the community grow by verifying the stores closest to you.</p>
      <br />
          </div>
    {/* <SearchBar data={DUMMY} /> */}
        {/* <br /> */}
        {/* results */}
       {/* <div className='flex flex-row items-center justify-between'>
       

          <div className='flex flex-row items-center text-base gap-2'>
            <ArrowUpDown size={18} />
            <b>A-Z</b>
          </div>

       </div> */}
      
          <hr className='border border_1 my-2' />
      
      <div className='w-full h-full flex-grow flex flex-col overflow-y-scroll csb gap-4'>
        {new Array(5).fill("test").map((_, index) => (
          <VerifyResultsContainer
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
            onIgnore={() => {}}
            onVerify={() => {}}
          />
        ))}
      </div>
    </>
  )
}

export default Page