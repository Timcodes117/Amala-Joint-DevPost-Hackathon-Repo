'use client'

import InputField from '@/components/input-field'
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import ForgotPasswordModal from '@/components/forgot-password-modal'
import { axiosPost } from '@/utils/http/api'
import { getIdTokenWithPopup } from '@/utils/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { ApiResponse, LoginPayload, LoginResponseData } from '@/utils/types'


function Page() {
  const { login: authLogin } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validate password when password field changes
    if (field === 'password') {
      validatePassword(value)
    }
  }

  const validatePassword = (password: string) => {
    const errors = []
    
    if (password.length < 6) {
      errors.push('at least 6 characters')
    }
    
    if (!/\d/.test(password)) {
      errors.push('at least one number')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('at least one uppercase letter')
    }
    
    if (errors.length > 0) {
      setPasswordError(`Password must contain ${errors.join(', ')}`)
    } else {
      setPasswordError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password before submitting
    if (passwordError) {
      alert(passwordError)
      return
    }
    
    try {
      setSubmitting(true)
      const payload: LoginPayload = { email: formData.email, password: formData.password }
      const res = await axiosPost('/api/auth/login', payload)
      const apiData = res.data as ApiResponse<LoginResponseData>
      if (!apiData.success) throw new Error(apiData.error || 'Login failed')
      const { access_token, refresh_token, user } = apiData.data
      if (access_token) localStorage.setItem('access_token', access_token)
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
      if (user) localStorage.setItem('user', JSON.stringify(user))
      console.log('Login success:', user)
      alert('Logged in successfully')
    } catch (err: unknown) {
      let message = 'Login failed'
      if (typeof err === 'object' && err !== null) {
        const maybeAxios = err as { response?: { data?: { error?: string } } }
        message = maybeAxios?.response?.data?.error || message
      } else if (typeof err === 'string') {
        message = err
      }
      alert(message)
      console.error('Login error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const idToken = await getIdTokenWithPopup()
      const res = await axiosPost('/api/auth/google', { idToken })
      const apiData = res.data as ApiResponse<LoginResponseData>
      if (!apiData.success) throw new Error(apiData.error || 'Google login failed')
      const { access_token, refresh_token, user } = apiData.data
      if (access_token) localStorage.setItem('access_token', access_token)
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
      if (user) localStorage.setItem('user', JSON.stringify(user))
      authLogin({ access_token, refresh_token }, user)
      alert('Logged in with Google')
    } catch (err: unknown) {
      let message = 'Google login failed'
      if (typeof err === 'object' && err !== null) {
        const maybeAxios = err as { response?: { data?: { error?: string } }, message?: string }
        message = maybeAxios?.response?.data?.error || maybeAxios?.message || message
      } else if (typeof err === 'string') {
        message = err
      }
      alert(message)
      console.error('Google login error:', err)
    }
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
            <div>
              <InputField
                type="password"
                label="Password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleInputChange('password')}
                isObscure={true}
                required
              />
              {passwordError && (
                <p className="text-red-400 text-xs mt-1">{passwordError}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className='text-left'>
              <button type='button' onClick={() => setIsForgotOpen(true)} className='text-white underline hover:text-gray-300 text-sm'>
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className='w-full bg-[#CF3A3A] text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {submitting && <ClipLoader color='#ffffff' size={18} />}
              {submitting ? 'Logging in...' : 'Log in'}
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
