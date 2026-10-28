'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { type ImageItem, ImagesField, uploadImages } from '../_components/images-field'
import type { Foto } from '@/lib/fotos'

interface FormData {
  titulo: string
  resumo: string
  categoria: string
  data: string
  conteudo: string
  status: 'rascunho' | 'publicado'
}

const CATEGORIAS = [
  'Institucional',
  'Eventos',
  'Treinamentos',
  'Responsabilidade Social',
  'Tecnologia',
  'Operações',
  'Pessoas',
]

export default function NovaNoticiaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagens, setImagens] = useState<ImageItem[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    resumo: '',
    categoria: 'Institucional',
    data: new Date().toISOString().split('T')[0],
    conteudo: '',
    status: 'rascunho',
  })

  async function handleSubmit(e: React.FormEvent, saveAs: 'rascunho' | 'publicado') {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    try {
      let fotos: Foto[]
      try {
        fotos = await uploadImages(imagens)
      } catch (error) {
        setErrors([error instanceof Error ? error.message : 'Erro ao fazer upload da imagem'])
        setLoading(false)
        return
      }

      // Criar notícia
      const response = await fetch('/api/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imagens: fotos,
          status: saveAs,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setErrors(data.errors || [data.error || 'Erro ao criar notícia'])
        setLoading(false)
        return
      }

      alert(`Notícia salva como ${saveAs === 'publicado' ? 'publicada' : 'rascunho'}!`)
      router.push('/admin/noticias')
    } catch (error) {
      setErrors(['Erro ao criar notícia'])
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-bold text-2xl text-gray-900">Nova Notícia</h1>
          <p className="text-gray-600">Crie e publique uma nova notícia</p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        {errors.length > 0 && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <h3 className="font-semibold text-red-900 text-sm">Erros encontrados:</h3>
            <ul className="mt-2 space-y-1 text-red-800 text-sm">
              {errors.map((error, i) => (
                <li key={i}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <form className="space-y-8 rounded-lg bg-white p-8 shadow">
          {/* Título */}
          <div>
            <label htmlFor="titulo" className="block font-semibold text-gray-700 text-sm">
              TÍTULO *
            </label>
            <input
              id="titulo"
              type="text"
              value={formData.titulo}
              onChange={e => setFormData({ ...formData, titulo: e.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Digite o título da notícia"
            />
          </div>

          {/* Resumo */}
          <div>
            <label htmlFor="resumo" className="block font-semibold text-gray-700 text-sm">
              RESUMO / SUBTÍTULO *
            </label>
            <textarea
              id="resumo"
              value={formData.resumo}
              onChange={e => setFormData({ ...formData, resumo: e.target.value })}
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Descreva brevemente a notícia"
            />
          </div>

          {/* Categoria e Data */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="categoria" className="block font-semibold text-gray-700 text-sm">
                CATEGORIA *
              </label>
              <select
                id="categoria"
                value={formData.categoria}
                onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="data" className="block font-semibold text-gray-700 text-sm">
                DATA *
              </label>
              <input
                id="data"
                type="date"
                value={formData.data}
                onChange={e => setFormData({ ...formData, data: e.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Fotos */}
          <ImagesField value={imagens} onChange={setImagens} disabled={loading} />

          {/* Conteúdo */}
          <div>
            <label htmlFor="conteudo" className="block font-semibold text-gray-700 text-sm">
              CONTEÚDÓ *
            </label>
            <textarea
              id="conteudo"
              value={formData.conteudo}
              onChange={e => setFormData({ ...formData, conteudo: e.target.value })}
              className="mt-2 min-h-64 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Digite o conteúdo completo da notícia (pode usar HTML básico: <p>, <strong>, <em>, <ul>, <ol>, <li>, <a>, <h2>, <h3>)"
            />
            <p className="mt-2 text-xs text-gray-500">
              Dica: Use tags HTML básicas para formatar o texto: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a href=""&gt;
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-4 border-t border-gray-200 pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={e => handleSubmit(e, 'rascunho')}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {loading ? 'Salvando...' : 'Salvar Rascunho'}
            </Button>
            <Button
              type="submit"
              onClick={e => handleSubmit(e, 'publicado')}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Publicando...' : 'Publicar Notícia'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
