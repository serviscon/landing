'use client'

import { Check, Download, Mail, MessageCircle, Trash2, Undo2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Candidatura } from '@/db'
import { getVaga, VAGAS } from '@/lib/vagas'

// createdAt vem do SQLite em UTC ("YYYY-MM-DD HH:MM:SS")
function formatDateTime(value: string) {
  return new Date(`${value.replace(' ', 'T')}Z`).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Fortaleza',
  })
}

const UFS =
  'AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO'

// A cidade é digitada livremente: "São Luís – MA", "sao luis", "São Luís/MA" viram a mesma chave
function nomeCidade(cidade: string) {
  return cidade
    .trim()
    .replace(new RegExp(`(?:\\s+|\\s*[-–—/,(]\\s*)(${UFS})\\)?\\.?$`, 'i'), '')
    .replace(/[\s.,;–—-]+$/, '')
    .trim()
}

function chaveCidade(cidade: string) {
  return nomeCidade(cidade)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function whatsappUrl(telefone: string) {
  const digitos = telefone.replace(/\D/g, '')
  return `https://wa.me/${digitos.startsWith('55') ? digitos : `55${digitos}`}`
}

export default function AdminCandidaturasPage() {
  const router = useRouter()
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([])
  const [loading, setLoading] = useState(true)
  const [area, setArea] = useState('')
  const [status, setStatus] = useState<'' | 'novo' | 'analisado'>('')
  const [cidade, setCidade] = useState('')
  const [ocupado, setOcupado] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCandidaturas() {
      try {
        const response = await fetch('/api/candidaturas')
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        setCandidaturas(await response.json())
      } catch (error) {
        console.error('Erro ao carregar candidaturas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCandidaturas()
  }, [router])

  async function alterarStatus(candidatura: Candidatura) {
    const novoStatus = candidatura.status === 'novo' ? 'analisado' : 'novo'
    setOcupado(candidatura.id)
    try {
      const response = await fetch(`/api/candidaturas/${candidatura.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      })
      if (!response.ok) throw new Error()
      setCandidaturas(lista => lista.map(c => (c.id === candidatura.id ? { ...c, status: novoStatus } : c)))
    } catch {
      alert('Erro ao atualizar candidatura')
    } finally {
      setOcupado(null)
    }
  }

  async function excluir(candidatura: Candidatura) {
    if (!confirm(`Excluir definitivamente a candidatura de ${candidatura.nome}? O currículo também será apagado.`)) return

    setOcupado(candidatura.id)
    try {
      const response = await fetch(`/api/candidaturas/${candidatura.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error()
      setCandidaturas(lista => lista.filter(c => c.id !== candidatura.id))
    } catch {
      alert('Erro ao excluir candidatura')
    } finally {
      setOcupado(null)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // Opções do filtro de local: uma por cidade, com a grafia mais usada e a quantidade
  const cidades = Object.entries(
    candidaturas.reduce<Record<string, Record<string, number>>>((grupos, c) => {
      const chave = chaveCidade(c.cidade)
      const nome = nomeCidade(c.cidade) || c.cidade
      grupos[chave] ??= {}
      grupos[chave][nome] = (grupos[chave][nome] ?? 0) + 1
      return grupos
    }, {})
  )
    .map(([chave, grafias]) => {
      const ordenadas = Object.entries(grafias).sort((a, b) => b[1] - a[1])
      return { chave, nome: ordenadas[0][0], total: ordenadas.reduce((soma, [, n]) => soma + n, 0) }
    })
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  const filtradas = candidaturas.filter(
    c =>
      (!area || c.area === area) &&
      (!status || c.status === status) &&
      (!cidade || chaveCidade(c.cidade) === cidade)
  )
  const novas = candidaturas.filter(c => c.status === 'novo').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="border-blue-100 border-b bg-white shadow-sm">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <div>
            <h1 className="font-bold text-2xl text-gray-900">Candidaturas</h1>
            <p className="text-gray-600">
              Currículos enviados pela página Trabalhe Conosco
              {novas > 0 && <span className="ml-2 font-semibold text-blue-800">· {novas} nova(s)</span>}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/noticias">
              <Button variant="outline">Notícias</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="mb-6 flex flex-wrap gap-3">
          <select
            value={area}
            onChange={e => setArea(e.target.value)}
            aria-label="Filtrar por área"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todas as áreas</option>
            {VAGAS.map(vaga => (
              <option key={vaga.id} value={vaga.id}>
                {vaga.titulo}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as typeof status)}
            aria-label="Filtrar por status"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos os status</option>
            <option value="novo">Novas</option>
            <option value="analisado">Analisadas</option>
          </select>
          <select
            value={cidade}
            onChange={e => setCidade(e.target.value)}
            aria-label="Filtrar por local"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos os locais</option>
            {cidades.map(c => (
              <option key={c.chave} value={c.chave}>
                {c.nome} ({c.total})
              </option>
            ))}
          </select>
          <span className="self-center text-gray-500 text-sm">{filtradas.length} candidatura(s)</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : filtradas.length === 0 ? (
          <div className="rounded-lg border-2 border-gray-300 border-dashed bg-white p-12 text-center text-gray-600">
            Nenhuma candidatura {candidaturas.length > 0 ? 'com esses filtros' : 'recebida ainda'}.
          </div>
        ) : (
          <div className="space-y-4">
            {filtradas.map(candidatura => {
              const vaga = getVaga(candidatura.area)
              const respostas = Object.entries(candidatura.respostas ?? {})
              return (
                <article
                  key={candidatura.id}
                  className={`rounded-lg border bg-white p-5 shadow-sm ${candidatura.status === 'novo' ? 'border-blue-300' : 'border-gray-200'}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-gray-900 text-lg">{candidatura.nome}</h2>
                        <Badge className={candidatura.status === 'novo' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}>
                          {candidatura.status === 'novo' ? 'Nova' : 'Analisada'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {vaga ? `${vaga.icone} ${vaga.titulo}` : candidatura.area} · {candidatura.cidade} · enviada em{' '}
                        {formatDateTime(candidatura.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a href={candidatura.curriculoUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" className="bg-blue-800 text-white hover:bg-blue-900">
                          <Download className="size-4" />
                          Currículo
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alterarStatus(candidatura)}
                        disabled={ocupado === candidatura.id}
                      >
                        {candidatura.status === 'novo' ? <Check className="size-4" /> : <Undo2 className="size-4" />}
                        {candidatura.status === 'novo' ? 'Marcar como analisada' : 'Marcar como nova'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => excluir(candidatura)}
                        disabled={ocupado === candidatura.id}
                        aria-label={`Excluir candidatura de ${candidatura.nome}`}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <a href={`mailto:${candidatura.email}`} className="inline-flex items-center gap-1.5 text-blue-700 hover:underline">
                      <Mail className="size-4" />
                      {candidatura.email}
                    </a>
                    <a
                      href={whatsappUrl(candidatura.telefone)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline"
                    >
                      <MessageCircle className="size-4" />
                      {candidatura.telefone}
                    </a>
                  </div>

                  {(respostas.length > 0 || candidatura.observacoes) && (
                    <dl className="mt-4 grid gap-x-6 gap-y-2 rounded-md bg-gray-50 p-4 text-sm sm:grid-cols-2">
                      {respostas.map(([label, valor]) => (
                        <div key={label}>
                          <dt className="text-gray-500 text-xs uppercase">{label}</dt>
                          <dd className="text-gray-900">{valor}</dd>
                        </div>
                      ))}
                      {candidatura.observacoes && (
                        <div className="sm:col-span-2">
                          <dt className="text-gray-500 text-xs uppercase">Observações</dt>
                          <dd className="whitespace-pre-line text-gray-900">{candidatura.observacoes}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
