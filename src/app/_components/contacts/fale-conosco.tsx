'use client'

import { CheckCircle2, Mail, MapPin, Send } from 'lucide-react'
import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-700 focus:ring-3 focus:ring-blue-700/10'

// Sugestões do campo de serviço (o cliente também pode escrever outro)
const SERVICOS = [
  'Limpeza e Conservação',
  'Portaria',
  'Recepção',
  'Jardinagem e Paisagismo',
  'Copeiragem',
  'Manutenção Predial',
  'Supervisão',
  'Mais de um serviço',
]

const WHATSAPP_URL =
  'https://wa.me/5598986133076?text=%F0%9F%91%8B%20Ol%C3%A1!%20Gostaria%20de%20conhecer%20melhor%20os%20servi%C3%A7os%20da%20Serviscon.'

export function FaleConosco() {
  const [enviando, setEnviando] = useState(false)
  const [erros, setErros] = useState<string[]>([])
  const [enviado, setEnviado] = useState(false)

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    setEnviando(true)
    setErros([])
    try {
      const response = await fetch('/api/contato', { method: 'POST', body: new FormData(form) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setErros(data.errors ?? [data.error ?? 'Não foi possível enviar. Tente novamente.'])
        return
      }
      form.reset()
      setEnviado(true)
    } catch {
      setErros(['Não foi possível enviar. Verifique sua conexão e tente novamente.'])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div id="fale-conosco" className="mt-12 scroll-mt-24 rounded-2xl bg-white p-6 text-left shadow-xl sm:p-10">
      <h3 className="font-bold text-2xl text-blue-900">Solicite uma proposta</h3>
      <p className="mt-2 text-blue-900/80 text-lg">
        Conte o que sua empresa precisa e nosso time comercial entra em contato com uma proposta sob medida.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <ul className="space-y-7 self-center text-blue-950">
          <li className="flex items-start gap-4">
            <MapPin className="mt-0.5 size-8 shrink-0 text-blue-800" strokeWidth={1.75} />
            <span className="leading-snug sm:text-lg">
              <span className="whitespace-nowrap">R. dos Timbós, 75-15</span> –{' '}
              <span className="whitespace-nowrap">Jardim Renascença</span>
              <br />
              São Luís – MA, <span className="whitespace-nowrap">65075-410</span>
            </span>
          </li>
          <li>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-4 hover:text-blue-700">
              <FaWhatsapp className="size-8 shrink-0 text-blue-800" />
              <span className="sm:text-lg">(98) 98613-3076</span>
            </a>
          </li>
          <li>
            <a href="mailto:comercial@serviscon.com.br" className="flex items-center gap-4 hover:text-blue-700">
              <Mail className="size-8 shrink-0 text-blue-800" strokeWidth={1.75} />
              <span className="min-w-0 break-words sm:text-lg">comercial@serviscon.com.br</span>
            </a>
          </li>
        </ul>

        {enviado ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-[1.5px] border-emerald-500 bg-emerald-50 px-6 py-12 text-center">
            <CheckCircle2 className="mb-3 size-10 text-emerald-600" />
            <p className="font-bold text-emerald-800 text-lg">Solicitação recebida!</p>
            <p className="mt-1 text-slate-600">Obrigado pelo interesse. Nosso time comercial vai entrar em contato em breve.</p>
            <button type="button" onClick={() => setEnviado(false)} className="mt-5 font-semibold text-blue-800 text-sm hover:underline">
              Enviar outra solicitação
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} className="grid gap-4 sm:grid-cols-2">
            {/* Campo invisível contra robôs */}
            <input type="text" name="site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <input name="nome" required maxLength={200} autoComplete="name" placeholder="Nome completo" aria-label="Nome completo" className={inputClass} />
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              placeholder="Qual seu e-mail?"
              aria-label="E-mail"
              className={inputClass}
            />
            <input
              name="telefone"
              type="tel"
              required
              maxLength={40}
              autoComplete="tel"
              placeholder="Telefone"
              aria-label="Telefone"
              className={`${inputClass} sm:col-span-2`}
            />
            <input name="empresa" maxLength={200} autoComplete="organization" placeholder="Empresa" aria-label="Empresa" className={inputClass} />
            <input
              name="assunto"
              required
              maxLength={200}
              list="servicos-interesse"
              placeholder="Serviço de interesse"
              aria-label="Serviço de interesse"
              className={inputClass}
            />
            <datalist id="servicos-interesse">
              {SERVICOS.map(servico => (
                <option key={servico} value={servico} />
              ))}
            </datalist>
            <textarea
              name="mensagem"
              required
              maxLength={5000}
              placeholder="Conte um pouco sobre a necessidade: local, quantidade de postos/colaboradores, horários…"
              aria-label="Mensagem"
              className={`${inputClass} min-h-40 resize-y sm:col-span-2`}
            />

            {erros.length > 0 && (
              <ul className="space-y-1 rounded-lg bg-red-50 px-4 py-3 text-red-700 text-sm sm:col-span-2" role="alert">
                {erros.map(erro => (
                  <li key={erro}>• {erro}</li>
                ))}
              </ul>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-10 py-3 font-semibold text-lg text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
              >
                {enviando ? 'Enviando…' : 'Enviar'}
                <Send className="size-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
