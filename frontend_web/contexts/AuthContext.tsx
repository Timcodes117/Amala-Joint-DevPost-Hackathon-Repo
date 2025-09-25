'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type AuthUser = {
  _id?: string
  name?: string
  email?: string
  [key: string]: any
} | null

type AuthContextValue = {
  user: AuthUser
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (tokens: { access_token?: string; refresh_token?: string }, user?: any) => void
  logout: () => void
  setUser: (user: AuthUser) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const storedUser = localStorage.getItem('user')
      const at = localStorage.getItem('access_token')
      const rt = localStorage.getItem('refresh_token')
      if (storedUser) setUser(JSON.parse(storedUser))
      if (at) setAccessToken(at)
      if (rt) setRefreshToken(rt)
    } catch {
      // ignore parse/storage errors
    }
  }, [])

  const login = (tokens: { access_token?: string; refresh_token?: string }, u?: any) => {
    if (tokens?.access_token) {
      localStorage.setItem('access_token', tokens.access_token)
      setAccessToken(tokens.access_token)
    }
    if (tokens?.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token)
      setRefreshToken(tokens.refresh_token)
    }
    if (u) {
      localStorage.setItem('user', JSON.stringify(u))
      setUser(u)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    } catch {}
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(accessToken && user),
    login,
    logout,
    setUser,
  }), [user, accessToken, refreshToken])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


