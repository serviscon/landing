'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { NavItems } from './nav-items'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <section className="fixed top-0 right-0 left-0 z-50 w-full border-white border-b-2 bg-gradient-to-r from-blue-800 to-blue-100 p-2 shadow-md shadow-muted backdrop-blur-md">
      <div className="container mx-auto animate-fade-in">
        <div className="flex items-center justify-between">
          <Link href="#home">
            <Image src="/serviscon-logo.png" alt="Logo" width={170} height={150} priority quality={100} />
          </Link>

          {/* Header em modo Desktop */}
          <nav className="hidden items-center space-x-4 lg:flex">
            <NavItems setOpen={setOpen} />
          </nav>

          {/* Header em modo Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size={'icon'} className="transition-all duration-300 hover:text-blue-800">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent className="bg-gradient-to-b from-blue-800 to-blue-100">
              <SheetHeader>
                <SheetTitle>
                  <Image src="/serviscon-logo.png" alt="Logo" width={170} height={150} priority quality={100} />
                </SheetTitle>
                <SheetDescription />
              </SheetHeader>

              <section className="mx-4 flex flex-col gap-2 space-y-6">
                <nav className="flex flex-col space-y-2">
                  <NavItems setOpen={setOpen} />
                </nav>
              </section>

              <SheetFooter className="text-center font-medium text-blue-800 text-sm">
                &copy; {new Date().getFullYear()} Serviscon. Todos os direitos reservados
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  )
}
