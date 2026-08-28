'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Noticia } from '@/db'

interface NewsCardProps {
  noticia: Noticia
}

function NewsCard({ noticia }: NewsCardProps) {
  const formattedDate = new Date(noticia.data).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/noticias/${noticia.slug}`}>
      <article className="group overflow-hidden rounded-xl border border-blue-100 bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Imagem */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
          {noticia.imagemUrl ? (
            <Image
              src={noticia.imagemUrl}
              alt={noticia.titulo}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-gray-400">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Categoria e Data */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              {noticia.categoria}
            </Badge>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>

          {/* Título */}
          <h3 className="mb-2 line-clamp-2 font-bold text-lg text-gray-900 transition-colors group-hover:text-blue-800">
            {noticia.titulo}
          </h3>

          {/* Resumo */}
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {noticia.resumo}
          </p>

          {/* Botão */}
          <button className="inline-flex items-center font-semibold text-blue-800 transition-all group-hover:gap-2">
            LEIA MAIS
            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </article>
    </Link>
  )
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const response = await fetch('/api/noticias')
        const data = await response.json()
        // Filtrar apenas publicadas
        const publicadas = data.filter((n: Noticia) => n.status === 'publicado')
        setNoticias(publicadas)
      } catch (error) {
        console.error('Erro ao carregar notícias:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNoticias()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24">
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">📰 Notícias</Badge>
            <h1 className="mb-3 font-bold text-4xl text-gray-900 lg:text-5xl">Notícias Serviscon</h1>
            <p className="mx-auto max-w-2xl text-gray-600 text-lg">
              Acompanhe as principais ações, projetos e acontecimentos da Serviscon.
            </p>
          </div>

          {/* Grid de Notícias */}
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 animate-pulse rounded-xl bg-gray-200" />
              ))}
            </div>
          ) : noticias.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {noticias.map(noticia => (
                <NewsCard key={noticia.id} noticia={noticia} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-500">Nenhuma notícia publicada ainda.</p>
            </div>
          )}

          {/* Botão voltar */}
          {noticias.length > 0 && (
            <div className="mt-12 text-center">
              <Link
                href="/#noticias"
                className="inline-flex items-center rounded-lg bg-blue-800 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-900"
              >
                ← Voltar para Home
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
