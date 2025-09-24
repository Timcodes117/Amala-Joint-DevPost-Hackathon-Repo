'use client'

import React from 'react'

type ChatBubbleProps = {
  from: 'bot' | 'user'
  children: React.ReactNode
}

function ChatBubble({ from, children }: ChatBubbleProps) {
  const isUser = from === 'user'

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          'max-w-[78%] md:max-w-[70%] rounded-[16px] px-4 py-3 text-[15px] leading-relaxed ' +
          (isUser ? 'bg-gray-600/50  text-white' : 'bg_3 ')
        }
      >
        {children}
      </div>
    </div>
  )
}

export default ChatBubble


