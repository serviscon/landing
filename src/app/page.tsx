import { Contacts } from './_components/contacts'
import { Footer } from './_components/footer'
import { Header } from './_components/header'
import { Hero } from './_components/hero'
import { Partners } from './_components/partners'
import { Segments } from './_components/segments'
import { Services } from './_components/services'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <Hero />
      <Services />
      <Segments />
      <Partners />
      <Contacts />
      <Footer />
    </main>
  )
}
