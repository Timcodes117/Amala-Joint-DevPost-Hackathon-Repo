'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { RxDividerVertical } from 'react-icons/rx'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/contexts/LanguageContext'
import ThemeToggle from './theme-toggle'
import { Select } from '@radix-ui/themes'
import { Menu, X } from 'lucide-react'

function MainHeader() {
    const { t, language, setLanguage } = useLanguage()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    // Helper function to determine if we should invert
    const shouldInvert = mounted && resolvedTheme === 'light'

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    // Smooth scroll function
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
        setIsMobileMenuOpen(false) // Close mobile menu after clicking
    }

    return (
        <div className='flex flex-col'>
            {/* Top Banner */}
            <div className='w-full h-[24px] sm:h-[30px] bg-black/50 text-white text-xs flex items-center justify-center px-4'>
                <p className='text-center'>{t('app_download')}</p>
            </div>

            {/* Main Header */}
            <div className="w-full h-[60px] sm:h-[70px] md:h-[80px] flex flex-row items-center justify-between text-sm px-4 sm:px-6 md:px-8 lg:px-20">
                {/* Logo */}
                <div className='flex-shrink-0'>
                    <Image 
                        src={"/svgs/logo.svg"} 
                        className={`h-[24px] w-[120px] sm:h-[28px] sm:w-[140px] md:h-[32px] md:w-[156px] bg-contain bg-center ${shouldInvert ? 'invert' : ''}`} 
                        alt="Amala Logo"
                        width={156}
                        height={32}
                    />
                </div>

                {/* Desktop Navigation */}
                <nav className='gap-6 lg:gap-10 lg:flex w-fit items-center justify-center text-center flex-1 hidden'>
                    <button onClick={() => scrollToSection('home')} className='hover:text-gray-300 transition-colors'>{t('home')}</button>
                    <button onClick={() => scrollToSection('how-it-works')} className='hover:text-gray-300 transition-colors'>{t('how_it_works')}</button>
                    <button onClick={() => scrollToSection('about')} className='hover:text-gray-300 transition-colors'>{t('about')}</button>
                    <button onClick={() => scrollToSection('faq')} className='hover:text-gray-300 transition-colors'>{t('faq')}</button>
                </nav>

                {/* Desktop Controls */}
                <div className="h-[40px] sm:h-[45px] md:h-[50px] flex items-center gap-4 sm:gap-6 lg:gap-10">
                    <ThemeToggle />
                    
                    {/* Language Selector */}
                    <div className='flex gap-2 items-center justify-center'>
                        <Image 
                            src={"/svgs/Translate.svg"} 
                            className={`h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] bg-contain bg-center ${shouldInvert ? 'invert' : ''}`} 
                            alt="Language"
                            width={18}
                            height={18}
                        />
                        <Select.Root value={language} onValueChange={(value) => setLanguage(value as 'en' | 'yo')}>
                            <Select.Trigger 
                                variant="ghost" 
                                className="!bg-transparent !border-none !shadow-none focus:!ring-0 focus:!ring-offset-0 focus:!outline-none !cursor-pointer text-xs sm:text-sm"
                                style={{color: !shouldInvert ? 'white' : 'black'}}
                            />
                            <Select.Content>
                                <Select.Item value="en">English</Select.Item>
                                <Select.Item value="yo">Yoruba</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    </div>

                    {/* Auth Buttons - Hidden on mobile */}
                    <div className='hidden sm:flex gap-2 items-center justify-center'>
                        <Link href="/auth/login" className='text-xs sm:text-sm'>{t('login')}</Link>
                        <RxDividerVertical size={16} className='sm:hidden md:block' />
                        <Link href="/auth/signup" className='px-3 sm:px-4 text-center py-1.5 sm:py-2 rounded-full pry-bg text-white text-xs sm:text-sm hover:opacity-90 transition-opacity'>
                            {t('create_account')}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={toggleMobileMenu}
                        className='lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X size={20} className={shouldInvert ? 'text-black' : 'text-white'} />
                        ) : (
                            <Menu size={20} className={shouldInvert ? 'text-black' : 'text-white'} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='lg:hidden bg_2 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700'>
                    <nav className='flex flex-col px-4 py-4 space-y-4'>
                        <button 
                            onClick={() => scrollToSection('home')}
                            className=' transition-colors py-2 text-left'
                        >
                            {t('home')}
                        </button>
                        <button 
                            onClick={() => scrollToSection('how-it-works')}
                            className=' transition-colors py-2 text-left'
                        >
                            {t('how_it_works')}
                        </button>
                        <button 
                            onClick={() => scrollToSection('about')}
                            className=' transition-colors py-2 text-left'
                        >
                            {t('about')}
                        </button>
                        <button 
                            onClick={() => scrollToSection('faq')}
                            className=' transition-colors py-2 text-left'
                        >
                            {t('faq')}
                        </button>
                        
                        {/* Mobile Auth Buttons */}
                        <div className='flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
                            <Link href="/auth/login" className='w-full px-4 py-2 text-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
                                {t('login')}
                            </Link>
                            <Link href="/auth/signup" className='w-full px-4 py-2 text-center rounded-full pry-bg text-white hover:opacity-90 transition-opacity'>
                                {t('create_account')}
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    )
}

export default MainHeader
