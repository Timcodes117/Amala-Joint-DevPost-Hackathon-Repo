'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import { CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type VerificationState = 'loading' | 'success' | 'error' | 'resending'

export default function VerifyUserPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [state, setState] = useState<VerificationState>('loading')
  const [message, setMessage] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [resendState, setResendState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const verifyEmail = async () => {
    try {
      setState('loading')
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setState('success')
        setMessage(data.message)
        
        // Update user object in localStorage to mark as verified
        try {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            const user = JSON.parse(storedUser)
            const updatedUser = { ...user, email_verified: true }
            localStorage.setItem('user', JSON.stringify(updatedUser))
          }
        } catch (error) {
          console.error('Error updating user in localStorage:', error)
        }
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push('/home')
        }, 2000)
      } else {
        setState('error')
        setMessage(data.error || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setState('error')
      setMessage('Network error. Please try again.')
    }
  }

  useEffect(() => {
    if (token) {
      verifyEmail()
    }
  }, [token, verifyEmail])

  const handleResendEmail = async () => {
    if (!userEmail) {
      setResendState('error')
      return
    }

    try {
      setResendState('loading')
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      })

      const data = await response.json()
      
      if (data.success) {
        setResendState('success')
        setTimeout(() => setResendState('idle'), 3000)
      } else {
        setResendState('error')
        setTimeout(() => setResendState('idle'), 3000)
      }
    } catch (error) {
      console.error('Resend error:', error)
      setResendState('error')
      setTimeout(() => setResendState('idle'), 3000)
    }
  }

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <ClipLoader 
              color="#3B82F6" 
              loading={true} 
              size={50} 
              aria-label="Loading Spinner"
            />
            <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
            <p className="text-gray-600">Please wait while we verify your account</p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
            <div className="pt-4">
              <Link 
                href="/home"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Enter your email to resend verification
                </label>
                <input
                  id="email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleResendEmail}
                disabled={resendState === 'loading' || !userEmail}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {resendState === 'loading' ? (
                  <>
                    <ClipLoader color="#ffffff" size={20} className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </button>

              {resendState === 'success' && (
                <p className="text-green-600 text-sm">✓ Verification email sent successfully!</p>
              )}
              
              {resendState === 'error' && (
                <p className="text-red-600 text-sm">✗ Failed to send email. Please try again.</p>
              )}
            </div>

            <div className="pt-4">
              <Link 
                href="/auth/signup"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign Up
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/20 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/20 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  )
}
