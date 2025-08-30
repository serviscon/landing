import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: 'Serviscon',
  description: 'Transforme seu negócio com nossa gestão completa!',
  icons: '/favicon.png',
  authors: [{ name: 'Hilquias Ferreira Melo', url: 'https://github.com/hfmelodev' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${geist.className}`}>{children}</body>
    </html>
  )
}
