'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login',
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, accessToken } = useAuth()
  const router = useRouter()

  // Show loading while checking authentication
  if (isAuthenticated === undefined) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClipLoader color="#3B82F6" loading={true} size={50} />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show login/signup buttons
  if (!isAuthenticated || !user || !accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="w-full max-w-sm mx-auto p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 text_muted">Please log in or sign up to access this feature</p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/auth/login"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white pry-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              Login
            </Link>
            
            <Link 
              href="/auth/signup"
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white/20 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  // User is authenticated, render children
  return <>{children}</>
}
