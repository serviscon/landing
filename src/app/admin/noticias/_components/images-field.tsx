'use client'

import { ImagePlus, Star, X } from 'lucide-react'
import { MAX_IMAGENS } from '@/lib/validators'

// Foto já enviada (url) ou recém-selecionada no computador (file + preview local)
export type ImageItem = { url: string; file?: File }

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

export function imagesFromNoticia(noticia: { imagens?: string[] | null; imagemUrl?: string | null }): ImageItem[] {
  const urls = noticia.imagens?.length ? noticia.imagens : noticia.imagemUrl ? [noticia.imagemUrl] : []
  return urls.map(url => ({ url }))
}

/**
 * Envia para /api/upload as fotos novas e devolve a lista final de URLs, na ordem
 */
export async function uploadImages(items: ImageItem[]): Promise<string[]> {
  return Promise.all(
    items.map(async item => {
      if (!item.file) return item.url

      const body = new FormData()
      body.append('file', item.file)
      const response = await fetch('/api/upload', { method: 'POST', body })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erro ao fazer upload da imagem')
      return data.url as string
    })
  )
}

type ImagesFieldProps = {
  value: ImageItem[]
  onChange: (items: ImageItem[]) => void
  disabled?: boolean
}

export function ImagesField({ value, onChange, disabled }: ImagesFieldProps) {
  const remaining = MAX_IMAGENS - value.length

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''

    const valid: ImageItem[] = []
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`${file.name}: apenas JPEG, PNG e WebP são permitidos`)
        continue
      }
      if (file.size > MAX_SIZE) {
        alert(`${file.name}: a imagem deve ter no máximo 5MB`)
        continue
      }
      valid.push({ url: URL.createObjectURL(file), file })
    }

    if (valid.length > remaining) {
      alert(`Máximo de ${MAX_IMAGENS} fotos por notícia. Apenas as primeiras ${remaining} foram adicionadas.`)
    }

    onChange([...value, ...valid.slice(0, remaining)])
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function makeCover(index: number) {
    onChange([value[index], ...value.filter((_, i) => i !== index)])
  }

  return (
    <div>
      <p className="block font-semibold text-gray-700 text-sm">
        FOTOS ({value.length}/{MAX_IMAGENS})
      </p>
      <p className="mt-1 text-gray-500 text-xs">
        A primeira foto é a capa, exibida na página inicial e na lista de notícias. JPEG, PNG ou WebP, até 5MB cada.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((item, index) => (
          <div key={item.url} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {/* biome-ignore lint/performance/noImgElement: preview local (blob:) não passa pelo next/image */}
            <img src={item.url} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />

            {index === 0 ? (
              <span className="absolute top-2 left-2 rounded bg-blue-800 px-2 py-0.5 font-semibold text-white text-xs">
                Capa
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(index)}
                disabled={disabled}
                className="absolute top-2 left-2 inline-flex items-center gap-1 rounded bg-white/90 px-2 py-0.5 font-semibold text-gray-800 text-xs shadow hover:bg-white"
              >
                <Star className="size-3" />
                Usar como capa
              </button>
            )}

            <button
              type="button"
              onClick={() => remove(index)}
              disabled={disabled}
              aria-label={`Remover foto ${index + 1}`}
              className="absolute top-2 right-2 rounded-full bg-white/90 p-1 text-gray-700 shadow hover:bg-red-50 hover:text-red-700"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        {remaining > 0 && (
          <label
            className={`flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-gray-300 border-dashed text-gray-500 text-sm transition-colors hover:border-blue-500 hover:text-blue-700 ${disabled ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ImagePlus className="size-6" />
            Adicionar foto
            <input
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              multiple
              onChange={handleSelect}
              disabled={disabled}
              className="sr-only"
            />
          </label>
        )}
      </div>
    </div>
  )
}
