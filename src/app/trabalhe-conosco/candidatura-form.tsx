'use client'

import { CheckCircle2, FileText, Lock, Send } from 'lucide-react'
import { useState } from 'react'
import { CURRICULO_EXTENSOES, CURRICULO_MAX_BYTES, type Vaga } from '@/lib/vagas'

const inputClass =
  'w-full rounded-md border-[1.5px] border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10'

const labelClass = 'font-semibold text-slate-600 text-xs uppercase tracking-wide'

function Required() {
  return <span className="ml-0.5 text-emerald-600">*</span>
}

export function CandidaturaForms({ vagas }: { vagas: Vaga[] }) {
  const [ativaId, setAtivaId] = useState(vagas[0]?.id)
  const ativa = vagas.find(vaga => vaga.id === ativaId) ?? vagas[0]

  if (!ativa) {
    return (
      <p className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-600">
        No momento não há vagas abertas. Volte em breve!
      </p>
    )
  }

  return (
    <>
      <p className="mb-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Escolha a área de interesse</p>

      <div role="tablist" aria-label="Áreas de atuação" className="mb-7 flex flex-wrap gap-2">
        {vagas.map(vaga => {
          const selecionada = vaga.id === ativa.id
          return (
            <button
              key={vaga.id}
              type="button"
              role="tab"
              aria-selected={selecionada}
              aria-controls={`painel-${vaga.id}`}
              onClick={() => setAtivaId(vaga.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] px-4 py-2 font-semibold text-sm transition-colors ${
                selecionada
                  ? 'border-blue-800 bg-blue-800 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-800'
              }`}
            >
              <span aria-hidden>{vaga.icone}</span>
              {vaga.aba}
            </button>
          )
        })}
      </div>

      {/* key: trocar de área limpa o formulário */}
      <FormularioVaga key={ativa.id} vaga={ativa} />
    </>
  )
}

function FormularioVaga({ vaga }: { vaga: Vaga }) {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [arrastando, setArrastando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erros, setErros] = useState<string[]>([])
  const [enviadoPara, setEnviadoPara] = useState<string | null>(null)

  function escolherArquivo(file: File | undefined) {
    if (!file) return
    const extensao = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!CURRICULO_EXTENSOES.includes(extensao)) {
      setErros(['O currículo deve ser PDF, DOC ou DOCX'])
      return
    }
    if (file.size > CURRICULO_MAX_BYTES) {
      setErros(['O currículo deve ter no máximo 4 MB'])
      return
    }
    setErros([])
    setArquivo(file)
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    if (!arquivo) {
      setErros(['Envie seu currículo'])
      return
    }

    const dados = new FormData(form)
    dados.set('area', vaga.id)
    dados.set('curriculo', arquivo)

    setEnviando(true)
    setErros([])
    try {
      const response = await fetch('/api/candidaturas', { method: 'POST', body: dados })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setErros(data.errors ?? [data.error ?? 'Não foi possível enviar. Tente novamente.'])
        return
      }
      setEnviadoPara(String(dados.get('nome') ?? '').split(' ')[0])
      form.reset()
      setArquivo(null)
    } catch {
      setErros(['Não foi possível enviar. Verifique sua conexão e tente novamente.'])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div
      id={`painel-${vaga.id}`}
      role="tabpanel"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-blue-900/10 shadow-lg"
    >
      <div className="flex items-start gap-4 bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-6 sm:px-7">
        <div className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl" aria-hidden>
          {vaga.icone}
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-white text-xl">{vaga.titulo}</h2>
          <p className="mt-1 text-sm text-white/80">{vaga.descricao}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 font-bold text-[11px] text-white uppercase tracking-wide">
            <span className="size-2 rounded-full bg-emerald-400" />
            Vagas abertas
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {enviadoPara !== null ? (
          <div className="rounded-xl border-[1.5px] border-emerald-500 bg-emerald-50 px-6 py-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 size-10 text-emerald-600" />
            <h3 className="font-bold text-emerald-800 text-lg">Currículo enviado com sucesso!</h3>
            <p className="mt-1 text-slate-600 text-sm">
              Obrigado pelo interesse{enviadoPara ? `, ${enviadoPara}` : ''}. Nossa equipe de RH vai analisar seu currículo e
              entrará em contato em breve.
            </p>
            <button
              type="button"
              onClick={() => setEnviadoPara(null)}
              className="mt-5 font-semibold text-blue-800 text-sm hover:underline"
            >
              Enviar outro currículo
            </button>
          </div>
        ) : (
          <form onSubmit={enviar} className="space-y-5">
            {/* Campo invisível contra robôs */}
            <input type="text" name="site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${vaga.id}-nome`} className={labelClass}>
                  Nome completo <Required />
                </label>
                <input id={`${vaga.id}-nome`} name="nome" required autoComplete="name" placeholder="Seu nome completo" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${vaga.id}-email`} className={labelClass}>
                  E-mail <Required />
                </label>
                <input
                  id={`${vaga.id}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${vaga.id}-telefone`} className={labelClass}>
                  Telefone / WhatsApp <Required />
                </label>
                <input
                  id={`${vaga.id}-telefone`}
                  name="telefone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(98) 9 0000-0000"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${vaga.id}-cidade`} className={labelClass}>
                  Cidade <Required />
                </label>
                <input id={`${vaga.id}-cidade`} name="cidade" required placeholder="Ex.: São Luís – MA" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${vaga.id}-bairro`} className={labelClass}>
                  Bairro <Required />
                </label>
                <input id={`${vaga.id}-bairro`} name="bairro" required placeholder="Ex.: Cohama" className={inputClass} />
              </div>

              {vaga.campos.map(campo => (
                <div key={campo.id} className="flex flex-col gap-1.5">
                  <label htmlFor={`${vaga.id}-${campo.id}`} className={labelClass}>
                    {campo.label}
                  </label>
                  <select id={`${vaga.id}-${campo.id}`} name={campo.id} defaultValue="" className={inputClass}>
                    <option value="">Selecione</option>
                    {campo.opcoes.map(opcao => (
                      <option key={opcao}>{opcao}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor={`${vaga.id}-obs`} className={labelClass}>
                  Observações (opcional)
                </label>
                <textarea
                  id={`${vaga.id}-obs`}
                  name="observacoes"
                  maxLength={2000}
                  placeholder={vaga.placeholderObs ?? 'Informe algo adicional se necessário…'}
                  className={`${inputClass} min-h-24 resize-y`}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <span className={labelClass}>
                  Currículo (PDF ou Word) <Required />
                </span>
                <label
                  onDragOver={e => {
                    e.preventDefault()
                    setArrastando(true)
                  }}
                  onDragLeave={() => setArrastando(false)}
                  onDrop={e => {
                    e.preventDefault()
                    setArrastando(false)
                    escolherArquivo(e.dataTransfer.files[0])
                  }}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors ${
                    arrastando ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <FileText className="mx-auto mb-2 size-8 text-blue-700" />
                  <span className="block font-semibold text-blue-800 text-sm">Clique aqui ou arraste seu currículo</span>
                  <span className="mt-1 block text-slate-400 text-xs">PDF, DOC ou DOCX — máx. 4 MB</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => escolherArquivo(e.target.files?.[0])}
                    className="sr-only"
                  />
                </label>
                {arquivo && (
                  <div className="flex items-center gap-2 rounded-md border-[1.5px] border-emerald-500 bg-emerald-50 px-3 py-2 font-semibold text-emerald-800 text-sm">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span className="truncate">{arquivo.name}</span>
                  </div>
                )}
              </div>
            </div>

            {erros.length > 0 && (
              <ul className="space-y-1 rounded-lg bg-red-50 px-4 py-3 text-red-700 text-sm" role="alert">
                {erros.map(erro => (
                  <li key={erro}>• {erro}</li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-slate-200 border-t pt-5">
              <p className="flex max-w-sm items-start gap-1.5 text-slate-400 text-xs">
                <Lock className="mt-0.5 size-3.5 shrink-0" />
                Seus dados são tratados com sigilo, conforme a LGPD, e usados apenas para o processo seletivo.
              </p>
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3 font-bold text-sm text-white transition-all hover:-translate-y-px hover:bg-emerald-500 disabled:translate-y-0 disabled:opacity-60"
              >
                {enviando ? 'Enviando…' : 'Enviar Currículo'}
                <Send className="size-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
