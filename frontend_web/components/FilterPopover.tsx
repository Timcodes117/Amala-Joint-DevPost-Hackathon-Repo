'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Minus, Plus, User } from 'lucide-react'

export interface FilterOptions {
  nowOpen: boolean
  verified: boolean
  distanceKm: number
  rating: {
    min: number
    max: number
  } | null
  price: {
    level: number
    label: string
  } | null
}

interface FilterPopoverProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  onClearFilters: () => void
  initialFilters?: FilterOptions
  resultCount?: number
}

const defaultFilters: FilterOptions = {
  nowOpen: false,
  verified: false,
  distanceKm: 2,
  rating: null,
  price: null
}

const ratingOptions = [
  { min: 1, max: 3, label: '★ 1-3' },
  { min: 3, max: 4, label: '★ 3-4' },
  { min: 4, max: 4.5, label: '★ 4-4.5' },
  { min: 4.5, max: 5, label: '★ 4.5-5' }
]

const priceOptions = [
  { level: 1, label: '₦ (Budget Friendly)' },
  { level: 2, label: '₦ ₦ (Moderate)' },
  { level: 3, label: '₦ ₦ ₦ (Awesome Quality)' }
]

export default function FilterPopover({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onClearFilters,
  initialFilters = defaultFilters,
  resultCount = 0
}: FilterPopoverProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleRatingSelect = (rating: { min: number; max: number }) => {
    const newRating = filters.rating?.min === rating.min && filters.rating?.max === rating.max 
      ? null 
      : rating
    setFilters(prev => ({ ...prev, rating: newRating }))
  }

  const handlePriceSelect = (price: { level: number; label: string }) => {
    const newPrice = filters.price?.level === price.level 
      ? null 
      : price
    setFilters(prev => ({ ...prev, price: newPrice }))
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
    onClearFilters()
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  const getWalkTime = (distanceKm: number) => {
    // Rough calculation: 5 km/h walking speed
    const walkTimeMinutes = Math.round((distanceKm / 5) * 60)
    return walkTimeMinutes
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
      <div 
        ref={popoverRef}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-sm mx-auto shadow-xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-white text-lg font-semibold">Filter</h3>
        </div>

        {/* General Filters */}
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleFilterChange('nowOpen', !filters.nowOpen)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.nowOpen 
                  ? 'bg-gray-300 text-gray-800' 
                  : 'bg-gray-700 text-white'
              }`}
            >
              Now Open
            </button>
            <button
              onClick={() => handleFilterChange('verified', !filters.verified)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.verified 
                  ? 'bg-gray-300 text-gray-800' 
                  : 'bg-gray-700 text-white'
              }`}
            >
              Verified
            </button>
          </div>
        </div>

        <hr className="border-gray-600 mb-6" />

        {/* Distance Section */}
        <div className="mb-6">
          <h4 className="text-white text-sm font-medium mb-3">Distance to me</h4>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleFilterChange('distanceKm', Math.max(1, filters.distanceKm - 1))}
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="text-white font-medium">{filters.distanceKm} Km</span>
            <button
              onClick={() => handleFilterChange('distanceKm', Math.min(50, filters.distanceKm + 1))}
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
            >
              <Plus size={16} />
            </button>
            <div className="flex items-center gap-2 ml-4">
              <User size={16} className="text-white" />
              <span className="text-white text-sm">{getWalkTime(filters.distanceKm)} mins walk</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-600 mb-6" />

        {/* Rating Section */}
        <div className="mb-6">
          <h4 className="text-white text-sm font-medium mb-3">Rating</h4>
          <div className="grid grid-cols-2 gap-2">
            {ratingOptions.map((option) => (
              <button
                key={`${option.min}-${option.max}`}
                onClick={() => handleRatingSelect(option)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.rating?.min === option.min && filters.rating?.max === option.max
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-600 mb-6" />

        {/* Price Section */}
        <div className="mb-6">
          <h4 className="text-white text-sm font-medium mb-3">Price</h4>
          <div className="space-y-2">
            {priceOptions.map((option) => (
              <button
                key={option.level}
                onClick={() => handlePriceSelect(option)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.price?.level === option.level
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-600 mb-6" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleClearFilters}
            className="text-white text-sm underline hover:text-gray-300 transition-colors"
          >
            Clear filter
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Show {resultCount} results
          </button>
        </div>
      </div>
    </div>
  )
}
