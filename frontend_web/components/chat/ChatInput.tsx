'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'

type ChatInputProps = {
  onSend: (text: string) => void
}

function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('')

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }

  return (
    <form onSubmit={submit} className='w-full flex items-center gap-2 px-4 py-3 border-t border_1 sticky bottom-0'>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Enter text'
        className='flex-1 h-[48px] rounded-full bg_3 px-4 outline-none'
      />
      <button
        type='submit'
        aria-label='Send message'
        className='h-12 w-12 rounded-full bg-[#3A3A3A] flex items-center justify-center'
      >
        <Send size={18} className='text-gray-300' />
      </button>
    </form>
  )
}

export default ChatInput


