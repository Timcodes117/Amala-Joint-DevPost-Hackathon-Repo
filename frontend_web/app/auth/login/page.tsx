'use client'

import InputField from '@/components/input-field'
import React, { useState } from 'react'
import ForgotPasswordModal from '@/components/forgot-password-modal'


function Page() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login form submitted:', formData)
  }

  const handleGoogleAuth = () => {
    console.log('Google authentication')
  }

  const [isForgotOpen, setIsForgotOpen] = useState(false)

  return (
    <>
          <div className='w-full my-8'>
            <h1 className='text-[28px] font-semibold text-gray-100 mb-2'>Login to Continue</h1>
            <p className='text-gray-300 text-sm'>
              Enter your details, and let&apos;s continue the fun.<br />
              Get the nearest serving of Amala near you!
            </p>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            className='w-full bg-[#2c2c2c] hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-full flex items-center justify-center space-x-3 transition-all duration-200 mb-6'
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Login with Google</span>
          </button>

          {/* Divider */}
          <div className='relative flex items-center justify-center mb-6 gap-4'>
            <div className='flex flex-grow h-[1px] bg-gray-800' />
            <span className='text-gray-400 text-sm px-3 py-1 rounded-lg'>or</span>
            <div className='flex flex-grow h-[1px] bg-gray-800' />

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Email Field */}
            <InputField
              type="email"
              label="Email Address"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
            />

            {/* Password Field */}
            <InputField
              type="password"
              label="Password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleInputChange('password')}
              isObscure={true}
              required
            />

            {/* Forgot Password Link */}
            <div className='text-left'>
              <button type='button' onClick={() => setIsForgotOpen(true)} className='text-white underline hover:text-gray-300 text-sm'>
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className='w-full bg-[#CF3A3A] text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02]'
            >
              Log in
            </button>
          </form>

          <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />

          {/* Signup Link */}
          <div className='text-center mt-6'>
            <span className='text-gray-300 text-sm'>
              Don&apos;t have an account yet?{' '}
              <a href="/auth/signup" className='text-white underline hover:text-gray-300 font-medium'>
                Create new account
              </a>
            </span>
          </div>
    </>
  )
}

export default Page