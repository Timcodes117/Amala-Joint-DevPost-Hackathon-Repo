'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface LogoMarqueeProps {
  logos?: Array<{
    src: string
    alt: string
    width?: number
    height?: number
  }>
  speed?: number
  className?: string
}

export default function LogoMarquee({ 
  logos = [], 
  speed = 30,
  className = ""
}: LogoMarqueeProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Default dummy logos if none provided
  const defaultLogos = [
    { src: "https://via.placeholder.com/120x60/4F46E5/FFFFFF?text=Logo+1", alt: "Logo 1", width: 120, height: 60 },
    { src: "https://via.placeholder.com/120x60/059669/FFFFFF?text=Logo+2", alt: "Logo 2", width: 120, height: 60 },
    { src: "https://via.placeholder.com/120x60/DC2626/FFFFFF?text=Logo+3", alt: "Logo 3", width: 120, height: 60 },
    { src: "https://via.placeholder.com/120x60/7C3AED/FFFFFF?text=Logo+4", alt: "Logo 4", width: 120, height: 60 },
    { src: "https://via.placeholder.com/120x60/EA580C/FFFFFF?text=Logo+5", alt: "Logo 5", width: 120, height: 60 },
    { src: "https://via.placeholder.com/120x60/0891B2/FFFFFF?text=Logo+6", alt: "Logo 6", width: 120, height: 60 },
    { src: "https://via.placeholder.com/120x60/16A34A/FFFFFF?text=Logo+7", alt: "Logo 7", width: 120, height: 60 },
    { src: "https://via.placeholder.com/120x60/CA8A04/FFFFFF?text=Logo+8", alt: "Logo 8", width: 120, height: 60 },
  ]

  const logoList = logos.length > 0 ? logos : defaultLogos

  if (!mounted) {
    return null
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Left gradient overlay */}
      <div 
        className="absolute left-0 top-0 z-10 h-full w-8 sm:w-16 md:w-24 lg:w-32 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${
            theme === 'dark' ? 'var(--color-background)' : 'rgba(255, 255, 255, 0.95)'
          } 60%, transparent 100%)`
        }}
      />
      
      {/* Right gradient overlay */}
      <div 
        className="absolute right-0 top-0 z-10 h-full w-8 sm:w-16 md:w-24 lg:w-32 pointer-events-none"
        style={{
          background: `linear-gradient(to left, ${
            theme === 'dark' ? 'var(--color-background)' : 'rgba(255, 255, 255, 0.95)'
          } 60%, transparent 100%)`
        }}
      />

      {/* Scrolling logos container */}
      <div className="flex animate-scroll">
        {/* First set of logos */}
        <div className="flex items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 px-4 sm:px-8 md:px-12 lg:px-20">
          {logoList.map((logo, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 120}
                height={logo.height || 60}
                className={`object-contain filter grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] h-auto ${theme === "dark"? "invert" : ""}`}
              />
            </div>
          ))}
        </div>

        {/* Duplicate set for seamless loop */}
        <div className="flex items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          {logoList.map((logo, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 120}
                height={logo.height || 60}
                className={`object-contain filter grayscale hover:grayscale-0 transition-all duration-300 hover:scale-105 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] h-auto ${theme === "dark"? "invert" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll ${isMobile ? speed * 1.5 : speed}s linear infinite;
          width: calc(200% + 32px);
        }

        @media (min-width: 640px) {
          .animate-scroll {
            width: calc(200% + 48px);
          }
        }

        @media (min-width: 768px) {
          .animate-scroll {
            width: calc(200% + 64px);
          }
        }

        @media (min-width: 1024px) {
          .animate-scroll {
            width: calc(200% + 80px);
          }
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
