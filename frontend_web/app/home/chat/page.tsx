"use client"
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatBubble from '@/components/chat/ChatBubble'
import ChatInput from '@/components/chat/ChatInput'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { axiosPost } from '@/utils/http/api'

type CTAAction =
  | { type: 'navigate'; label?: string; query: string }
  | { type: 'link'; label?: string; url: string }
  | { type: 'amala_finder'; label?: string; query: string }

type Message = { id: string; from: 'bot' | 'user'; text: string; ctas?: CTAAction[] }

interface LocationData {
  latitude?: number
  longitude?: number
  address?: string
}

interface AppContextData {
  location?: LocationData
  locale?: string
}

function Page() {
  const appContext = useApp()
  const { location, locale } = (appContext as AppContextData) || {}
  const { accessToken, isAuthenticated } = useAuth()
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', from: 'bot', text: '👋 Hey there!\nWelcome to Amala Joint!' },
  ])

  const handleAmalaFinder = async (query: string) => {
    try {
      setError(null)
      if (!isAuthenticated || !accessToken) {
        setError('You need to be logged in to search')
        return
      }
      const userLocation = location?.latitude && location?.longitude
        ? `${location.latitude},${location.longitude}`
        : (location?.address || '')

      const { data } = await axiosPost('/api/ai/amala_finder', { query, location: userLocation }, { Authorization: `Bearer ${accessToken}` })
      if (!data?.success) {
        setError(data?.error || 'Search failed')
        return
      }

      const payload = (data.data && (data.data as { response?: unknown }).response) || data.response
      const resultText = typeof payload === 'string' ? payload : JSON.stringify(payload)
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), from: 'bot', text: resultText },
      ])
    } catch {
      setError('Search error')
    }
  }

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  // const handleQuick = (id: string) => {
  //   if (id === 'start') {
  //     setMessages((prev) => [
  //       ...prev,
  //       { id: String(Date.now()), from: 'user', text: "Yes, let&apos;s do it" },
  //     ])
  //   }
  // }

  const handleSend = (text: string) => {
    const user: Message = { id: String(Date.now()), from: 'user', text }
    setMessages((prev) => [...prev, user])
    void sendToBot(text)
  }

  const parseBotResponse = (payload: unknown): { text: string; ctas?: CTAAction[]; intent?: string; raw?: unknown } => {
    // Accepts string or object; tries to extract text and optional CTA actions
    if (typeof payload === 'string') {
      return { text: payload }
    }
    if (payload && typeof payload === 'object') {
      const obj = payload as Record<string, unknown>
      // Prefer normalized envelope {intent, message, data}
      if (typeof obj.intent === 'string' && ('message' in obj || 'data' in obj)) {
        const msg = typeof obj.message === 'string' ? obj.message : (typeof obj.data === 'string' ? obj.data : JSON.stringify(obj.data))
        const dataObj = obj.data as { ctas?: CTAAction[] } | undefined
        const ctas = Array.isArray(dataObj?.ctas) ? dataObj.ctas : (Array.isArray(obj.ctas) ? obj.ctas as CTAAction[] : undefined)
        return { text: msg, ctas, intent: obj.intent, raw: obj }
      }
      // Common shapes: { text, ctas } or { message } or { response }
      const text = typeof obj.text === 'string'
        ? obj.text
        : typeof obj.message === 'string'
        ? obj.message
        : typeof obj.response === 'string'
        ? obj.response
        : JSON.stringify(obj)
      const ctas = Array.isArray(obj.ctas) ? (obj.ctas as CTAAction[]) : undefined
      return { text, ctas, raw: obj }
    }
    return { text: String(payload) }
  }

  const sendToBot = async (message: string) => {
    try {
      setIsSending(true)
      setError(null)
      if (!isAuthenticated || !accessToken) {
        setError('You need to be logged in to chat')
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now()), from: 'bot', text: 'Please log in to continue the conversation.' },
        ])
        return
      }
      const userAddress = location?.address || ''
      const { data } = await axiosPost('/api/ai/chat', { message, lang: locale || 'en', address: userAddress }, { Authorization: `Bearer ${accessToken}` })
      if (!data?.success) {
        setError(data?.error || 'Failed to get response')
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now()), from: 'bot', text: 'Sorry, I ran into an issue. Please try again.' },
        ])
        return
      }

      const parsed = parseBotResponse(data)
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), from: 'bot', text: parsed.text, ctas: parsed.ctas },
      ])

      // If AI requested to add a store, trigger creation
      if (parsed.intent === 'add_store') {
        const rawData = parsed.raw as { data?: Record<string, unknown> } | undefined
        const addPayload = rawData?.data || {}
        void handleAddStore(addPayload)
      }
    } catch {
      setError('Network error')
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), from: 'bot', text: 'Network issue. Please check your connection.' },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const handleAddStore = async (storeData: Record<string, unknown>) => {
    try {
      if (!isAuthenticated || !accessToken) {
        setError('You need to be logged in to add a store')
        return
      }

      const required = ['name', 'phone', 'location', 'opensAt', 'closesAt', 'description']
      const missing = required.filter((k) => !(storeData as Record<string, unknown>)?.[k])
      if (missing.length) {
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now()), from: 'bot', text: `Missing fields: ${missing.join(', ')}. Please provide them to proceed.` },
        ])
        return
      }

      const { data } = await axiosPost('/api/stores/add', storeData as Record<string, string | number>, { Authorization: `Bearer ${accessToken}` })
      if (!data?.success) {
        setMessages((prev) => [
          ...prev,
          { id: String(Date.now()), from: 'bot', text: `Failed to add store: ${data?.error || 'Unknown error'}` },
        ])
        return
      }

      const storeResponse = data.store as { place_id?: string } | undefined
      const responseData = data.data as { place_id?: string } | undefined
      const placeId = storeResponse?.place_id || responseData?.place_id
      const link = placeId ? `/home/${placeId}` : '/home'
      const md = `✅ Store added! [View store](${link})` 
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), from: 'bot', text: md },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), from: 'bot', text: 'An error occurred while adding the store.' },
      ])
    }
  }

  const openInMaps = (query: string, coords?: { lat?: number | null; long?: number | null }) => {
    const q = encodeURIComponent(query)
    const hasCoords = coords && coords.lat && coords.long
    const url = hasCoords
      ? `https://www.google.com/maps/search/?api=1&query=${coords!.lat},${coords!.long}(${q})`
      : `https://www.google.com/maps/search/?api=1&query=${q}`
    if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleNavigate = async (query: string) => {
    try {
      setError(null)
      if (!isAuthenticated || !accessToken) {
        setError('You need to be logged in to use navigation')
        return
      }

      const userLocation = location?.latitude && location?.longitude
        ? `${location.latitude},${location.longitude}`
        : (location?.address || '')

      const { data } = await axiosPost('/api/ai/navigate', { query, location: userLocation }, { Authorization: `Bearer ${accessToken}` })
      if (!data?.success) {
        setError(data?.error || 'Navigation failed')
        return
      }

      const response = (data.data && (data.data as { response?: unknown }).response) || data.response
      // Try to detect a maps URL or fallback to a maps search
      const responseObj = response as { maps_url?: string; url?: string } | undefined
      const mapsUrl: string | undefined =
        (typeof response === 'object' && response && responseObj?.maps_url) ||
        (typeof response === 'object' && response && responseObj?.url)

      if (mapsUrl && typeof mapsUrl === 'string') {
        if (typeof window !== 'undefined') window.open(mapsUrl, '_blank', 'noopener,noreferrer')
      } else {
        openInMaps(query, { lat: location?.latitude ?? null, long: location?.longitude ?? null })
      }
    } catch {
      setError('Navigation error')
    }
  }

  return (
    <div className='w-full h-full max-h-[80vh] flex flex-col overflow-hidden'>
      <div className='hidden sm:block'>
        <ChatHeader title='Amala Bot' avatarUrl='/bot.gif' />
      </div>
      <div className='flex-1 overflow-y-auto csb px-4 py-6 flex flex-col gap-3'>
        {messages.map((m) => (
          <ChatBubble key={m.id} from={m.from}>
            {m.from === 'bot' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {m.text}
              </ReactMarkdown>
            ) : (
              m.text.split('\n').map((line, i) => (
                <span key={i} className='block'>
                  {line}
                </span>
              ))
            )}
            {m.from === 'bot' && m.ctas && m.ctas.length > 0 ? (
              <div className='mt-3 flex flex-row gap-2 flex-wrap'>
                {m.ctas.map((cta, idx) => (
                  <button
                    key={`${m.id}-cta-${idx}`}
                    onClick={() => {
                      if (cta.type === 'link') {
                        if (typeof window !== 'undefined') window.open(cta.url, '_blank', 'noopener,noreferrer')
                      } else if (cta.type === 'navigate') {
                        void handleNavigate(cta.query)
                      } else if (cta.type === 'amala_finder') {
                        void handleAmalaFinder(cta.query)
                      }
                    }}
                    className='px-3 py-2 rounded-full bg-[#2A2A2A] text-white text-sm'
                  >
                    {cta.label || (cta.type === 'navigate' ? 'Get Directions' : cta.type === 'amala_finder' ? 'Find Nearby Amala' : 'Open Link')}
                  </button>
                ))}
              </div>
            ) : null}
          </ChatBubble>
        ))}

        <div className='mt-2'>
          {/* <ChatQuickReplies
            options={[
              { id: 'skip', label: 'Nah, no need' },
              { id: 'start', label: "Yes, let&apos;s do it!" },
            ]}
            onSelect={handleQuick}
          /> */}
        </div>
        <div ref={bottomRef} />
      </div>

      <div className='px-4'>
        {isSending ? <p className='text-xs text-gray-400 pb-1'>Sending...</p> : null}
        {error ? <p className='text-xs text-red-400 pb-1'>{error}</p> : null}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  )
}

export default Page