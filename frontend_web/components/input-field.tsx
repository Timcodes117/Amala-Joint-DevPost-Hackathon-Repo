'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputFieldProps {
  type: 'email' | 'password' | 'text' | 'number'
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  isObscure?: boolean
  className?: string
  required?: boolean
}

export default function InputField({
  type,
  label,
  placeholder,
  value,
  onChange,
  isObscure: _isObscure = false,
  className = '',
  required = false
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  
  const inputType = type === 'password' && showPassword ? 'text' : type
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-white text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
          required={required}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  )
}
