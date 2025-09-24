'use client'

import React from 'react'

type QuickRepliesProps = {
  options: { id: string; label: string }[]
  onSelect?: (id: string) => void
}

function ChatQuickReplies({ options, onSelect }: QuickRepliesProps) {
  return (
    <div className='w-full flex flex-row gap-2 flex-wrap'>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect?.(opt.id)}
          className='px-4 py-2 rounded-full bg-[#2A2A2A] text-white text-sm'
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default ChatQuickReplies


