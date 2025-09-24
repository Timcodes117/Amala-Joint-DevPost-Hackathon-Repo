'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type ChatHeaderProps = {
  title: string
  subtitle?: string
  avatarUrl?: string
  backHref?: string
}

function ChatHeader({ title, subtitle = "I'm here to assist you!", avatarUrl, backHref = '/home' }: ChatHeaderProps) {
  return (
    <div className='w-full flex items-center gap-3 px-4 py-3 border-b border_1'>
      <Link href={backHref} className='h-10 w-10 rounded-full bg-[#1A1A1A] flex items-center justify-center'>
        <ChevronLeft size={18} className='text-white' />
      </Link>

      <div className='h-10 w-10 rounded-full overflow-hidden bg-black/40 flex items-center justify-center'>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={title} className='w-full h-full object-cover' />
        ) : (
          <div  className='w-[28px] h-[28px] rounded-full bg-black bg-[url(/bot.gif)] bg-center bg-cover' />
        )}
      </div>

      <div className='flex flex-col'>
        <b className='text-[18px]'>{title}</b>
        {subtitle ? <span className='text-sm text_muted'>{subtitle}</span> : null}
      </div>
    </div>
  )
}

export default ChatHeader


