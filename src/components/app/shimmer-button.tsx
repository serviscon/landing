'use client'

import Link from 'next/link'
import { Button } from '../ui/button'

type ShimmerButtonProps = {
  children: React.ReactNode
  icon?: React.ReactNode
  service?: string | ''
} & React.ComponentProps<typeof Button>

export function ShimmerButton({ children, icon, service, ...props }: ShimmerButtonProps) {
  const whatsappNumber = '5598986133076'
  const defaultMessage = encodeURIComponent(`👋 Olá! Gostaria de conhecer melhor os serviços da Serviscon. ${service || ''}`)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`

  return (
    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <Button
        variant="outline"
        className="before:mask before:mask-composite-exclude relative mt-2 w-full overflow-hidden border-none bg-gradient-to-r from-blue-800 to-sky-600 py-5 font-bold text-white transition-all duration-200 ease-in-out before:absolute before:inset-0 before:animate-[shimmer_3s_linear_infinite] before:rounded-sm before:bg-[length:200%_100%] before:bg-[linear-gradient(120deg,transparent,#ffffff,transparent)] before:p-[3px] before:content-[''] hover:scale-105 hover:text-white hover:brightness-110 md:mt-0"
        {...props}
      >
        {icon}
        {children}
      </Button>
    </Link>
  )
}
