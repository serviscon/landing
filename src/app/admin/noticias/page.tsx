'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, Eye } from 'lucide-react'
import type { Noticia } from '@/db'

export default function AdminNoticiasPage() {
  const router = useRouter()
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchNoticias()
  }, [])

  async function fetchNoticias() {
    try {
      const response = await fetch('/api/noticias')
      const data = await response.json()
      setNoticias(data)
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/noticias/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNoticias(noticias.filter(n => n.id !== id))
      } else {
        alert('Erro ao excluir notícia')
      }
    } catch (error) {
      alert('Erro ao excluir notícia')
    } finally {
      setDeleting(null)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <div>
            <h1 className="font-bold text-2xl text-gray-900">Notícias Publicadas</h1>
            <p className="text-gray-600">Gerencie todas as notícias da Serviscon</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/noticias/nova">
              <Button className="bg-blue-800 text-white hover:bg-blue-900">
                + Nova Notícia
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : noticias.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="mb-4 text-gray-600">Nenhuma notícia criada ainda.</p>
            <Link href="/admin/noticias/nova">
              <Button className="bg-blue-800 text-white hover:bg-blue-900">
                Criar primeira notícia
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Título</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Data</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {noticias.map(noticia => {
                  const formattedDate = new Date(noticia.data).toLocaleDateString('pt-BR')
                  return (
                    <tr key={noticia.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{noticia.titulo}</div>
                        <div className="text-sm text-gray-500">{noticia.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-blue-100 text-blue-800">{noticia.categoria}</Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{formattedDate}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={noticia.status === 'publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {noticia.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {noticia.status === 'publicado' && (
                            <Link href={`/noticias/${noticia.slug}`}>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/admin/noticias/${noticia.id}/editar`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(noticia.id)}
                            disabled={deleting === noticia.id}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
