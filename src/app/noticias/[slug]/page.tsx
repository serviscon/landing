import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { database, noticiasTable } from '@/db'
import { eq, isNull } from 'drizzle-orm'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const noticia = await database
    .select()
    .from(noticiasTable)
    .where(eq(noticiasTable.slug, slug) && eq(noticiasTable.status, 'publicado') && isNull(noticiasTable.deletedAt))
    .limit(1)
    .then(results => results[0])

  if (!noticia) {
    return { title: 'Notícia não encontrada' }
  }

  return {
    title: noticia.titulo,
    description: noticia.resumo,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumo,
      type: 'article',
      url: `https://landing.serviscon.com.br/noticias/${slug}`,
      images: noticia.imagemUrl
        ? [
            {
              url: `https://landing.serviscon.com.br${noticia.imagemUrl}`,
              width: 1200,
              height: 630,
              alt: noticia.titulo,
            },
          ]
        : [],
    },
  }
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params

  const noticia = await database
    .select()
    .from(noticiasTable)
    .where(eq(noticiasTable.slug, slug) && eq(noticiasTable.status, 'publicado') && isNull(noticiasTable.deletedAt))
    .limit(1)
    .then(results => results[0])

  if (!noticia) {
    notFound()
  }

  const formattedDate = new Date(noticia.data).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <article className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb e botão voltar */}
          <div className="mb-8 flex items-center gap-2">
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 text-blue-800 transition-colors hover:text-blue-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Notícias
            </Link>
          </div>

          {/* Header da Notícia */}
          <header className="mb-12 max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{noticia.categoria}</Badge>
              <time className="text-sm text-gray-500">{formattedDate}</time>
            </div>

            <h1 className="mb-4 font-bold text-4xl text-gray-900 lg:text-5xl">{noticia.titulo}</h1>

            <p className="text-xl text-gray-600">{noticia.resumo}</p>
          </header>

          {/* Imagem Principal */}
          {noticia.imagemUrl && (
            <div className="mb-12 overflow-hidden rounded-xl shadow-lg">
              <Image
                src={noticia.imagemUrl}
                alt={noticia.titulo}
                width={1200}
                height={600}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          )}

          {/* Conteúdo */}
          <div className="prose prose-lg max-w-4xl">
            <div
              dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
              className="space-y-6 text-gray-800"
            />
          </div>
        </div>
      </article>

      {/* Seção de Outras Notícias */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-4 font-bold text-3xl text-gray-900">Leia Outras Notícias</h2>
            <Link
              href="/noticias"
              className="inline-flex items-center rounded-lg bg-blue-800 px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-900"
            >
              Ver Todas as Notícias
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
