'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { ShimmerButton } from '@/components/app/shimmer-button'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

type NavItemsProps = {
  setOpen: (open: boolean) => void
}

export function NavItems({ setOpen }: NavItemsProps) {
  const navItems = [
    { label: 'Início', href: '#home' },
    { label: 'Parceiros', href: '#partners' },
    { label: 'Segmentos', href: '#segments' },
    { label: 'Serviços', href: '#services' },
    { label: 'Contato', href: '#contacts' },
  ]

  return (
    <>
      {navItems.map(item => (
        <Fragment key={item.href}>
          {/* Mobile: botão com gradiente */}
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full bg-white font-semibold text-sky-800 transition-colors duration-500 hover:from-white hover:to-white hover:font-bold hover:text-sky-900 lg:hidden"
          >
            <Link href={item.href} className="w-full">
              {item.label}
            </Link>
          </Button>

          {/* Desktop: só texto com hover branco */}
          <Link
            href={item.href}
            className="hidden items-center rounded-xl px-4 py-2 font-semibold text-sky-900 transition-all duration-500 hover:bg-white/80 hover:text-sky-950 hover:shadow-sm lg:inline-flex"
          >
            {item.label}
          </Link>
        </Fragment>
      ))}

      <Separator className="my-2 bg-muted/50 lg:hidden" />

      <ShimmerButton icon={<FaWhatsapp />}>Solicitar Orçamento</ShimmerButton>
    </>
  )
}
