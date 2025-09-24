"use client"
import React, { useMemo, useState } from 'react'
import SavedItem, { SavedItemProps } from '@/components/SavedItem'

function Page() {
  const initialData: SavedItemProps[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Sunset Coffee Roasters',
        location: 'Lekki Phase 1, Lagos',
        opensAt: '08:00',
        closesAt: '20:00',
        distanceKm: 2.3,
        etaMinutes: 7,
        verified: true,
        imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 2,
        name: 'Green Park',
        location: 'Victoria Island, Lagos',
        opensAt: '06:00',
        closesAt: '19:00',
        distanceKm: 5.1,
        etaMinutes: 14,
        imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 3,
        name: 'Art Haven Gallery',
        location: 'Yaba, Lagos',
        opensAt: '10:00',
        closesAt: '18:00',
        distanceKm: 3.8,
        etaMinutes: 11,
        imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 3,
        name: 'Art Haven Gallery',
        location: 'Yaba, Lagos',
        opensAt: '10:00',
        closesAt: '18:00',
        distanceKm: 3.8,
        etaMinutes: 11,
        imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 3,
        name: 'Art Haven Gallery',
        location: 'Yaba, Lagos',
        opensAt: '10:00',
        closesAt: '18:00',
        distanceKm: 3.8,
        etaMinutes: 11,
        imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=800&auto=format&fit=crop',
      },
    ],
    []
  )

  const [saved, setSaved] = useState<SavedItemProps[]>(initialData)

  const handleRemove = (id: string | number) => {
    setSaved((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto w-full  py-6">
      <h1 className="text-2xl font-semibold ">Saved</h1>
      <p className="text-sm mb-4 text-gray-800 text_muted ">here are your saved items</p>
      <div className='w-full md:h-full md:max-h-[80vh] h-fit  flex-grow flex flex-col overflow-y-scroll csb gap-4'>
        {saved.length === 0 ? (
          <div className="p-6 text-center text_muted">No saved items yet.</div>
        ) : (
          saved.map((item) => (
            <SavedItem key={item.id} {...item} onRemove={handleRemove} />
          ))
        )}
        <br />
        <br />
        <br />
      </div>
    </div>
  )
}

export default Page