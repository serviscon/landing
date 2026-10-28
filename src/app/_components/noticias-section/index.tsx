'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import type { Noticia } from '@/db'

// A data é salva como YYYY-MM-DD; formatamos em UTC para não "voltar" um dia no fuso do Brasil
function formatDate(data: string) {
  return new Date(data).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function NewsMeta({ noticia }: { noticia: Noticia }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge className="bg-blue-50 text-blue-800 hover:bg-blue-50">{noticia.categoria}</Badge>
      <time dateTime={noticia.data} className="text-gray-500 text-xs">
        {formatDate(noticia.data)}
      </time>
    </div>
  )
}

function NewsImage({ noticia, sizes }: { noticia: Noticia; sizes: string }) {
  if (!noticia.imagemUrl) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-100 to-sky-50">
        <span className="font-semibold text-blue-300">Serviscon</span>
      </div>
    )
  }

  return (
    <Image
      src={noticia.imagemUrl}
      alt={noticia.titulo}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  )
}

function FeaturedNews({ noticia }: { noticia: Noticia }) {
  return (
    <Link href={`/noticias/${noticia.slug}`} className="group block">
      <article className="grid items-center gap-6 md:grid-cols-[320px_1fr] md:gap-8">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-blue-50 shadow-sm md:aspect-[15/8]">
          <NewsImage noticia={noticia} sizes="(min-width: 768px) 320px, 100vw" />
        </div>

        <div className="space-y-3">
          <NewsMeta noticia={noticia} />
          <h3 className="font-semibold text-gray-900 text-xl leading-snug transition-colors group-hover:text-blue-800 lg:text-2xl">
            {noticia.titulo}
          </h3>
          <p className="line-clamp-3 max-w-3xl text-gray-600 leading-relaxed">{noticia.resumo}</p>
          <span className="inline-flex items-center gap-1.5 font-medium text-blue-700 text-sm">
            Ler notícia completa
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  )
}

function CompactNews({ noticia }: { noticia: Noticia }) {
  return (
    <Link href={`/noticias/${noticia.slug}`} className="group block">
      <article className="flex gap-4">
        <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-blue-50">
          <NewsImage noticia={noticia} sizes="96px" />
        </div>

        <div className="min-w-0 space-y-1.5">
          <NewsMeta noticia={noticia} />
          <h4 className="line-clamp-3 font-semibold text-gray-900 text-sm leading-snug transition-colors group-hover:text-blue-800">
            {noticia.titulo}
          </h4>
        </div>
      </article>
    </Link>
  )
}

export function NoticiasSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const response = await fetch('/api/noticias/recentes')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        setNoticias(await response.json())
      } catch (error) {
        console.error('Erro ao carregar notícias:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNoticias()
  }, [])

  // Sem notícias publicadas, a seção não aparece na home
  if (!loading && noticias.length === 0) return null

  const [destaque, ...demais] = noticias

  return (
    <section id="noticias" className="scroll-mt-24 border-blue-100/60 border-y bg-white py-10 lg:py-12">
      <div className="container mx-auto px-4">
        <header className="mb-6 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-3 font-semibold text-2xl text-gray-900">
            <span className="h-7 w-1.5 rounded-full bg-blue-700" aria-hidden />
            Últimas Notícias
          </h2>
          <Link
            href="/noticias"
            className="group inline-flex shrink-0 items-center gap-1.5 font-medium text-blue-700 text-sm hover:text-blue-900"
          >
            Ver todas as notícias
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </header>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-[320px_1fr]">
            <div className="aspect-[15/8] animate-pulse rounded-xl bg-gray-100" />
            <div className="space-y-3 py-2">
              <div className="h-5 w-40 animate-pulse rounded bg-gray-100" />
              <div className="h-7 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ) : (
          <>
            <FeaturedNews noticia={destaque} />

            {demais.length > 0 && (
              <div className="mt-8 grid gap-6 border-gray-100 border-t pt-8 md:grid-cols-2 lg:grid-cols-3">
                {demais.map(noticia => (
                  <CompactNews key={noticia.id} noticia={noticia} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
