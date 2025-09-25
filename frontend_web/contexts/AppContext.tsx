'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

type AppContextValue = {
  locale: string
  setLocale: (v: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (v: boolean) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>('en')
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  const value = useMemo<AppContextValue>(() => ({
    locale,
    setLocale,
    isSidebarOpen,
    setIsSidebarOpen,
  }), [locale, isSidebarOpen])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}


