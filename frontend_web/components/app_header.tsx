'use client'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import React from 'react'
import ThemeToggle from './theme-toggle'
import { BellDot, MapPin, MapPinned } from 'lucide-react'

function AppHeader() {
  const { theme, resolvedTheme } = useTheme()

  return (
    <header className='w-full h-[50px] flex flex-row gap-4 items-center justify-between'>
        <Link href={"/"} className='flex-shrink-0 w-fit '>
                    <img 
                        src={"/svgs/logo.svg"} 
                        className={`h-[24px] w-[120px] sm:h-[28px] sm:w-[140px] md:h-[32px] md:w-[156px] bg-contain bg-center ${theme === 'light' ? 'invert' : ''}`} 
                        alt="Amala Logo"
                    />
                </Link>

                <div className='flex flex-row gap-3'>
                    <div className='flex flex-row gap-2 p-2 px-3 items-center justify-center rounded-full bg-gray-100/10'>
                    <MapPinned size={20} /> <p className='text-sm'>Your Location</p>
                    </div>
                    
                    <div className='flex flex-row gap-2 p-2 items-center justify-center rounded-full bg-gray-100/10'>
                    <BellDot size={20} />
                    </div>
                    <div className='flex flex-row gap-2 p-2 items-center justify-center rounded-full bg-gray-100/10'>
                    <ThemeToggle />
                    </div>
                </div>

        </header>
  )
}

export default AppHeader