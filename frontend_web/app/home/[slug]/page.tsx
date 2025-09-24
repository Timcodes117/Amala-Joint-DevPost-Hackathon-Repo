"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import EmblaCarousel from '@/components/embla-carousel'
import { CheckCircle2, Clock, Heart, MapPin, Star } from 'lucide-react'
import { HiCheckBadge } from 'react-icons/hi2'

function Page({params}:{params: {slug: string}}) {
    const router = useRouter()
    const CloseModal = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/home");
        }
    };

  return (
    <>
    <div className='fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4' onClick={CloseModal}>
      <div className='w-full md:max-w-[1000px] h-[92vh] md:h-[558px] max-h-[92vh] md:max-h-[558px] p-0 md:p-4 relative bg-white bg_2 md:rounded-[24px] rounded-t-[24px] shadow-xl border border-black/5 flex flex-col overflow-hidden' onClick={(e) => e.stopPropagation()}>
        <div className='flex items-center justify-end w-fit absolute p-2 md:px-6 top-1 md:top-0 right-2 z-50'>
          <button onClick={CloseModal} aria-label='Close' className='p-2  rounded-full hover:bg-black/5 active:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/20'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='h-5 w-5 '>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 6l12 12M18 6L6 18' />
            </svg>
          </button>
        </div>
        <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-2 max-h-full md:max-h-[530px]'>
            <div className='w-full h-[38vh] md:h-full md:rounded-[24px] rounded-t-[24px] bg-gray-100/10 relative'>
            
            {/* Favorite button */}
        <button
        //   onClick={toggleFav}
          aria-label="favorite"
          className="absolute top-4 right-4 h-10 w-10 z-50 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
        >
          <Heart
            size={18}
            className={'fill-white text-white'}
          />
        </button>
                <EmblaCarousel 
                  images={[
                    '/images/amala-billboard.png',
                    '/images/amala-billboard.png',
                    '/images/amala-billboard.png'
                  ]}
                  options={{ loop: true }}
                />
            </div>
            <div className='w-full h-[54vh] md:h-full relative flex flex-col overflow-hidden'>
            <div className='w-full flex-1 relative flex flex-col overflow-y-auto overflow-x-hidden px-4 md:px-4 csb'>

          <p className='text-xs md:text-sm text-gray-800 my-2 md:my-3 text_muted '>This is where I type the location Show map</p>
          <br />
          <p className=' text-2xl md:text-4xl font-medium '>The Amala Joint</p>
          {/* <br /> */}
              
              <p className='text-xs md:text-sm text-gray-800 my-2 md:my-3 text_muted flex items-center gap-1'>Verified By Google <HiCheckBadge className='pry-color ml-1 min-w-[18px]' size={18}  /></p>

          <div className='flex flex-row gap-2 items-center mt-2 md:mt-3'>

          <div className="flex items-center gap-1 pry-yellow-color ">
            <Star size={14} className="fill-current" />
            <span className="font-semibold text-sm">4.8</span>
          </div>

          <span className='text-gray-800'>•</span>
        

        {/* Meta: hours, distance, eta */}
        <div className=" text_muted flex items-center gap-2 text-xs md:text-sm text-gray-800">
          <div className="flex items-center gap-1">
            <Clock size={18} />
            <span>
              8:00 - 21:00
            </span>
          </div>
          <span>•</span>
          <span>
            12km (20 mins)
          </span>
        </div>
        </div>
        <br />
          <p className=' text-2xl md:text-[28px] font-medium my-3 md:my-4 '>₦1,500 - ₦2,000</p>
        <br />
          <p className='text-gray-800 text-sm md:text-base text_muted '>A great amala spot isn’t just a place to eat it’s an experience. The air greets you with the rich aroma of freshly made stews like ewedu, gbegiri, and spicy ata. The amala itself is ...more</p>
          <br />
          <hr />
          <br />
          <div className='w-full flex items-center justify-between'>
            <p className='text-sm md:text-base'>Testimonials</p>
            <p className='text-gray-800 text-xs md:text-sm text_muted '>See all</p>
          </div>
          <div className='w-full flex flex-col mt-2'>
            <p className='text-sm md:text-base font-bold  '>Tim</p>
            <p className='text-gray-800 text-sm md:text-base text_muted '>“I really love this place! and they served me well. I’ll recommend to anyone”</p>
          </div>
          <br />
          <hr />
          <br />
          <div className="mt-2 md:mt-4 flex items-center gap-3 sticky bottom-0 left-0 right-0  backdrop-blur-2xl py-3">
          <button
            // onClick={onExplore}
            className="flex-1 h-[48px] md:h-[43px] rounded-full pry-bg text-white px-4 text-[16px] md:text-[15px]"
          >
            Get Directions
          </button>
          <button
            // onClick={onDirections}
            className="flex-1 h-[48px] md:h-[43px] rounded-full grey text-white px-4 text-[16px] md:text-[15px]"
          >
            Call Now
          </button>
        </div>
        <br />
        <br />
            </div>
            </div>
        </div>
        
      </div>
    </div>
    </>
  )
}

export default Page