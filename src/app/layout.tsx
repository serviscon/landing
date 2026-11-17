import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

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
      <body className={`antialiased ${geist.className}`}>
        {children}

        {/* Google Tag Manager */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-11002985895" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11002985895');
          `}
        </Script>
        {/* Conversão do Google Ads: clique em qualquer link de WhatsApp (fora do painel admin) */}
        <Script id="conversao-whatsapp" strategy="afterInteractive">
          {`
            document.addEventListener('click', function (e) {
              var a = e.target.closest && e.target.closest('a');
              if (!a || location.pathname.indexOf('/admin') === 0) return;
              if (/wa\\.me|whatsapp/i.test(a.href) && typeof gtag === 'function') {
                gtag('event', 'conversion', {
                  send_to: 'AW-11002985895/c-lJCN-Xzu8ZEKf70P4o'
                });
              }
            });
          `}
        </Script>
      </body>
    </html>
  )
}
