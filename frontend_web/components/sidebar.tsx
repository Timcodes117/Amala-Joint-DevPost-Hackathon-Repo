"use client"
import {  Store, Heart, User2 } from 'lucide-react'
import React from 'react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='w-[80px] h-full  bg_2 rounded-[12px] py-4 hidden md:flex flex-col gap-6 items-center justify-end shadow-md'>
        <Link href={'/home/chat'} className='flex flex-col gap-2 items-center justify-center'>
        <div  className='w-[28px] h-[28px] rounded-full bg-black bg-[url(/bot.gif)] bg-center bg-cover' />
          <p className='text-xs'>AI Chat</p>
        </Link>
        <Link href={'/home/'} style={{color: pathname === '/home' ? '#CF3A3A' : 'gray'}} className='flex opacity-80 flex-col gap-2 items-center justify-center'>
          <Store size={24} />
          <p className='text-xs'>Stores</p>
        </Link>
        <Link href={'/home/saved'} style={{color: pathname === '/home/saved' ? '#CF3A3A' : 'gray'}} className='flex opacity-80 flex-col gap-2 items-center justify-center'>
          <Heart size={24} />
          <p className='text-xs'>Saved</p>
        </Link>
        <Link href={'/home/profile'} style={{color: pathname === '/home/profile' ? '#CF3A3A' : 'gray'}} className='flex opacity-80 flex-col gap-2 items-center justify-center'>
          <User2 size={24} />
          <p className='text-xs'>Profile</p>
        </Link>
      </div>
  )
}

export default Sidebar