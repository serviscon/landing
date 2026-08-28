'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import type { Noticia } from '@/db'

interface FormData extends Omit<Noticia, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

const CATEGORIAS = [
  'Institucional',
  'Eventos',
  'Treinamentos',
  'Responsabilidade Social',
  'Tecnologia',
  'Operações',
  'Pessoas',
]

export default function EditarNoticiaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [formData, setFormData] = useState<FormData | null>(null)

  useEffect(() => {
    async function fetchNoticia() {
      try {
        const response = await fetch(`/api/noticias/${id}`)
        if (!response.ok) throw new Error('Notícia não encontrada')
        const data = await response.json()
        setFormData(data)
        if (data.imagemUrl) setPreview(data.imagemUrl)
      } catch (error) {
        alert('Erro ao carregar notícia')
        router.back()
      } finally {
        setLoading(false)
      }
    }

    fetchNoticia()
  }, [id])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem deve ter no máximo 5MB')
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Apenas JPEG, PNG e WebP são permitidos')
      return
    }

    setImageFile(file)

    const reader = new FileReader()
    reader.onload = e => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent, saveAs: 'rascunho' | 'publicado') {
    e.preventDefault()
    if (!formData) return

    setSaving(true)
    setErrors([])

    try {
      let imagemUrl = formData.imagemUrl

      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json()
          setErrors([error.error || 'Erro ao fazer upload da imagem'])
          setSaving(false)
          return
        }

        const uploadData = await uploadResponse.json()
        imagemUrl = uploadData.url
      }

      const response = await fetch(`/api/noticias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imagemUrl,
          status: saveAs,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setErrors(data.errors || [data.error || 'Erro ao atualizar notícia'])
        setSaving(false)
        return
      }

      alert(`Notícia atualizada como ${saveAs === 'publicado' ? 'publicada' : 'rascunho'}!`)
      router.push('/admin/noticias')
    } catch (error) {
      setErrors(['Erro ao atualizar notícia'])
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-800" />
          <p className="text-gray-600">Carregando notícia...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return <div>Notícia não encontrada</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="border-b border-blue-100 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-bold text-2xl text-gray-900">Editar Notícia</h1>
          <p className="text-gray-600">Atualize os dados da notícia</p>
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
          <div>
            <label className="block font-semibold text-gray-700 text-sm">
              TÍTULO *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={e => setFormData({ ...formData, titulo: e.target.value })}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 text-sm">
              RESUMO / SUBTÍTULO *
            </label>
            <textarea
              value={formData.resumo}
              onChange={e => setFormData({ ...formData, resumo: e.target.value })}
              className="mt-2 min-h-24 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block font-semibold text-gray-700 text-sm">
                CATEGORIA *
              </label>
              <select
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
              <label className="block font-semibold text-gray-700 text-sm">
                DATA *
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={e => setFormData({ ...formData, data: e.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 text-sm">
              IMAGEM DE CAPA
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-800 file:px-4 file:py-2 file:font-semibold file:text-white"
            />
            {preview && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-gray-600">Preview da imagem:</p>
                <Image
                  src={preview}
                  alt="Preview"
                  width={400}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-gray-700 text-sm">
              CONTEÚDÓ *
            </label>
            <textarea
              value={formData.conteudo}
              onChange={e => setFormData({ ...formData, conteudo: e.target.value })}
              className="mt-2 min-h-64 w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4 border-t border-gray-200 pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={e => handleSubmit(e, 'rascunho')}
              disabled={saving}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {saving ? 'Salvando...' : 'Salvar Rascunho'}
            </Button>
            <Button
              type="submit"
              onClick={e => handleSubmit(e, 'publicado')}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? 'Publicando...' : 'Publicar Notícia'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
