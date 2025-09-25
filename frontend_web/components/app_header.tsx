'use client'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from './theme-toggle'
import { BellDot, MapPinned } from 'lucide-react'
import MobileSidebar from './MobileSidebar'

function AppHeader() {
  const { theme } = useTheme()

  return (
    <header className='w-full h-[50px] flex flex-row gap-4 items-center justify-between'>
      <MobileSidebar />
        <Link href={"/"} className='flex-shrink-0 w-fit '>
                    <Image 
                        src={"/svgs/logo.svg"} 
                        className={`h-[24px] w-[120px] sm:h-[28px] sm:w-[140px] md:h-[32px] md:w-[156px] bg-contain bg-center ${theme === 'light' ? 'invert' : ''}`} 
                        alt="Amala Logo"
                        width={156}
                        height={32}
                    />
                </Link>

                <div className='flex flex-row gap-3'>
                    <div className='hidden md:flex flex-row gap-2 p-2 px-3 items-center justify-center rounded-full bg-gray-100/10'>
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