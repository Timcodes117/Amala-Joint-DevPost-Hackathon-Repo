'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
// import Link from 'next/link'
import { MapPinned, Upload } from 'lucide-react'
import { useStores } from '@/contexts/StoreContext'
import AsyncSelect from 'react-select/async'
import { axiosPostMultiPart, axiosPost } from '@/utils/http/api'
import { toast } from 'react-toastify'

type TimeOption = { label: string; value: string }

interface StoreFormValues {
  name: string
  phone: string
  location: string
  latitude?: number
  longitude?: number
  opensAt: string
  closesAt: string
  description: string
  file: File | null
}

// interface AddressSuggestion {
//   place_id: string
//   formatted_address: string
//   geometry: {
//     location: {
//       lat: number
//       lng: number
//     }
//   }
// }

interface SelectOption {
  value: string
  label: string
  lat: number
  lng: number
  place_id: string
}

interface StoreFormProps {
  onSubmit?: (values: StoreFormValues) => Promise<void> | void
  className?: string
}

function buildTimeOptions(): TimeOption[] {
  const options: TimeOption[] = []
  for (let hour = 0; hour < 24; hour++) {
    const h = hour.toString().padStart(2, '0')
    options.push({ label: `${h}:00`, value: `${h}:00` })
  }
  return options
}

