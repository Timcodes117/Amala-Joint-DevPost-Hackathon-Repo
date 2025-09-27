'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import SearchPopover, { type SearchResult } from './search-popover'
import FilterPopover, { type FilterOptions } from './FilterPopover'

export type SearchBarProps = {
  data: SearchResult[]
  placeholder?: string
  className?: string
  onSelectResult?: (result: SearchResult) => void
  onApplyFilters?: (filters: FilterOptions) => void
  onClearFilters?: () => void
  initialFilters?: FilterOptions
  resultCount?: number
}

function SearchBar({ 
  data, 
  placeholder = 'Search stops and dishes', 
  className,
  onSelectResult,
  onApplyFilters,
  onClearFilters,
  initialFilters,
  resultCount = data.length
}: SearchBarProps) {
  const [query, setQuery] = useState<string>('')
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const [showFilterPopover, setShowFilterPopover] = useState<boolean>(false)
  const [filters, setFilters] = useState<FilterOptions>(
    initialFilters || {
      nowOpen: false,
      verified: false,
      distanceKm: 2,
      rating: null,
      price: null
    }
  )
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const filtered = useMemo(() => {
    let filteredData = data

    // Apply text search filter
    const q = query.trim().toLowerCase()
    if (q) {
      filteredData = filteredData.filter((r) => r.name.toLowerCase().includes(q))
    }

    // Apply other filters
    if (filters.nowOpen) {
      filteredData = filteredData.filter((r) => r.isOpen)
    }

    if (filters.verified) {
      filteredData = filteredData.filter((r) => r.verified)
    }

    if (filters.rating) {
      filteredData = filteredData.filter((r) => 
        r.rating >= filters.rating!.min && r.rating <= filters.rating!.max
      )
    }

    // Note: Price filtering would need to be added to SearchResult type
    // if (filters.price) {
    //   filteredData = filteredData.filter((r) => r.priceLevel === filters.price!.level)
    // }

    return filteredData
  }, [query, data, filters])

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

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    onApplyFilters?.(newFilters)
  }

  const handleSelectResult = (result: SearchResult) => {
    // Close the popover when a result is selected
    setShowPopover(false)
    // Clear the search query
    setQuery('')
    // Call the parent's onSelectResult handler
    onSelectResult?.(result)
  }

  const handleClearFilters = () => {
    const defaultFilters: FilterOptions = {
      nowOpen: false,
      verified: false,
      distanceKm: 2,
      rating: null,
      price: null
    }
    setFilters(defaultFilters)
    onClearFilters?.()
  }

  return (
    <div ref={wrapRef} className={className}>
      <div className='w-full flex flex-row gap-[12px]'>
        <div className='w-full h-[44px] bg-gray-100/10 gap-2 backdrop-blur-3xl rounded-[32px] px-2 flex flex-row items-center'>
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
        <button 
          onClick={() => setShowFilterPopover(true)}
          className='min-w-[44px] h-[44px] bg-gray-100/10 rounded-full flex items-center justify-center hover:bg-gray-100/20 transition-colors'
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>
      <SearchPopover 
        results={filtered} 
        visible={showPopover && filtered.length > 0} 
        onSelectResult={handleSelectResult}
      />
      <FilterPopover
        isOpen={showFilterPopover}
        onClose={() => setShowFilterPopover(false)}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        initialFilters={filters}
        resultCount={filtered.length}
      />
    </div>
  )
}

export default SearchBar


