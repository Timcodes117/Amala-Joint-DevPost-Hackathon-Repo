"use client"
import React, { useEffect, useRef, useState } from 'react'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatBubble from '@/components/chat/ChatBubble'
import ChatQuickReplies from '@/components/chat/ChatQuickReplies'
import ChatInput from '@/components/chat/ChatInput'

type Message = { id: string; from: 'bot' | 'user'; text: string }

function Page() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', from: 'bot', text: '👋 Hey there!\nWelcome to Amala Joint!' },
    {
      id: 'm2',
      from: 'bot',
      text:
        "I'm here to help you add a new Amala spot so others can discover amazing places to eat. Ready to get started?",
    },
    { id: 'm3', from: 'user', text: "Yes, let's do it" },
    {
      id: 'm4',
      from: 'user',
      text: 'Show me the best Amala spot that’s affordable and has good rating.',
    },
    { id: 'm5', from: 'bot', text: 'Alright from the map, this is the closest to you.' },
  ])

  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const handleQuick = (id: string) => {
    if (id === 'start') {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), from: 'user', text: "Yes, let’s do it" },
      ])
    }
  }

  const handleSend = (text: string) => {
    const user: Message = { id: String(Date.now()), from: 'user', text }
    setMessages((prev) => [...prev, user])
  }

  return (
    <div className='w-full h-full flex flex-col overflow-hidden'>
      <ChatHeader title='Amala Bot' avatarUrl='/bot.gif' />
      <div className='flex-1 overflow-y-auto csb px-4 py-6 flex flex-col gap-3'>
        {messages.map((m) => (
          <ChatBubble key={m.id} from={m.from}>
            {m.text.split('\n').map((line, i) => (
              <span key={i} className='block'>
                {line}
              </span>
            ))}
          </ChatBubble>
        ))}

        <div className='mt-2'>
          <ChatQuickReplies
            options={[
              { id: 'skip', label: 'Nah, no need' },
              { id: 'start', label: "Yes, let’s do it!" },
            ]}
            onSelect={handleQuick}
          />
        </div>
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}

export default Page