export default function StoreForm({ onSubmit, className = '' }: StoreFormProps) {
  const timeOptions = useMemo(buildTimeOptions, [])
  const { addStore, fetchUserStores } = useStores()
  const [values, setValues] = useState<StoreFormValues>({
    name: '',
    phone: '',
    location: '',
    latitude: undefined,
    longitude: undefined,
    opensAt: '09:00',
    closesAt: '23:00',
    description: '',
    file: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<SelectOption | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const DRAFT_KEY = 'store_form_draft_v1'

  function update<K extends keyof StoreFormValues>(key: K, value: StoreFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  // Address autocomplete functionality using backend proxy
  const loadAddressOptions = async (inputValue: string) => {
    if (inputValue.length < 3) {
      return []
    }

    try {
      // Use backend proxy instead of direct Google API call
      const response = await axiosPost('/api/places/autocomplete', {
        input: inputValue
      })
      
      const data = response.data
      
      if (data.status === 'OK' && data.predictions) {
        const options = data.predictions.map((prediction: { description: string; place_id: string }) => ({
          value: prediction.description,
          label: prediction.description,
          place_id: prediction.place_id,
          lat: 0, // Will be filled when selected
          lng: 0, // Will be filled when selected
        }))
        console.log('Address options loaded:', options)
        return options
      }
      
      return []
    } catch (error) {
      console.error('Error searching addresses:', error)
      return []
    }
  }

  const handleAddressChange = async (selectedOption: SelectOption | null) => {
    setSelectedAddress(selectedOption)
    if (selectedOption) {
      update('location', selectedOption.value)
      
      // Get coordinates using backend proxy for Google Places Details API
      if (selectedOption.place_id) {
        try {
          const response = await axiosPost('/api/places/details', {
            place_id: selectedOption.place_id
          })
          const data = response.data
          
          if (data.status === 'OK' && data.result.geometry) {
            const lat = data.result.geometry.location.lat
            const lng = data.result.geometry.location.lng
            
            update('latitude', lat)
            update('longitude', lng)
            
            // Update the selected option with coordinates
            setSelectedAddress({
              ...selectedOption,
              lat,
              lng
            })
          }
        } catch (error) {
          console.error('Error getting place details:', error)
        }
      }
    } else {
      update('location', '')
      update('latitude', undefined)
      update('longitude', undefined)
    }
  }

  const handleUseCurrentLocation = async () => {
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser')
      }

      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const { latitude, longitude } = position.coords

      // Reverse geocode to get address using backend proxy for Google Geocoding API
      const response = await axiosPost('/api/places/geocode', {
        lat: latitude,
        lng: longitude
      })
      
      const data = response.data
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address
        
        // Update form values
        update('latitude', latitude)
        update('longitude', longitude)
        update('location', address)
        
        // Update react-select value
        const currentLocationOption: SelectOption = {
          value: address,
          label: address,
          lat: latitude,
          lng: longitude,
          place_id: 'current_location'
        }
        setSelectedAddress(currentLocationOption)
      } else {
        throw new Error('Unable to get address for current location')
      }
    } catch (error) {
      console.error('Error getting current location:', error)
      setError('Unable to get your current location. Please enter address manually.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!values.name.trim()) return setError('Store name is required')
    if (!values.phone.trim()) return setError('Phone number is required')
    if (!values.location.trim()) return setError('Store location is required')
    if (!values.description.trim()) return setError('Description is required')
    if (!values.file) return setError('Please upload an image file')

    try {
      setSubmitting(true)

      if (onSubmit) {
        await onSubmit(values)
      } else {
        // Submit to backend API
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('phone', values.phone)
        formData.append('location', values.location)
        if (values.latitude !== undefined) {
          formData.append('latitude', values.latitude.toString())
        }
        if (values.longitude !== undefined) {
          formData.append('longitude', values.longitude.toString())
        }
        formData.append('opensAt', values.opensAt)
        formData.append('closesAt', values.closesAt)
        formData.append('description', values.description)
        if (values.file) {
          formData.append('image1', values.file)
        }

        // Get JWT token from localStorage
        const token = localStorage.getItem('access_token')
        
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.')
        }

        console.log('Submitting store with data:', {
          name: values.name,
          phone: values.phone,
          location: values.location,
          latitude: values.latitude,
          longitude: values.longitude,
          opensAt: values.opensAt,
          closesAt: values.closesAt,
          description: values.description,
          hasFile: !!values.file,
          fileName: values.file?.name
        })

        const response = await axiosPostMultiPart('/api/stores/add', formData, {
          Authorization: `Bearer ${token}`,
        })

        console.log('Store submission response:', {
          status: response.status,
          data: response.data
        })

        const result = response.data

        if (!response.status || response.status >= 400) {
          throw new Error(result.error || 'Failed to submit store')
        }

        console.log('Store submitted successfully:', result)
        setError(null)
        
        // Show success message
        toast.success('Store submitted successfully! It will be reviewed for verification.')
        
        // Add the new store to the context
        if (result.data && result.data.store) {
          addStore(result.data.store)
        }
        
        // Refresh user stores to include the new store
        fetchUserStores()
        
        // Clear form after successful submission
        setValues({
          name: '',
          phone: '',
          location: '',
          latitude: undefined,
          longitude: undefined,
          opensAt: '09:00',
          closesAt: '23:00',
          description: '',
          file: null,
        })
        setSelectedAddress(null)
        
        // Clear draft from localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(DRAFT_KEY)
        }
      }
    } catch (err) {
      console.error('Store submission error:', err)
      
      let errorMessage = 'Failed to submit. Please try again.'
      
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'object' && err !== null) {
        // Handle axios error responses
        const axiosError = err as { 
          response?: { 
            data?: { error?: string }
            status?: number
          } 
        }
        if (axiosError?.response?.data?.error) {
          errorMessage = axiosError.response.data.error
        } else if (axiosError?.response?.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.'
        } else if (axiosError?.response?.status === 413) {
          errorMessage = 'File too large. Please choose a smaller image.'
        } else if (axiosError?.response?.status && axiosError.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        }
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  function handleDrop(ev: React.DragEvent<HTMLLabelElement>) {
    ev.preventDefault()
    const file = ev.dataTransfer.files?.[0]
    if (file && isSupported(file)) update('file', file)
  }

  function isSupported(file: File) {
    return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
  }

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(DRAFT_KEY) : null
      if (!raw) return
      const parsed = JSON.parse(raw) as Omit<StoreFormValues, 'file'>
      setValues((prev) => ({ ...prev, ...parsed, file: null }))
    } catch {}
  }, [])


  // Save draft (excluding file)
  function handleSaveDraft() {
    const { file, ...rest } = values
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(rest))
        setError(null)
      }
    } catch {
      setError('Unable to save draft locally.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full flex flex-col gap-5 px-4 ${className}`}>
        
        <div className='flex flex-col '> 
      <br />
          <b className='text-[24px] font-semibold'>Add a New Store</b>
          <p className='text-sm text-gray-500'>You’ve found a new spot? Enter the details and share it with the comunity.</p>
      <br />
          </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Store Name</label>
          <input
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder='Name of Store'
            className='w-full px-5 py-3 rounded-full bg-transparent border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
          />
          <p className='text-xs text-gray-400'>Store names are recommended to be unique</p>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Phone Number</label>
          <input
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder='+234 90...'
            className='w-full px-5 py-3 rounded-full bg-transparent border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5  '>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Enter Location</label>
          <div className='relative'>
            <AsyncSelect
              value={selectedAddress}
              onChange={handleAddressChange}
              loadOptions={loadAddressOptions}
              placeholder="Search for an address..."
              isSearchable
              isClearable
              noOptionsMessage={({ inputValue }) => 
                inputValue.length < 3 ? 'Type at least 3 characters to search' : 'No addresses found'
              }
              loadingMessage={() => "Searching addresses..."}
              className="react-select-container"
              classNamePrefix="react-select"
              instanceId="address-select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: 'transparent',
                  border: '1px solid #374151',
                  borderRadius: '9999px',
                  minHeight: '48px',
                  boxShadow: state.isFocused ? '0 0 0 2px #ef4444' : 'none',
                  '&:hover': {
                    border: '1px solid #6b7280',
                  },
                }),
                input: (provided) => ({
                  ...provided,
                  color: 'white',
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#9ca3af',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'white',
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? '#374151' : 'transparent',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#374151',
                  },
                }),
                noOptionsMessage: (provided) => ({
                  ...provided,
                  color: '#9ca3af',
                }),
                loadingMessage: (provided) => ({
                  ...provided,
                  color: '#9ca3af',
                }),
              }}
            />
            <button
              type='button'
              onClick={handleUseCurrentLocation}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10'
              title='Use current location'
            >
              <MapPinned size={18} />
            </button>
            </div>
          {values.latitude && values.longitude && (
            <p className='text-xs text-green-400'>
              ✓ Location coordinates: {values.latitude.toFixed(6)}, {values.longitude.toFixed(6)}
            </p>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Working hours</label>
          <div className='flex flex-row items-center gap-3'>
            <select
              value={values.opensAt}
              onChange={(e) => update('opensAt', e.target.value)}
              className='px-4 py-3 rounded-full bg-transparent border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500'
            >
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className='bg-black'>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className='text-gray-400'>to</span>
            <select
              value={values.closesAt}
              onChange={(e) => update('closesAt', e.target.value)}
              className='px-4 py-3 rounded-full bg-transparent border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500'
            >
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className='bg-black'>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-semibold'>Descriptions</label>
        <textarea
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder='Enter description of store'
          rows={5}
          className='w-full px-5 py-4 rounded-2xl bg-transparent border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-semibold'>Upload file</label>
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className='flex flex-col items-center justify-center gap-3 border border-dashed border-gray-700 rounded-2xl p-10 cursor-pointer hover:border-gray-500'
        >
          <div className='h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center'>
            <Upload />
          </div>
          <p className='text-gray-300'>Drag and drop file here <span className='text-gray-400'>or</span> <span className='underline'>upload</span></p>
          <p className='text-xs text-gray-500'>Only <b>.png</b>, <b>.jpeg</b>, <b>.jpg</b> file types are supported</p>
          <input
            ref={fileInputRef}
            type='file'
            accept='.png,.jpg,.jpeg,image/png,image/jpeg'
            className='hidden'
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null
              if (file && isSupported(file)) update('file', file)
            }}
          />
          {values.file && (
            <p className='text-xs text-gray-400'>Selected: {values.file.name}</p>
          )}
        </label>
        <div>
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='px-4 py-2 text-sm rounded-full border border-gray-700 hover:border-gray-500'
          >
            Choose file
          </button>
        </div>
      </div>

      {error && <div className='text-sm text-red-500'>{error}</div>}

      <div className='flex items-center justify-end gap-2'>
      <button
            type='button'
            onClick={handleSaveDraft}
            className="flex-1 h-[40px] rounded-full grey text-white px-4 text-sm max-w-[200px]"
          >
            Save Draft
          </button>
          {/* Replaced by mobile CTA in /home/new: Add a Store */}
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 h-[40px] rounded-full pry-bg cursor-pointer text-white px-4 text-sm max-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
      </div>
    </form>
  )
}


