'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  const router = useRouter()
  const { logout, user } = useAuth()

  useEffect(() => {
    // Show error message
    toast.error('Spot not found. You have been logged out for security reasons.')
    
    // Log out the user
    logout()
    
    // Redirect to home after a short delay
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [logout, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-600" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">404</h1>
          <h2 className="text-xl font-semibold text-gray-700">Spot Not Found</h2>
          <p className="text-gray-600">
            The spot you're looking for doesn't exist or has been removed.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Security Notice:</strong> You have been logged out for security reasons. 
            Please log in again to continue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/auth/login"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Login
          </Link>
          
          <button
            onClick={() => router.back()}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Auto-redirect notice */}
        <p className="text-sm text-gray-500">
          You will be automatically redirected to the home page in a few seconds...
        </p>
      </div>
    </div>
  )
}
