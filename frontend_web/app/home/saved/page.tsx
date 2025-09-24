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
        imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 2,
        name: 'Green Park',
        location: 'Victoria Island, Lagos',
        opensAt: '06:00',
        closesAt: '19:00',
        imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 3,
        name: 'Art Haven Gallery',
        location: 'Yaba, Lagos',
        opensAt: '10:00',
        closesAt: '18:00',
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
    <div className="max-w-3xl mx-auto w-full px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Saved</h1>
      <div className="rounded-[14px] bg_2 border !border-gray-600/60 overflow-hidden">
        {saved.length === 0 ? (
          <div className="p-6 text-center text_muted">No saved items yet.</div>
        ) : (
          saved.map((item) => (
            <SavedItem key={item.id} {...item} onRemove={handleRemove} />
          ))
        )}
      </div>
    </div>
  )
}

export default Page