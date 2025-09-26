'use client'

import React, { createContext, useCallback, useContext } from 'react'

type ClipboardContextValue = {
  copyToClipboard: (text: string) => Promise<boolean>
}

const ClipboardContext = createContext<ClipboardContextValue | undefined>(undefined)

export function ClipboardProvider({ children }: { children: React.ReactNode }) {
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      }
    } catch (_) {
      // fallthrough to legacy method
    }

    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    } catch (_) {
      return false
    }
  }, [])

  return (
    <ClipboardContext.Provider value={{ copyToClipboard }}>
      {children}
    </ClipboardContext.Provider>
  )
}

export function useClipboard(): ClipboardContextValue {
  const ctx = useContext(ClipboardContext)
  if (!ctx) throw new Error('useClipboard must be used within a ClipboardProvider')
  return ctx
}


