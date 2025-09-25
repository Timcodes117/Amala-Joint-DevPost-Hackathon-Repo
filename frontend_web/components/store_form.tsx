'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { MapPinned, Upload } from 'lucide-react'

type TimeOption = { label: string; value: string }

interface StoreFormValues {
  name: string
  phone: string
  location: string
  opensAt: string
  closesAt: string
  description: string
  file: File | null
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
  const [values, setValues] = useState<StoreFormValues>({
    name: '',
    phone: '',
    location: '',
    opensAt: '09:00',
    closesAt: '23:00',
    description: '',
    file: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const DRAFT_KEY = 'store_form_draft_v1'

  function update<K extends keyof StoreFormValues>(key: K, value: StoreFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
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
        // Default no-op: emulate request
        await new Promise((r) => setTimeout(r, 600))
        console.log('Store submitted:', values)
      }
    } catch (err) {
      setError('Failed to submit. Please try again.')
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
    } catch (e) {
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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 items-end'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Enter Location</label>
          <div className='relative'>
            <input
              value={values.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder='Enter store location'
              className='w-full px-5 py-3 pr-12 rounded-full bg-transparent border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
            />
            <div className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
              <MapPinned size={22} />
            </div>
          </div>
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
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
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
            // onClick={}
            className="flex-1 h-[40px] rounded-full pry-bg cursor-pointer text-white px-4 text-sm max-w-[200px]"
          >
            Submit for Review
          </button>
      </div>
    </form>
  )
}


