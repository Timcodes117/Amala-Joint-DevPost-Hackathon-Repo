import { Metadata } from 'next';
import React from 'react'
import { Heart, Store, User2 } from 'lucide-react';
import StoresMap from '@/components/maps/stores-map';
import AppHeader from '@/components/app_header';


export const metadata: Metadata = {
  title: "Home",
  description: "created by the A-Train Group for Amala hackathon 2025",
};

function HomeLayout({children}:{children: React.ReactNode}) {

  return (
    <div className='w-full h-[100vh] !max-h-[100vh] p-4 flex flex-row gap-4'>
      <div className='w-[80px] h-full bg_2 rounded-[12px] py-4 flex flex-col gap-6 items-center justify-end border border_1'>
        <div className='flex flex-col gap-2 items-center justify-center'>
        <div className='w-[28px] h-[28px] rounded-full bg-black bg-[url(/bot.gif)] bg-center bg-cover' />
          <p className='text-sm'>AI Chat</p>
        </div>
        <div className='flex opacity-80 flex-col gap-2 items-center justify-center'>
          <Store size={24} />
          <p className='text-sm'>Stores</p>
        </div>
        <div className='flex opacity-80 flex-col gap-2 items-center justify-center'>
          <Heart size={24} />
          <p className='text-sm'>Saved</p>
        </div>
        <div className='flex opacity-80 flex-col gap-2 items-center justify-center'>
          <User2 size={24} />
          <p className='text-sm'>Profile</p>
        </div>
      </div>

      <div className='w-full h-full flex flex-col gap-4 flex-grow min-h-0 overflow-hidden'>
        <AppHeader />
      <div className='w-full h-full flex flex-row gap-4 flex-1 min-h-0 overflow-hidden'>
      <div className='min-w-[368px] w-[368px] h-full bg_3 rounded-[24px] p-4 overflow-hidden flex flex-col flex-1 min-h-0 border border_1'>
      {children}
        {/* <br />
        <br /> */}
      </div>

      <div className='w-full h-full flex-grow bg_3 rounded-[24px] flex flex-col gap-4 overflow-hidden border border_1'>
        {/* here */}
        <StoresMap />
      </div>
      </div>
      </div>
    </div>
  )
}

export default HomeLayout