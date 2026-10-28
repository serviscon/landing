import type { Metadata } from 'next'
import { VAGAS } from '@/lib/vagas'
import { Footer } from '../_components/footer'
import { Header } from '../_components/header'
import { CandidaturaForms } from './candidatura-form'

export const metadata: Metadata = {
  title: 'Trabalhe Conosco | Serviscon',
  description: 'Faça parte do time Serviscon. Escolha a área de interesse e envie seu currículo.',
}

export default function TrabalheConoscoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 px-4 pt-32 pb-12 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="mb-4 inline-block rounded-full border border-white/25 bg-white/15 px-3.5 py-1 font-bold text-[11px] text-white uppercase tracking-widest">
            Oportunidades de Emprego
          </span>
          <h1 className="font-extrabold text-3xl text-white leading-tight lg:text-4xl">Faça parte do time Serviscon</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Selecione a vaga de seu interesse e envie seu currículo. Nossa equipe de RH entrará em contato em breve.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 pt-9 pb-16">
        <CandidaturaForms vagas={VAGAS.filter(vaga => vaga.aberta)} />
      </section>

      <Footer />
    </main>
  )
}
