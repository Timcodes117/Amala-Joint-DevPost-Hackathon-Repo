'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function AuthLayout({children}:{children: React.ReactNode}) {

  const router = useRouter()
  const { theme } = useTheme()

  React.useEffect(() => {
    if('user' in localStorage) {
      if(JSON.parse(localStorage.getItem('user') as string)?.is_verified) {
        router.replace('/home')
      } 
    }
  }, [])


  return (
    <>
      {/* <MainHeader /> */}
      <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 min-h-[100vh]'>
        <div className='w-full h-full flex flex-col items-center   px-4'>
          {/* Header */}
          <Link href={"/"} className='flex-shrink-0 w-full my-8 px-10'>
                    <Image 
                        src={"/svgs/logo.svg"} 
                        className={`h-[24px] w-[120px] sm:h-[28px] sm:w-[140px] md:h-[32px] md:w-[156px] bg-contain bg-center ${theme === "light" ? 'invert' : ''}`} 
                        alt="Amala Logo"
                        width={156}
                        height={32}
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