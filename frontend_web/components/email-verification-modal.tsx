'use client'

import React, { useState, useEffect } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import { HiCheckBadge } from 'react-icons/hi2'

type EmailVerificationModalProps = {
  isOpen: boolean
  email: string
  onClose: () => void
  onResend: () => Promise<void>
  isResending?: boolean
  resendError?: string | null
  resent?: boolean
}

export default function EmailVerificationModal({
  isOpen,
  email,
  onClose,
  onResend,
  isResending = false,
  resendError = null,
  resent = false
}: EmailVerificationModalProps) {
  const [cooldownSeconds, setCooldownSeconds] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setCooldownSeconds(60)
      setCanResend(false)
      return
    }

    // Start cooldown when modal opens
    setCooldownSeconds(60)
    setCanResend(false)
    
    const interval = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg_2  shadow-2xl border border-gray-800">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 p-1 rounded-md hover:bg-white/10"
        >
          <X size={18} />
        </button>

        <div className="p-6 flex flex-col items-center text-center gap-3">
          <HiCheckBadge size={40} className="text-emerald-400" />
          <h3 className="text-lg font-semibold">Verification email sent</h3>
          <p className="text-sm text-gray-800 text_muted max-w-xs">
            We sent a verification link to <b>{email || 'your email'}</b>. Please check your inbox and spam.
          </p>

          {resent && (
            <p className="text-xs text-emerald-400">Resent successfully. Check your inbox again.</p>
          )}
          {resendError && (
            <p className="text-xs text-red-400">{resendError}</p>
          )}

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            <button
              onClick={onClose}
              className="w-full rounded-full bg-[#2c2c2c] py-3 text-sm hover:bg-[#353535]"
            >
              Close
            </button>
            <button
              onClick={onResend}
              disabled={isResending || !canResend}
              className="w-full rounded-full pry-bg text-white py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isResending && <ClipLoader color="#ffffff" size={16} />}
              {canResend ? 'Resend' : `Resend (${cooldownSeconds}s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


