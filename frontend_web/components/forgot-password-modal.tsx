'use client'

import React, { useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

type ForgotPasswordModalProps = {
  isOpen: boolean
  onClose: () => void
}

function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'form' | 'success'>('form')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const reset = () => {
    setEmail('')
    setState('form')
    setSubmitting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate async request; replace with real API call later
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    setState('success')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={() => { onClose(); reset() }} />

      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-[#1f1f1f] text-white shadow-2xl border border-gray-800">
        <button
          aria-label="Close"
          onClick={() => { onClose(); reset() }}
          className="absolute right-3 top-3 p-1 rounded-md hover:bg-white/10"
        >
          <X size={18} />
        </button>

        {state === 'form' && (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Reset your password</h3>
              <p className="text-sm text-gray-300">Enter the email tied to your account.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="forgot-email" className="text-sm text-gray-300">Email address</label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-[#2c2c2c] border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full pry-bg text-white py-2.5 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        {state === 'success' && (
          <div className="p-6 flex flex-col items-center text-center gap-3">
            <CheckCircle size={40} className="text-emerald-400" />
            <h3 className="text-lg font-semibold">Email sent</h3>
            <p className="text-sm text-gray-300 max-w-xs">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 w-full">
              <button onClick={reset} className="w-full rounded-full bg-[#2c2c2c] py-2 text-sm hover:bg-[#353535]">Try again</button>
              <button onClick={() => { onClose(); reset() }} className="w-full rounded-full pry-bg text-white py-2 text-sm">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordModal


