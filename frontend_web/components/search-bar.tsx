'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import SearchPopover, { type SearchResult } from './search-popover'

export type SearchBarProps = {
  data: SearchResult[]
  placeholder?: string
  className?: string
  onSelectResult?: (result: SearchResult) => void
}

function SearchBar({ data, placeholder = 'Search stops and dishes', className, onSelectResult }: SearchBarProps) {
  const [query, setQuery] = useState<string>('')
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter((r) => r.name.toLowerCase().includes(q))
  }, [query, data])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target as Node)) {
        setShowPopover(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div ref={wrapRef} className={className}>
      <div className='w-full flex flex-row gap-[12px]'>
        <div className='w-full h-[44px] bg_2 gap-2 rounded-[32px] px-2 flex flex-row items-center'>
          <Search size={20} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowPopover(true)}
            type='text'
            placeholder={placeholder}
            className='w-full h-full bg-transparent outline-none text-sm'
          />
        </div>
        <div className='min-w-[44px] h-[44px] bg_2 rounded-full flex items-center justify-center'>
          <SlidersHorizontal size={20} />
        </div>
      </div>
      <SearchPopover results={filtered} visible={showPopover && filtered.length > 0} />
    </div>
  )
}

export default SearchBar


