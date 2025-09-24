import React from 'react'

function Page({params}:{params: {slug: string}}) {
  return (
    <>
    <div className='w-full h-full flex flex-col gap-4 backdrop-blur-sm items-center justify-center fixed translate-x-0 -translate-y-0 left-0 top-0 z-50'>
      <h1 className='text-2xl font-bold bg-white text-black'>Details {params.slug}</h1>
    </div>
    <div className='w-full h-[500px] max-w-[1000px] max-h-[500px] bg-white rounded-[12px] p-4 flex flex-col gap-4 backdrop-blur-sm items-center justify-center fixed translate-x-1/3 -translate-y-1/2   top-1/2 z-50'>
      <h1 className='text-2xl font-bold bg-white text-black'>Details {params.slug}</h1>
    </div>
    </>
  )
}

export default Page