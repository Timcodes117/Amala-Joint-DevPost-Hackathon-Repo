'use client'

import React, { useState } from 'react'
import { Mail, X, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { axiosPost } from '@/utils/http/api'

interface VerificationModalProps {
  isOpen: boolean
  userEmail: string
  onClose?: () => void // Optional since it's fixed modal
  onUserVerified?: () => void
}

export default function VerificationModal({ 
  isOpen, 
  userEmail, 
  onClose,
  onUserVerified 
}: VerificationModalProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  const handleResendEmail = async () => {
    try {
      setIsResending(true)
      setResendError(null)
      setResendSuccess(false)

      await axiosPost('/api/auth/resend-verification', { email: userEmail })
      
      setResendSuccess(true)
      toast.success('Verification email sent successfully!')
      
      // Reset success state after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000)
    } catch (error) {
      console.error('Resend verification error:', error)
      setResendError('Failed to send verification email. Please try again.')
      toast.error('Failed to send verification email')
    } finally {
      setIsResending(false)
    }
  }

  const handleCheckVerification = async () => {
    try {
      // Check if user is verified by making a request to get user info
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.success && userData.data?.email_verified) {
          // Update localStorage with verified user
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
          const updatedUser = { ...currentUser, email_verified: true }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          
          toast.success('Email verified successfully!')
          onUserVerified?.()
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Check verification error:', error)
      return false
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification Required</h2>
          <p className="text-gray-600">
            Please verify your email address to continue using the app.
          </p>
        </div>

        {/* Email Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 font-medium">{userEmail}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">1</span>
            </div>
            <p className="text-gray-700 text-sm">
              Check your email inbox for a verification link
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">2</span>
            </div>
            <p className="text-gray-700 text-sm">
              Click the verification link in the email
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-bold">3</span>
            </div>
            <p className="text-gray-700 text-sm">
              Return to this app and click "I've Verified"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Resend Verification Email
              </>
            )}
          </button>

          <button
            onClick={handleCheckVerification}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            I've Verified My Email
          </button>
        </div>

        {/* Status Messages */}
        {resendSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 text-sm">Verification email sent successfully!</span>
          </div>
        )}

        {resendError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 text-sm">{resendError}</span>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This modal will remain open until your email is verified.
          </p>
        </div>
      </div>
    </div>
  )
}
