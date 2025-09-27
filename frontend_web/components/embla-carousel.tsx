"use client"
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'

export interface EmblaCarouselProps {
  images: string[]
  className?: string
  options?: Parameters<typeof useEmblaCarousel>[0]
}

export default function EmblaCarousel({ images, className = '', options }: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const onSelect = useCallback((api?: UseEmblaCarouselType[1]) => {
    const current = api ?? emblaApi
    if (!current) return
    setSelectedIndex(current.selectedScrollSnap())
  }, [emblaApi])

  const scrollTo = useCallback((idx: number) => {
    if (!emblaApi) return
    emblaApi.scrollTo(idx)
  }, [emblaApi])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set([...prev, index]))
  }, [])

  const handleImageError = useCallback((index: number) => {
    console.warn(`Failed to load image at index ${index}:`, images[index])
    // Don't add to loadedImages to show fallback
  }, [images])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  if (!images || images.length === 0) return null

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className='overflow-hidden w-full h-full rounded-[24px]' ref={emblaRef}>
        <div className='flex w-full h-full'>
          {images.map((src, i) => (
            <div key={i} className='min-w-0 flex-[0_0_100%] w-full h-full relative'>
              {loadedImages.has(i) ? (
                <img
                  src={src}
                  alt={`slide-${i}`}
                  className='w-full h-full object-cover'
                  draggable={false}
                />
              ) : (
                <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                  <div className='text-gray-400 text-sm'>Loading...</div>
                </div>
              )}
              {/* Hidden image for preloading */}
              <img
                src={src}
                alt={`preload-${i}`}
                style={{ display: 'none' }}
                onLoad={() => handleImageLoad(i)}
                onError={() => handleImageError(i)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='absolute inset-y-0 left-0 flex items-center p-2'>
        <button
          aria-label='Previous slide'
          onClick={scrollPrev}
          className='p-2 rounded-full bg-black/50 text-white hover:bg-black/60 active:bg-black/70 backdrop-blur-sm'
        >
          {/* left chevron */}
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='h-5 w-5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
          </svg>
        </button>
      </div>

      <div className='absolute inset-y-0 right-0 flex items-center p-2'>
        <button
          aria-label='Next slide'
          onClick={scrollNext}
          className='p-2 rounded-full bg-black/50 text-white hover:bg-black/60 active:bg-black/70 backdrop-blur-sm'
        >
          {/* right chevron */}
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='h-5 w-5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
          </svg>
        </button>
      </div>

      <div className='absolute bottom-3 left-3 hidden md:flex items-center gap-2 px-2 py-2 rounded-[16px] bg_2 backdrop-blur-sm'>
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollTo(i)}
            style={{
                backgroundImage: `url(${images[i]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            className={`h-[64px] w-[64px]  bg-white rounded-[12px] transition ${i === selectedIndex ? 'opacity-100' : 'opacity-50 hover:opacity-70'}`}
          />
        ))}
      </div>

      <div className=' absolute bottom-3 left-1/2 -translate-x-1/2 md:hidden flex items-center gap-2 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm'>
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${i === selectedIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  )
}


