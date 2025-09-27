"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import VerifyResultsContainer from '@/components/verify-results-container'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useStores } from '@/contexts/StoreContext'
// removed unused import: useAuth

function Page() {
  const [activeTab, setActiveTab] = useState<'unverified' | 'my-posts'>('unverified')
  const { unverifiedStores, userStores, loadingStores, ignoreStore, fetchUnverifiedStores, fetchUserStores } = useStores()
  const router = useRouter()

  const didFetchRef = useRef(false)

  useEffect(() => {
    if (didFetchRef.current) return
    didFetchRef.current = true
    fetchUnverifiedStores()
    fetchUserStores()
  }, [fetchUnverifiedStores, fetchUserStores])

  return (
    <ProtectedRoute>
      {/* Header */}
      <div className='flex flex-col'> 
        <br />
        <b className='text-[20px] font-semibold'>Verify Stores near you!</b>
        <p className='text-sm text-gray-500'>Help the community grow by verifying the stores closest to you.</p>
        <br />
      </div>

      {/* Tabs */}
      <div className='flex flex-row gap-1 mb-4'>
        <button
          onClick={() => setActiveTab('unverified')}
          className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'unverified'
              ? 'bg-gray-400/80'
              : 'bg-transparent text-gray-800 text_muted hover:bg-gray-200'
          }`}
        >
          Unverified ({unverifiedStores.length})
        </button>
        <button
          onClick={() => setActiveTab('my-posts')}
          className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'my-posts'
              ? 'bg-gray-400/80 '
              : 'bg-transparent text-gray-800 text_muted hover:bg-gray-200'
          }`}
        >
          My Posts ({userStores.length})
        </button>
      </div>
      <hr className='border border_1 my-2' />
      
      <div className='w-full h-full flex-grow flex flex-col overflow-y-scroll csb gap-4'>
        {loadingStores ? (
          <div className='flex items-center justify-center py-8'>
            <p className='text-gray-500'>Loading stores...</p>
          </div>
        ) : activeTab === 'unverified' ? (
          // Unverified stores tab
          unverifiedStores.length > 0 ? (
            unverifiedStores.map((store) => (
              <VerifyResultsContainer
                key={`unverified-${store._id}`}
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
                  ignoreStore(store._id)
                }}
                onVerify={() => router.push(`/home/verify/${store._id}`)}
              />
            ))
          ) : (
            <div className='flex items-center justify-center py-8'>
              <p className='text-gray-500'>No unverified stores found</p>
            </div>
          )
        ) : (
          // My Posts tab
          userStores.length > 0 ? (
            userStores.map((store) => (
              <VerifyResultsContainer
                key={`my-post-${store._id}`}
                name={store.name}
                location={store.location}
                opensAt={store.opensAt}
                closesAt={store.closesAt}
                distanceKm={Math.round(2 + Math.random() * 8)}
                etaMinutes={Math.round(5 + Math.random() * 20)}
                rating={4.5}
                verified={store.is_verified}
                imageUrl={store.imageUrl || '/images/amala-billboard.png'}
                verifyCount={store.verify_count || 0}
                isOwner={true}
                shareUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/home/verify/${store._id}`}
              />
            ))
          ) : (
            <div className='flex items-center justify-center py-8'>
              <p className='text-gray-500'>You haven&apos;t added any stores yet</p>
            </div>
          )
        )}
      </div>
    </ProtectedRoute>
  )
}

export default Page