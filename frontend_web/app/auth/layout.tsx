'use client'

import MainHeader from '@/components/main-header'
import InputField from '@/components/input-field'
import React, { useState } from 'react'
import { Eye } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

function AuthLayout({children}:{children: React.ReactNode}) {

  const { theme, resolvedTheme } = useTheme()


  return (
    <>
      {/* <MainHeader /> */}
      <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 min-h-[100vh]'>
        <div className='w-full h-full flex flex-col items-center   px-4'>
          {/* Header */}
          <Link href={"/"} className='flex-shrink-0 w-full my-8 px-10'>
                    <img 
                        src={"/svgs/logo.svg"} 
                        className={`h-[24px] w-[120px] sm:h-[28px] sm:w-[140px] md:h-[32px] md:w-[156px] bg-contain bg-center ${theme === "light" ? 'invert' : ''}`} 
                        alt="Amala Logo"
                    />
                </Link>
          <div className='w-full max-w-md'>
            {children}
            <br />
            <br />
        </div>
        </div>
        <div className='w-full h-full lg:flex flex-col items-center justify-center p-6 px-20 hidden'>
        <div className='w-full h-full max-h-[90vh] flex flex-col items-center justify-center relative rounded-[16px] bg-[url(/images/amala.png)] bg-center bg-cover '>
          
        </div>
        </div>
      </div>
    </>
  )
}

export default AuthLayout