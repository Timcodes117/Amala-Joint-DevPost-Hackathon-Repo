"use client"
import React, { useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Upload } from 'lucide-react'
import { axiosPostMultiPart } from '@/utils/http/api'
import { toast } from 'react-toastify'

type VerifyFormValues = {
  reason: string
  proofUrl: string
  file: File | null
}

export default function VerifyStorePage() {
  const params = useParams<{ id: string }>()
  const [values, setValues] = useState<VerifyFormValues>({ reason: '', proofUrl: '', file: null })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function update<K extends keyof VerifyFormValues>(key: K, value: VerifyFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function isSupported(file: File) {
    return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
  }

  function handleDrop(ev: React.DragEvent<HTMLLabelElement>) {
    ev.preventDefault()
    const f = ev.dataTransfer.files?.[0]
    if (f && isSupported(f)) update('file', f)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!values.reason.trim()) return setError('Reason is required')
    if (!values.proofUrl.trim()) return setError('Proof link is required')
    try {
      setSubmitting(true)
      
      // Submit verification to backend
      const formData = new FormData()
      formData.append('reason', values.reason)
      formData.append('proofUrl', values.proofUrl)
      if (values.file) {
        formData.append('image', values.file)
      }

      // Get JWT token from localStorage
      const token = localStorage.getItem('access_token')
      
      const response = await axiosPostMultiPart(`/api/stores/${params?.id}/verify`, formData, {
        Authorization: `Bearer ${token}`,
      })

      const result = response.data

      if (!response.status || response.status >= 400) {
        throw new Error(result.error || 'Failed to submit verification')
      }

      console.log('Verification submitted successfully:', result)
      setError(null)
      
      // Show success toast
      toast.success('Verification submitted successfully! Thank you for helping improve our database.')
      
      // Clear form after successful submission
      setValues({
        reason: '',
        proofUrl: '',
        file: null,
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='w-full h-full flex flex-col overflow-hidden'>
      <div className='px-4 pt-4 pb-2 sticky top-0 bg_3 z-10'>
        <div className='flex items-center justify-between'>
          <div>
            <b className='text-[18px]'>Verify Store</b>
            <p className='text-sm text-gray-500'>ID: {params?.id}</p>
          </div>
          <Link href='/home?view=verify' className='text-sm underline'>Back</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='flex-1 overflow-y-auto csb p-4 flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Reason</label>
          <textarea
            value={values.reason}
            onChange={(e) => update('reason', e.target.value)}
            placeholder='Explain why this store should be verified'
            rows={4}
            className='w-full px-5 py-4 rounded-2xl bg-transparent border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Proof link</label>
          <input
            value={values.proofUrl}
            onChange={(e) => update('proofUrl', e.target.value)}
            placeholder='https://example.com/proof'
            className='w-full px-5 py-3 rounded-full bg-transparent border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500'
          />
          <p className='text-xs text-gray-400'>Could be a social page, website, article, etc.</p>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-semibold'>Optional image proof</label>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className='flex flex-col items-center justify-center gap-3 border border-dashed border-gray-700 rounded-2xl p-10 cursor-pointer hover:border-gray-500'
          >
            <div className='h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center'>
              <Upload />
            </div>
            <p className='text-gray-300'>Drag and drop image here <span className='text-gray-400'>or</span> <span className='underline'>upload</span></p>
            <p className='text-xs text-gray-500'>Only .png, .jpeg, .jpg</p>
            <input
              ref={fileInputRef}
              type='file'
              accept='.png,.jpg,.jpeg,image/png,image/jpeg'
              className='hidden'
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null
                if (f && isSupported(f)) update('file', f)
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

        <div className='flex items-center justify-center gap-2 pb-4'>
          <button
            type='submit'
            disabled={submitting}
            className='flex-1 h-[40px] rounded-full pry-bg cursor-pointer text-white px-4 text-sm max-w-[220px] disabled:opacity-60'
          >
            {submitting ? 'Submitting...' : 'Submit Verification'}
          </button>
        </div>
        <br />
        <br />
        <br />
        <br />
      </form>
    </div>
  )
}


