"use client"
import { Metadata } from 'next';
import React from 'react'
import { ChevronsLeft, ChevronsRight, Heart, Store, User2 } from 'lucide-react';
import StoresMap from '@/components/maps/stores-map';
import AppHeader from '@/components/app_header';
import Link from 'next/link'; 
import Sidebar from '@/components/sidebar';

import Head from 'next/head';
import { TbArrowsLeft, TbArrowsRight } from 'react-icons/tb';
import { BsQuestion } from 'react-icons/bs';
import SearchBar from '@/components/search-bar';

const PageHead = () => (
  <Head>
    <title>Home</title>
    <meta name="description" content="created by the A-Train Group for Amala hackathon 2025" />
    <meta property="og:title" content="Home" />
    <meta property="og:description" content="created by the A-Train Group for Amala hackathon 2025" />
    <meta property="og:type" content="website" />
  </Head>
);

function HomeLayout({children}:{children: React.ReactNode}) {
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);

  

  return (
    <div className='w-full h-[100vh] !max-h-[100vh] p-4 flex flex-row gap-4'>
      <PageHead />
      <Sidebar />

      <div className='w-full h-full flex flex-col gap-4 flex-grow min-h-0 overflow-hidden'>
        <AppHeader />
      <div className='w-full h-full flex flex-row gap-4 flex-1 min-h-0 overflow-hidden'>
      {!isFullScreen && <div className='min-w-[368px] w-[368px] h-full hidden  bg-gray-100/10 rounded-[24px] p-4 overflow-hidden md:flex flex-col flex-1 min-h-0 shadow-md'>
      {children}
        {/* <br />
        <br /> */}
      </div>}

      <div className='w-full h-full flex-grow bg_3 rounded-[24px] relative flex flex-col gap-4 overflow-hidden shadow-md'>
        {/* here */}
        <div className='absolute w-full top-0 py-4 flex items-center justify-between px-4 z-30'>
        <div onClick={() => setIsFullScreen(!isFullScreen)} className='w-[44px] h-[44px] rounded-full bg-[#1A1A1A] shadow-md md:flex hidden items-center justify-center'>
              {isFullScreen ? <ChevronsRight size={20} color='white' /> : <ChevronsLeft size={20} color='white' />}              
          </div>

        <div className='flex flex-row gap-2 max-w-[500px] w-full' style={{display: isFullScreen ? 'flex' : 'none'}}>
          <SearchBar data={[]} placeholder='Search for a store' className='w-full' />
          </div>

        <div onClick={() => setIsFullScreen(!isFullScreen)} className='w-[44px] h-[44px] rounded-full bg-[#1A1A1A] shadow-md md:flex hidden items-center justify-center'>
              <BsQuestion size={20} color='white' />             
          </div>


        </div>
        <StoresMap />
      </div>
      </div>
      </div>
    </div>
  )
}

export default HomeLayout