'use client'
import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { Bell, Heart, LogOut, HelpCircle, Store, User2 } from 'lucide-react'
import { RxHamburgerMenu } from 'react-icons/rx'
import ThemeToggle from './theme-toggle'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

type MobileSidebarProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function MenuItem({ href, icon: Icon, label }: { href: string, icon: React.ComponentType<{ size?: number; className?: string }>, label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Dialog.Close asChild>
      <Link href={href} className='flex items-center gap-3 py-4 px-2 rounded-md hover:bg-white/5 transition-colors'>
        <Icon size={20} className={isActive ? 'text-[#CF3A3A]' : 'text-gray-500'} />
        <span className='text-sm'>{label}</span>
      </Link>
    </Dialog.Close>
  )
}

export default function MobileSidebar(props: MobileSidebarProps) {
  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Trigger asChild>
        <button aria-label='Open menu' className='md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10'>
          <RxHamburgerMenu size={20} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/60 backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <Dialog.Content className='fixed left-0 top-0 h-full w-[84%] max-w-[380px] bg_2  shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left'>
          <div className='p-5 pt-10'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex flex-col'>
              <div className='w-[64px] h-[64px] rounded-full bg-red-600 overflow-hidden flex items-center justify-center'>
                <Image src='/avatar_placeholder.png' alt='' className='w-full h-full object-cover opacity-90' width={64} height={64} />
              </div>
                <span className='text-lg font-semibold mt-2'>Timothy Adeleye</span>
                <span className='text-gray-400 text-sm'>09027489172</span>
              </div>
              <div className='ml-auto p-2 rounded-full bg-gray-100/10 min-w-fit'>
                <ThemeToggle />
              </div>
            </div>

            <hr className='opacity-50' />

            <nav className='mt-2'>
              <MenuItem href='/home' icon={Store} label='Stores' />
              <MenuItem href='/home/saved' icon={Heart} label='Saved Stores' />
              <MenuItem href='/home/chat' icon={() => (
                <div className='w-[22px] h-[22px] rounded-full bg-[url(/bot.gif)] bg-center bg-cover' />
              )} label='AI Chat' />

              <hr className='opacity-50' />

              <MenuItem href='/home/notifications' icon={Bell} label='Notifications' />
              <MenuItem href='/home/profile' icon={User2} label='Profile' />
              <MenuItem href='/home/help' icon={HelpCircle} label='Help' />

              <hr className='opacity-50' />

              <MenuItem href='/logout' icon={LogOut} label='Log out' />
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


