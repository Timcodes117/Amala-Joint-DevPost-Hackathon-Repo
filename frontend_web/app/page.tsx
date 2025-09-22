"use client"
import FAQAccordion from '@/components/faq-accordion'
import Footer from '@/components/footer'
import LogoMarquee from '@/components/logo-marquee'
import MainHeader from '@/components/main-header'
import UserLocationMap from '@/components/maps/userMap'
import { useLanguage } from '@/contexts/LanguageContext'
import { Quote } from 'lucide-react'
import React from 'react'
import { BsQuote } from 'react-icons/bs'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'

function Page() {
  const { t } = useLanguage()
  
  // Refs for scroll-triggered animations
  const whatWeDoRef = useRef(null)
  const catalogueRef = useRef(null)
  const communityRef = useRef(null)
  const testimonialRef = useRef(null)
  const downloadRef = useRef(null)
  
  const whatWeDoInView = useInView(whatWeDoRef, { once: true, margin: "-100px" })
  const catalogueInView = useInView(catalogueRef, { once: true, margin: "-100px" })
  const communityInView = useInView(communityRef, { once: true, margin: "-100px" })
  const testimonialInView = useInView(testimonialRef, { once: true, margin: "-100px" })
  const downloadInView = useInView(downloadRef, { once: true, margin: "-100px" })
  
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const springTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 15
  }

  const hoverScale = {
    scale: 1.05,
    transition: springTransition
  }

  const tapScale = {
    scale: 0.95,
    transition: springTransition
  }
  
  return (
    <>
      <MainHeader />
      <main className='w-full flex-col px-4 sm:px-6 md:px-8 lg:px-20 max-w-screen-2xl mx-auto overflow-x-hidden'>
        {/* hero section */}
        <motion.section 
          id="home"
          className='w-full flex flex-col items-center'
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.p 
            className='text-white p-2 rounded-full bg-[#CF3A3A90] text-xs px-5 mt-8 sm:mt-12 md:mt-16 lg:mt-20'
            variants={scaleIn}
          >
            {t('trusted_users')}
          </motion.p>
          <motion.h1 
            className='text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-center flex mt-5 leading-tight sm:leading-8 md:leading-10 px-4 font-semibold'
            variants={fadeInUp}
          >
            {t('find_perfect_plate')}
          </motion.h1>
          <motion.h1 
            className='text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-center flex items-center justify-center mt-2 px-4 font-semibold'
            variants={fadeInUp}
          >
            {t('amala_every_time')} 
            <motion.span 
              className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-[82px] lg:w-[82px] bg-[url(/svgs/bowl.svg)] bg-contain bg-center bg-no-repeat ml-2"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                // repeat: Infinity,
                repeatDelay: 3
              }}
            />
          </motion.h1>
          <motion.p 
            className='text-sm sm:text-base text-gray-500 text-center mt-4 px-4 max-w-2xl'
            variants={fadeInUp}
          >
            {t('discover_description')}
          </motion.p>
          <motion.div 
            className='w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-8 px-4'
            variants={fadeInUp}
          >
            <motion.button 
              className='w-full sm:w-auto rounded-full px-6 py-3 bg-[#2c2c2c] text-sm text-white hover:opacity-90 transition-opacity'
              whileHover={hoverScale}
              whileTap={tapScale}
            >
              {t('add_spot')}
            </motion.button>
            <motion.button 
              className='w-full sm:w-auto rounded-full px-6 py-3 pry-bg text-sm text-white hover:opacity-90 transition-opacity'
              whileHover={hoverScale}
              whileTap={tapScale}
            >
              {t('explore_map')}
            </motion.button>
          </motion.div>
          <motion.div 
            className='w-full mt-12 mb-8 flex justify-center items-center'
            variants={fadeInUp}
          >
            <UserLocationMap />
          </motion.div>
          <br />
          <motion.div 
            className='w-full my-8'
            variants={fadeInUp}
          >
            <LogoMarquee logos={[
              {src: "/next.svg", alt: "Logo", width: 120, height: 60},
              {src: "/tools/figma.svg", alt: "Logo", width: 120, height: 60},
              {src: "/tools/google-cloud.png", alt: "google", width: 160, height: 80},
              {src: "/tools/react.png", alt: "react", width: 120, height: 60},
              {src: "/tools/git.png", alt: "git", width: 120, height: 60},
              {src: "/tools/py.png", alt: "python", width: 100, height: 50},
            ]} />
          </motion.div>
        </motion.section>
          <br />
          {/* what we do? */}
          <motion.section 
            id="how-it-works"
            ref={whatWeDoRef}
            className='w-full flex flex-col items-center mt-16 sm:mt-20 md:mt-24'
            initial="initial"
            animate={whatWeDoInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className='text-2xl font-bold sm:text-3xl md:text-4xl lg:text-[48px] w-full text-center my-6 sm:my-8 md:my-10 px-4'
              variants={fadeInUp}
            >
              {t('what_we_do_title')}
            </motion.h2>
            
            <motion.div 
              className='w-full h-[280px] sm:h-[320px] md:h-[370px] rounded-[16px] bg-[#CF3A3A] bg-gradient-to-r from-[#CF3A3A] to-[#5a1111] max-w-[1100px] overflow-hidden p-6 sm:p-8 md:p-10 relative flex flex-col mx-4'
              variants={fadeInLeft}
              whileHover={{ scale: 1.02 }}
              transition={springTransition}
            >
              <motion.h3 
                className='w-full font-medium  z-10 text-xl sm:text-2xl md:text-[32px] !text-white'
                variants={fadeInUp}
              >
                {t('browse_verified_spots')}
              </motion.h3>
              <motion.h3 
                className='w-full font-medium  z-10 text-xl sm:text-2xl md:text-[32px] !text-white leading-tight sm:leading-8 md:leading-10'
                variants={fadeInUp}
              >
                {t('on_interactive_map')}
              </motion.h3>
              <motion.h3 
                className='absolute bottom-6 z-10 sm:bottom-12 md:bottom-20 left-6 sm:left-12 md:left-20 text-lg sm:text-xl md:text-[24px] !text-white'
                variants={fadeInUp}
              >
                {t('discover')}
              </motion.h3>

              <motion.img 
                src="/images/landing-shot.png" 
                alt="" 
                className='h-[200px] z-0 sm:h-[300px] md:h-[400px] lg:h-[489px] w-auto sm:w-[400px] md:w-[500px] lg:w-[652px] absolute -right-12 sm:-right-12 md:-right-10 -bottom-10 sm:-top-3 md:top-10 object-contain'
                variants={fadeInRight}
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 1,
                  // repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div> 

            <motion.div 
              className='w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-[32px] mt-6 sm:mt-8 md:mt-[32px] mx-4'
              variants={staggerContainer}
            >
              <motion.div 
                className='w-full rounded-[16px] h-[400px] sm:h-[450px] md:h-[492px] bg-[url(/images/purple-bg.png)] bg-cover relative p-6 sm:p-8 md:p-10 flex flex-col'
                variants={fadeInLeft}
                whileHover={{ scale: 1.02 }}
                transition={springTransition}
              >
                <motion.h3 
                  className='w-full font-medium text-3xl sm:text-3xl md:text-[32px] !text-white leading-tight sm:leading-8 md:leading-10'
                  variants={fadeInUp}
                >
                  {t('use_ai_helper')}
                </motion.h3>
                <motion.h3 
                  className='w-full font-medium text-3xl sm:text-3xl md:text-[32px] !text-white leading-tight sm:leading-8 md:leading-10'
                  variants={fadeInUp}
                >
                  {t('add_new_spot')}
                </motion.h3>
                <motion.h3 
                  className='w-full font-medium text-3xl sm:text-3xl md:text-[32px] !text-white leading-tight sm:leading-8 md:leading-10'
                  variants={fadeInUp}
                >
                  {t('seconds')}
                </motion.h3>
                <motion.h3 
                  className='w-full font-bold text-lg sm:text-xl md:text-[24px] !text-white mt-6 sm:mt-8 md:mt-10'
                  variants={fadeInUp}
                >
                  {t('contribute')}
                </motion.h3>

                <motion.div 
                  className='w-full flex flex-col items-center justify-center gap-3 sm:gap-5 absolute bottom-0 left-0 p-4 sm:p-6'
                  variants={fadeInUp}
                >
                  <motion.div 
                    className='w-fit rounded-[12px] bg-[#1A1A1A] py-2 relative px-2 flex justify-center'
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className='w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] rotate-z-45 bg-[#1A1A1A] absolute mx-auto -bottom-1' />
                    <p className='text-xs sm:text-sm text-white z-10'>{t('ai_helper_question')}</p>
                  </motion.div>
                  <motion.div 
                    className='w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-full bg-black bg-[url(/bot.gif)] bg-center bg-cover'
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className='w-full flex flex-col gap-4 sm:gap-6 md:gap-8'
                variants={staggerContainer}
              >
                <motion.div 
                  className='w-full rounded-[16px] h-[240px] sm:h-[270px] md:h-[292px] bg-[url(/images/amala-billboard.png)] p-4 sm:p-5 md:p-6 relative bg-contain bg-left-bottom flex flex-col bg-no-repeat bg-[#B75F4A]'
                  variants={fadeInRight}
                  whileHover={{ scale: 1.02 }}
                  transition={springTransition}
                >
                  <motion.h3 
                    className='w-full font-medium text-xl sm:text-2xl md:text-[30px] !text-white leading-tight sm:leading-8 md:leading-10'
                    variants={fadeInUp}
                  >
                    {t('help_community')}
                  </motion.h3>
                  <motion.h3 
                    className='w-full font-medium text-xl sm:text-2xl md:text-[30px] !text-white leading-tight sm:leading-8 md:leading-10'
                    variants={fadeInUp}
                  >
                    {t('confirming_visits')}
                  </motion.h3>
                  <motion.h3 
                    className='w-full font-medium text-xl sm:text-2xl md:text-[30px] !text-white leading-tight sm:leading-8 md:leading-10'
                    variants={fadeInUp}
                  >
                    {t('photos_reviews')}
                  </motion.h3>
                </motion.div>
                <motion.div 
                  className='w-full rounded-[16px] h-[140px] sm:h-[150px] md:h-[168px] bg-[url(/images/earth2.png)] bg-cover relative p-6 sm:p-8 md:p-10 flex flex-col'
                  variants={fadeInRight}
                  whileHover={{ scale: 1.02 }}
                  transition={springTransition}
                >
                  <motion.h3 
                    className='w-full font-medium text-xl sm:text-2xl md:text-[32px] !text-white text-center'
                    variants={fadeInUp}
                  >
                    {t('languages_support')}
                  </motion.h3>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.section>
          {/* <br /> */}
          <motion.section 
            ref={catalogueRef}
            className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-[32px] min-h-[500px] sm:min-h-[600px] md:min-h-[660px] mt-16 sm:mt-20 md:mt-24 lg:mt-[188px] bg-[#BBDABF] md:bg-transparent pt-10'
            initial="initial"
            animate={catalogueInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.div 
              className='md:flex flex-col w-full px-4 lg:px-0 hidden'
              variants={fadeInLeft}
            >
              <motion.h2 
                className='w-full font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight font-semibold'
                variants={fadeInUp}
              >
                {t('browse_catalogue')}
              </motion.h2>
              <motion.h2 
                className='w-full font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight font-semibold mt-2'
                variants={fadeInUp}
              >
                {t('verified_stores')}
              </motion.h2>
              <motion.div 
                className='mt-6 sm:mt-8'
                variants={fadeInUp}
              >
                <p className='w-full max-w-[450px] text-sm sm:text-base'>{t('discover_spots_description')}</p>
                <p className='w-full max-w-[450px] mt-4 sm:mt-5 text-sm sm:text-base'>{t('verified_listing_description')}</p>
              </motion.div>
            </motion.div>
            <motion.div 
              className='flex flex-col w-full px-4 lg:px-0 md:hidden !text-black'
              variants={fadeInLeft}
            >
              <motion.h2 
                className='w-full font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight'
                variants={fadeInUp}
              >
                {t('browse_catalogue')}
              </motion.h2>
              <motion.h2 
                className='w-full font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight mt-2'
                variants={fadeInUp}
              >
                {t('verified_stores')}
              </motion.h2>
              <motion.div 
                className='mt-6 sm:mt-8'
                variants={fadeInUp}
              >
                <p className='w-full max-w-[450px] text-sm sm:text-base'>{t('discover_spots_description')}</p>
                <p className='w-full max-w-[450px] mt-4 sm:mt-5 text-sm sm:text-base'>{t('verified_listing_description')}</p>
              </motion.div>
            </motion.div>
            <motion.div 
              className='w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full relative'
              variants={fadeInRight}
            >
              <motion.img 
                src="/images/Product-card.png" 
                alt="find stores on the go" 
                className='w-full h-full object-cover md:rounded-lg'
                // whileHover={{ scale: 1.05 }}
                // transition={springTransition}
              />
              <motion.div 
                className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] min-h-[80px] sm:min-h-[92px] mx-auto bg-[#F4A460] rounded-[16px] p-2 shadow-lg absolute bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-20 left-4 sm:left-8 md:left-12 lg:left-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Left side - Image */}
              
                    <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] rounded-[12px] bg-gray-200 overflow-hidden">
                      <img 
                        src="/images/amala_shop.png" 
                        alt="The Amala Camp restaurant exterior" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  
                  {/* Right side - Text content */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 ">16km • 8:00 am - 9:00 pm</p>
                      <h3 className="text-lg sm:text-xl font-bold text-black ">The Amala Camp</h3>
                      <p className="text-xs sm:text-sm text-gray-600">23 Ogunlana Drive, Surulere...</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>
          {/* Community Section */}
          <motion.section 
            id="about"
            ref={communityRef}
            className='w-full flex flex-col items-center mt-16 sm:mt-20 md:mt-24 lg:mt-[188px] md:px-4'
            initial="initial"
            animate={communityInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.h2 
              className='text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold w-full text-center my-6 sm:my-8 md:my-10'
              variants={fadeInUp}
            >
              {t('powered_by_ai')}
            </motion.h2>
            <motion.div 
              className='w-full h-[350px] sm:h-[350px] md:h-[500px] lg:h-[550px] bg-[#FAF2E5] bg-[url(/images/ai_hand.png)] bg-contain bg-bottom bg-no-repeat mt-8 sm:mt-12 md:mt-16 lg:mt-[20px] relative'
              variants={scaleIn}
            >
              <motion.div 
                className='w-fit h-fit bg-[#959990] px-3 sm:px-4 md:px-5 flex flex-col absolute top-8 sm:top-12 md:top-16 lg:top-20 left-8 sm:left-12 md:left-16 lg:left-20 p-3 sm:p-4 rounded-full !text-white text-xs sm:text-sm'
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <p>{t('helps_navigate')}</p>
                <p>{t('with_ease')}</p>
              </motion.div>
              <motion.div 
                className='w-fit h-fit bg-[#6D3D1C] px-3 sm:px-4 md:px-5 flex flex-col absolute bottom-1/2 right-8 sm:right-12 md:right-16 lg:right-24 p-3 sm:p-4 rounded-full !text-white text-xs sm:text-sm'
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <p>{t('supports_build')}</p>
                <p>{t('community_everyone')}</p>
              </motion.div>
              <motion.div 
                className='w-fit h-fit bg-[#1C2220] px-3 sm:px-4 md:px-5 flex flex-col absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 mx-auto align-middle left-1/2 -translate-x-1/2 p-3 sm:p-4 rounded-full !text-white text-xs sm:text-sm'
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <p>{t('website_trust')}</p>
                <p>{t('truly_trust')}</p>
              </motion.div>
            </motion.div>
          </motion.section>

          <motion.section 
            ref={testimonialRef}
            className='w-full flex flex-col items-center my-16 sm:my-20 md:my-24 lg:my-[188px] px-4'
            initial="initial"
            animate={testimonialInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.div 
              className="w-full flex flex-col items-center mb-12 sm:mb-16 md:mb-20"
              variants={fadeInUp}
            >
                <motion.div 
                  className="text-center max-w-[993px] relative"
                  variants={scaleIn}
                >
                    <motion.span 
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-center w-full italic flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 2, -2, 0],
                      }}
                      transition={{ 
                        duration: 4,
                        // repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <BsQuote size={48} className="sm:hidden" />
                      <BsQuote size={56} className="hidden sm:block md:hidden" />
                      <BsQuote size={64} className="hidden md:block" />
                    </motion.span>
                    <motion.p 
                      className="text-xl sm:text-2xl md:text-3xl lg:text-[48px] italic mt-4 px-4"
                      variants={fadeInUp}
                    >
                        &ldquo;{t('testimonial_quote')}&rdquo;
                    </motion.p>
                    <motion.div 
                      className="flex flex-col items-center mt-6"
                      variants={fadeInUp}
                    >
                        <motion.img 
                          src="/images/gif_72x72_916693.gif" 
                          className="h-[32px] w-[32px] sm:h-[36px] sm:w-[36px] md:h-[40px] md:w-[40px] rounded-full" 
                          alt="User avatar"
                          whileHover={{ scale: 1.2 }}
                          transition={springTransition}
                        />
                        <p className="mt-2 font-semibold text-sm sm:text-base">{t('testimonial_name')}</p>
                        <em className='text-xs sm:text-sm text-gray-500'>{t('testimonial_role')}</em>
                    </motion.div>
                </motion.div>
            </motion.div>
            <motion.div 
              className='w-full flex  flex-row justify-evenly items-center bg-[#212121] p-4 sm:p-6 !text-white rounded-[16px] h-auto sm:h-[140px] md:h-[160px] lg:h-[180px] gap-6 sm:gap-0'
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={springTransition}
            >
                <motion.div 
                  className='flex flex-col items-center'
                  variants={scaleIn}
                  whileHover={{ scale: 1.1 }}
                >
                    <motion.p 
                      className='text-3xl sm:text-4xl md:text-[48px] font-bold'
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      10+
                    </motion.p>
                    <p className='text-xs sm:text-sm text-center'>{t('registered_users')}</p>
                </motion.div>
                <motion.div 
                  className='flex flex-col items-center'
                  variants={scaleIn}
                  whileHover={{ scale: 1.1 }}
                >
                    <motion.p 
                      className='text-3xl sm:text-4xl md:text-[48px] font-bold'
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    >
                      100+
                    </motion.p>
                    <p className='text-xs sm:text-sm text-center'>{t('active_users')}</p>
                </motion.div>
                <motion.div 
                  className='flex flex-col items-center'
                  variants={scaleIn}
                  whileHover={{ scale: 1.1 }}
                >
                    <motion.p 
                      className='text-3xl sm:text-4xl md:text-[48px] font-bold'
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    >
                      20+
                    </motion.p>
                    <p className='text-xs sm:text-sm text-center'>{t('stores_nearby')}</p>
                </motion.div>
            </motion.div>
          </motion.section>

          {/* FAQ Section */}
          <section id="faq">
            <FAQAccordion />
          </section>
          <br />
          <motion.div 
            ref={downloadRef}
            className='w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px] bg-[#D03535] rounded-3xl pt-8 md:pt-0 grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 sm:px-6 md:px-8 lg:px-20 my-16 sm:my-20 md:my-24 lg:my-[188px] max-w-screen-xl mx-auto'
            initial="initial"
            animate={downloadInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.div 
              className='w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-full flex flex-col justify-end relative overflow-hidden order-2 lg:order-1'
              variants={fadeInLeft}
            >
              <motion.div 
                className='w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[438px] h-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[438px] bg-[url(/images/app.png)] bg-contain absolute -bottom-1 bg-bottom bg-no-repeat left-1/2 -translate-x-1/2'
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 3,
                  // repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.div 
              className='w-full h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-0 order-1 lg:order-2'
              variants={fadeInRight}
            >
              <motion.h2 
                className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight font-bold'
                variants={fadeInUp}
              >
                {t('download_mobile_app')}
              </motion.h2>
              <motion.h2 
                className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight mt-2 font-bold mb-3'
                variants={fadeInUp}
              >
                {t('app_today')}
              </motion.h2>
              <motion.p 
                className='text-white text-sm sm:text-base w-full lg:w-[70%] mb-4 sm:mb-6'
                variants={fadeInUp}
              >
                {t('download_app_description')}
              </motion.p>
              <motion.button 
                className='py-3 px-6 bg-black rounded-full text-white text-sm w-fit my-2'
                variants={fadeInUp}
                whileHover={hoverScale}
                whileTap={tapScale}
              >
                GET Android APK
              </motion.button>
            </motion.div>
          </motion.div>
      </main>
      <Footer />
    </>
  )
}

export default Page