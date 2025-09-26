"use client"
import React, { Suspense } from 'react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import StoresMap from '@/components/maps/stores-map';
import AppHeader from '@/components/app_header';
import Link from 'next/link'; 
import Sidebar from '@/components/sidebar';

import Head from 'next/head';
import { BsQuestion } from 'react-icons/bs';
import SearchBar from '@/components/search-bar';
import { SearchResult } from '@/components/search-popover';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import StoreForm from '@/components/store_form';
import VerifyResultsContainer from '@/components/verify-results-container';
import { useStores } from '@/contexts/StoreContext';
import { ClipboardProvider } from '@/contexts/ClipboardContext';

const PageHead = () => (
  <Head>
    <title>Home</title>
    <meta name="description" content="created by the A-Train Group for Amala hackathon 2025" />
    <meta property="og:title" content="Home" />
    <meta property="og:description" content="created by the A-Train Group for Amala hackathon 2025" />
    <meta property="og:type" content="website" />
  </Head>
);

function HomeLayoutContent({children}:{children: React.ReactNode}) {
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);
  const [rightView, setRightView] = React.useState<'map' | 'verify'>('map');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAddMode = searchParams?.get('mode') === 'add';
  const router = useRouter();
  const isMobileMap = searchParams?.get('mobileMap') === '1';

  // Use the store context
  const { unverifiedStores, loadingStores, ignoreStore } = useStores()

  const DUMMY: SearchResult[] = React.useMemo(
    () =>
      new Array(8).fill(0).map((_, i) => ({
        id: `spot-${i}`,
        name: `The Amala Palace ${i + 1}`,
        distanceKm: 12,
        etaMinutes: 20,
        isOpen: true,
        rating: 4.8,
        thumbnailUrl: undefined,
      })),
    []
  )
  
  // Initialize/sync right panel view from query param (?view=map|verify)
  React.useEffect(() => {
    const viewParam = searchParams?.get('view');
    if (viewParam === 'map' || viewParam === 'verify') {
      setRightView(viewParam);
    }
  }, [searchParams]);


  return (
    <div className='w-full h-[100vh] !max-h-[100vh] p-4 flex flex-row gap-4'>
      <PageHead />
      <Sidebar />

      <div className='w-full h-full flex flex-col gap-4 flex-grow min-h-0 overflow-hidden'>
        <AppHeader />
      <div className='w-full h-full flex flex-row gap-4 flex-1 min-h-0 overflow-hidden'>
      {!isFullScreen && <div className='min-w-[368px] w-[368px] md:h-full hidden relative bg_2 rounded-[24px] p-4 md:overflow-hidden md:flex flex-col flex-1 min-h-0 shadow-md'>
      {children}
        {/* <br />
        <br /> */}
      </div>}

      {pathname === '/home/new' && (
        <>
          {/* Desktop and explicit add-mode on mobile: show the form */}
          <div className='w-full h-full flex-grow bg_3 rounded-[24px] relative md:flex hidden flex-col gap-4 p-4 overflow-hidden shadow-md overflow-y-auto csb'>
            <StoreForm />
          </div>
          {isAddMode && (
            <div className='w-full h-full flex-grow bg_3 rounded-[24px] relative md:hidden flex flex-col gap-4 p-4 overflow-hidden shadow-md overflow-y-auto csb'>
              <StoreForm />
            </div>
          )}
          {/* Default on mobile: verify list with CTA to add */}
          {!isAddMode && (
            <div className='w-full h-full flex-grow bg_3 rounded-[24px] relative md:hidden flex flex-col gap-4 overflow-hidden shadow-md'>
              <div className='sticky top-0 z-30 bg_3/80 backdrop-blur px-4 pt-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <b className='text-[16px] font-semibold'>Unverified Stores near you</b>
                    <p className='text-sm text-gray-500'>Help keep the list accurate by verifying spots</p>
                  </div>
                  <Link href='/home/new?mode=add' className='px-4 py-2 rounded-full pry-bg text-white text-sm whitespace-nowrap'>
                    Add a Store
                  </Link>
                </div>
                <hr className='border border_1 my-3' />
              </div>
              <div className='w-full h-full overflow-y-auto csb px-4 pb-4'>
                {loadingStores ? (
                  <div className='flex items-center justify-center py-8'>
                    <p className='text-gray-500'>Loading stores...</p>
                  </div>
                ) : unverifiedStores.length > 0 ? (
                  unverifiedStores.map((store, i) => (
                    <VerifyResultsContainer
                      key={`m-verify-${store._id}`}
                      name={store.name}
                      location={store.location}
                      opensAt={store.opensAt}
                      closesAt={store.closesAt}
                      distanceKm={Math.round(2 + Math.random() * 8)}
                      etaMinutes={Math.round(5 + Math.random() * 20)}
                      rating={4.5}
                      verified={false}
                      imageUrl={store.imageUrl || '/images/amala-billboard.png'}
                      verifyCount={store.verify_count || 0}
                      isOwner={false}
                      onIgnore={() => {
                        // Handle ignore using context
                        ignoreStore(store._id)
                      }}
                      onVerify={() => router.push(`/home/verify/${store._id}`)}
                    />
                  ))
                ) : (
                  <div className='flex items-center justify-center py-8'>
                    <p className='text-gray-500'>No unverified stores found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      {pathname !== '/home/new' && (
        <div className={`w-full h-full flex-grow bg_3 rounded-[24px] relative flex flex-col gap-4 overflow-hidden shadow-md ${isMobileMap ? 'flex md:flex' : 'hidden md:flex'}`}>
        {/* here */}
        <div className='absolute w-full top-0 py-4 flex items-center justify-between px-4 z-30'>
        <div onClick={() => setIsFullScreen(!isFullScreen)} className='w-[44px] h-[44px] rounded-full bg-[#1A1A1A] shadow-md md:flex hidden items-center justify-center'>
              {isFullScreen ? <ChevronsRight size={20} color='white' /> : <ChevronsLeft size={20} color='white' />}              
          </div>

        <div className='flex flex-row gap-2 max-w-[500px] w-full' style={{display: isFullScreen ? 'flex' : 'none'}}>
          <SearchBar data={DUMMY} placeholder='Search for a store' className='w-full' />
          </div>

        <div className='flex items-center gap-2'>
          {/* <div className='hidden md:flex items-center gap-1 bg-[#1A1A1A] rounded-full p-1'>
            <button
              onClick={() => setRightView('map')}
              className={`px-3 py-1 rounded-full text-sm ${rightView === 'map' ? 'bg-white text-black' : 'text-white/80'}`}
            >
              Map
            </button>
            <button
              onClick={() => setRightView('verify')}
              className={`px-3 py-1 rounded-full text-sm ${rightView === 'verify' ? 'bg-white text-black' : 'text-white/80'}`}
            >
              Verify
            </button>
          </div> */}
          {/* Close full-screen map on mobile */}
          {isMobileMap && (
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams?.toString() || '');
                params.delete('mobileMap');
                const query = params.toString();
                router.push(query ? `${pathname}?${query}` : pathname);
              }}
              className='md:hidden px-3 py-2 rounded-full bg-white/90 text-black text-sm flex items-center justify-center '
            >
              <ChevronsLeft size={20} className='mr-1' /> Close
            </button>
          )}
          <div onClick={() => setIsFullScreen(!isFullScreen)} className='w-[44px] h-[44px] rounded-full bg-[#1A1A1A] shadow-md md:flex hidden items-center justify-center'>
                <BsQuestion size={20} color='white' />             
            </div>
        </div>


        </div>
        {rightView === 'map' ? (
          <StoresMap />
        ) : (
          <div className='w-full h-full overflow-y-auto csb pt-16 px-4'>
            {loadingStores ? (
              <div className='flex items-center justify-center py-8'>
                <p className='text-gray-500'>Loading stores...</p>
              </div>
            ) : unverifiedStores.length > 0 ? (
              unverifiedStores.map((store, i) => (
                <VerifyResultsContainer
                  key={`verify-${store._id}`}
                  name={store.name}
                  location={store.location}
                  opensAt={store.opensAt}
                  closesAt={store.closesAt}
                  distanceKm={Math.round(2 + Math.random() * 8)}
                  etaMinutes={Math.round(5 + Math.random() * 20)}
                  rating={4.5}
                  verified={false}
                  imageUrl={store.imageUrl || '/images/amala-billboard.png'}
                  verifyCount={store.verify_count || 0}
                  isOwner={false}
                  onIgnore={() => {
                    // Handle ignore using context
                    ignoreStore(store._id)
                  }}
                  onVerify={() => router.push(`/home/verify/${store._id}`)}
                />
              ))
            ) : (
              <div className='flex items-center justify-center py-8'>
                <p className='text-gray-500'>No unverified stores found</p>
              </div>
            )}
          </div>
        )}
      </div>
      )}
      </div>
      {/* Ensure nested routes like /home/[slug] can mount modals on mobile */}
      {pathname !== '/home/new' && !isMobileMap && (
        <div className='md:hidden w-full h-full flex-1 min-h-full overflow-y-auto csb relative'>
          {children}
          <br />
          <br />
          <br />
        </div>
      )}
      </div>
    </div>
  )
}

function HomeLayoutWrapper({children}:{children: React.ReactNode}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClipboardProvider>
        <HomeLayoutContent>{children}</HomeLayoutContent>
      </ClipboardProvider>
    </Suspense>
  )
}

export default HomeLayoutWrapper