'use client'

import InputField from '@/components/input-field'
import React, { useState } from 'react'
import { axiosPost } from '@/utils/http/api'
import { getIdTokenWithPopup } from '@/utils/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { ApiResponse, SignupPayload, LoginResponseData } from '@/utils/types'
import EmailVerificationModal from '@/components/email-verification-modal'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'


function Page() {
  const { login: authLogin } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)
  const [resent, setResent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
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
      toast.error(passwordError)
      return
    }
    
    try {
      setSubmitting(true)
      const payload: SignupPayload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
      }
      
      console.log('Sending signup request:', payload) // Debug log
      
      const res = await axiosPost('/api/auth/signup', payload)
      console.log('Raw response:', res) // Debug log
      console.log('Response status:', res.status) // Debug log
      console.log('Response headers:', res.headers) // Debug log
      
      const apiData = res.data as ApiResponse<LoginResponseData>
      console.log('Parsed response:', apiData) // Debug log
      
      if (apiData.success) {
        console.log('Signup success:', apiData.data)
        // Auto-login user after successful signup
        const { access_token, refresh_token, user } = apiData.data
        
        // Use AuthContext login method for proper state management
        authLogin({ access_token, refresh_token }, user)
        
        toast.success('Account created successfully! Please verify your email.')
        
        // Show verification modal
        setShowVerifyModal(true)
      } else {
        // Handle API success=false case
        const errorMessage = apiData.error || 'Signup failed'
        toast.error(errorMessage)
        console.error('Signup API error:', apiData)
      }
    } catch (err: unknown) {
      console.error('Signup catch block - Full error:', err) // Debug log
      
      let message = 'Signup failed'
      if (typeof err === 'object' && err !== null) {
        const maybeAxios = err as { 
          response?: { 
            status?: number,
            data?: { error?: string, success?: boolean } 
          },
          message?: string 
        }
        
        console.log('Axios error details:', {
          status: maybeAxios?.response?.status,
          data: maybeAxios?.response?.data,
          message: maybeAxios?.message
        })
        
        // Check if it's actually a successful response but caught as error
        if (maybeAxios?.response?.data?.success === true) {
          const responseData = maybeAxios.response.data as any
          console.log('Success response caught as error:', responseData)
          
          // Handle successful response that was caught as error
          const { access_token, refresh_token, user } = responseData.data
          authLogin({ access_token, refresh_token }, user)
          toast.success('Account created successfully! Please verify your email.')
          setShowVerifyModal(true)
          return
        }
        
        message = maybeAxios?.response?.data?.error || maybeAxios?.message || message
      } else if (typeof err === 'string') {
        message = err
      }
      
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setGoogleLoading(true)
      const idToken = await getIdTokenWithPopup()
      const res = await axiosPost('/api/auth/google', { idToken })
      const apiData = res.data as ApiResponse<LoginResponseData>
      if (!apiData.success) throw new Error(apiData.error || 'Google signup failed')
      const { access_token, refresh_token, user } = apiData.data
      
      // Use AuthContext login method for proper state management
      authLogin({ access_token, refresh_token }, user)
      
      toast.success('Signed up with Google successfully!')
      
      // Redirect to home page
      router.push('/home')
    } catch (err: unknown) {
      let message = 'Google signup failed'
      if (typeof err === 'object' && err !== null) {
        const maybeAxios = err as { response?: { data?: { error?: string } }, message?: string }
        message = maybeAxios?.response?.data?.error || maybeAxios?.message || message
      } else if (typeof err === 'string') {
        message = err
      }
      toast.error(message)
      console.error('Google signup error:', err)
    } finally {
      setGoogleLoading(false)
    }
  }


  return (
    <>
          <EmailVerificationModal
            isOpen={showVerifyModal}
            email={formData.email}
            onClose={() => {
              setShowVerifyModal(false)
              // Redirect to home after closing verification modal
              router.push('/home')
            }}
            onResend={async () => {
              try {
                setResending(true)
                setResendError(null)
                setResent(false)
                // Backend currently lacks a resend endpoint. Attempt and handle 404 gracefully.
                await axiosPost('/api/auth/resend-verification', { email: formData.email })
                setResent(true)
                toast.success('Verification email resent successfully!')
              } catch (err: unknown) {
                let code: number | undefined
                let msg: string | undefined
                if (typeof err === 'object' && err !== null) {
                  const maybeAxios = err as { response?: { status?: number, data?: { error?: string } } }
                  code = maybeAxios?.response?.status
                  msg = maybeAxios?.response?.data?.error
                } else if (typeof err === 'string') {
                  msg = err
                }
                if (code === 404) {
                  setResendError('Resend endpoint not available. Please try again later.')
                } else {
                  setResendError(msg || 'Failed to resend verification email')
                }
                toast.error(msg || 'Failed to resend verification email')
              } finally {
                setResending(false)
              }
            }}
            isResending={resending}
            resendError={resendError}
            resent={resent}
          />
          <div className='w-full my-8'>
            <h1 className='text-[28px] font-semibold text-gray-100 mb-2'>Create an Account</h1>
            <p className='text-gray-300 text-sm'>
            Start your journey to discovering and sharing the best <br /> Amala spots near you.
            </p>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={googleLoading || submitting}
            className='w-full bg-[#2c2c2c] hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-full flex items-center justify-center space-x-3 transition-all duration-200 mb-6 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            {googleLoading ? (
              <ClipLoader color='#ffffff' size={18} />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>{googleLoading ? 'Signing up...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className='relative flex items-center justify-center mb-6 gap-4'>
            <div className='flex flex-grow h-[1px] bg-gray-800' />
            <span className='text-gray-400 text-sm px-3 py-1 rounded-lg'>or</span>
            <div className='flex flex-grow h-[1px] bg-gray-800' />

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>

            <div className='w-full flex gap-5'>
              {/* First Name Field */}
            <InputField
              type="text"
              label="First Name"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              required
            />
            {/* Last Nam Field */}
            <InputField
              type="text"
              label="Last Name"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              required
            />
            </div>


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
                placeholder="Create Password"
                value={formData.password}
                onChange={handleInputChange('password')}
                isObscure={true}
                required
              />
              {passwordError && (
                <p className="text-red-400 text-xs mt-2">{passwordError}</p>
              )}
            </div>

            {/* Terms & Conditions - tiny checkbox under password */}
            <label className='tiny-checkbox text-sm text-gray-300'>
              <input type='checkbox' required aria-label='Agree to terms and conditions' />
              <span>
                By checking this you agree to our <a href="#" className='underline text-white'>terms</a> and
                <a href="#" className='underline text-white'> conditions</a>.
              </span>
            </label>

          

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className='w-full bg-[#CF3A3A] text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {submitting && <ClipLoader color='#ffffff' size={18} />}
              {submitting ? '' : 'Create Account'}
            </button>
          </form>

          
          {/* Signup Link */}
          <div className='text-center mt-6'>
            <span className='text-gray-300 text-sm'>
              Already have an account?{' '}
              <a href="/auth/login" className='text-white underline hover:text-gray-300 font-medium'>
                Log in
              </a>
            </span>
          </div>
    </>
  )
}

export default Page