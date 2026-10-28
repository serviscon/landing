'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Crop, ImagePlus, Move, Star, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { type Foto, MAX_IMAGENS, normalizeFotos, objectPosition } from '@/lib/fotos'

// Foto já enviada (url) ou recém-selecionada no computador (file + preview local)
export type ImageItem = Foto & { file?: File }

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

export function imagesFromNoticia(noticia: { imagens?: unknown; imagemUrl?: string | null }): ImageItem[] {
  return normalizeFotos(noticia)
}

/**
 * Envia para /api/upload as fotos novas e devolve a lista final, na ordem, com o enquadramento
 */
export async function uploadImages(items: ImageItem[]): Promise<Foto[]> {
  return Promise.all(
    items.map(async ({ file, ...foto }) => {
      if (!file) return foto

      const body = new FormData()
      body.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erro ao fazer upload da imagem')
      return { ...foto, url: data.url as string }
    })
  )
}

type ImagesFieldProps = {
  value: ImageItem[]
  onChange: (items: ImageItem[]) => void
  disabled?: boolean
}

export function ImagesField({ value, onChange, disabled }: ImagesFieldProps) {
  const [ajustando, setAjustando] = useState<number | null>(null)
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
      valid.push({ url: URL.createObjectURL(file), file, x: 50, y: 50 })
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

  function updatePosition(index: number, x: number, y: number) {
    onChange(value.map((item, i) => (i === index ? { ...item, x, y } : item)))
  }

  return (
    <div>
      <p className="block font-semibold text-gray-700 text-sm">
        FOTOS ({value.length}/{MAX_IMAGENS})
      </p>
      <p className="mt-1 text-gray-500 text-xs">
        A primeira foto é a capa, exibida na página inicial e na lista de notícias. Use “Ajustar” para escolher qual
        parte da foto aparece quando ela é cortada. JPEG, PNG ou WebP, até 5MB cada.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((item, index) => (
          <div key={item.url} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {/* biome-ignore lint/performance/noImgElement: preview local (blob:) não passa pelo next/image */}
            <img
              src={item.url}
              alt={`Foto ${index + 1}`}
              className="h-full w-full object-cover"
              style={{ objectPosition: objectPosition(item) }}
            />

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

            <button
              type="button"
              onClick={() => setAjustando(index)}
              disabled={disabled}
              className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded bg-white/90 px-2 py-0.5 font-semibold text-gray-800 text-xs shadow hover:bg-white"
            >
              <Crop className="size-3" />
              Ajustar
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

      {ajustando !== null && value[ajustando] && (
        <AjusteFotoDialog
          foto={value[ajustando]}
          onClose={() => setAjustando(null)}
          onSave={(x, y) => {
            updatePosition(ajustando, x, y)
            setAjustando(null)
          }}
        />
      )}
    </div>
  )
}

type AjusteFotoDialogProps = {
  foto: ImageItem
  onClose: () => void
  onSave: (x: number, y: number) => void
}

// Formatos em que a foto aparece cortada no site
const PREVIAS = [
  { label: 'Destaque na página inicial', className: 'aspect-[15/8]' },
  { label: 'Lista de notícias', className: 'aspect-[2/1]' },
  { label: 'Miniatura', className: 'aspect-square' },
]

function AjusteFotoDialog({ foto, onClose, onSave }: AjusteFotoDialogProps) {
  const [pos, setPos] = useState({ x: foto.x, y: foto.y })
  const frameRef = useRef<HTMLDivElement>(null)
  const naturalSize = useRef<{ w: number; h: number } | null>(null)
  const drag = useRef<{ startX: number; startY: number; x: number; y: number } | null>(null)

  // Quanto da foto "sobra" fora da moldura em cada eixo (object-fit: cover)
  function overflow() {
    const frame = frameRef.current?.getBoundingClientRect()
    const natural = naturalSize.current
    if (!frame || !natural) return { x: 0, y: 0 }
    const scale = Math.max(frame.width / natural.w, frame.height / natural.h)
    return { x: natural.w * scale - frame.width, y: natural.h * scale - frame.height }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { startX: e.clientX, startY: e.clientY, ...pos }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return
    const sobra = overflow()
    const clamp = (n: number) => Math.min(100, Math.max(0, n))
    // Arrastar a foto para a direita mostra mais do lado esquerdo (posição diminui)
    setPos({
      x: sobra.x > 0 ? clamp(drag.current.x - ((e.clientX - drag.current.startX) / sobra.x) * 100) : 50,
      y: sobra.y > 0 ? clamp(drag.current.y - ((e.clientY - drag.current.startY) / sobra.y) * 100) : 50,
    })
  }

  function onPointerUp() {
    drag.current = null
  }

  const position = objectPosition(pos)

  return (
    <Dialog.Root open onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 max-h-[95vh] w-[min(56rem,calc(100vw-2rem))] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="font-bold text-gray-900 text-lg">Ajustar enquadramento</Dialog.Title>
          <Dialog.Description className="mt-1 text-gray-600 text-sm">
            Arraste a foto para escolher a parte que deve aparecer. As prévias mostram como ela fica em cada lugar do
            site.
          </Dialog.Description>

          <div
            ref={frameRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative mt-4 aspect-[16/9] w-full cursor-grab touch-none select-none overflow-hidden rounded-lg bg-gray-100 active:cursor-grabbing"
          >
            {/* biome-ignore lint/performance/noImgElement: precisa do tamanho natural e funciona com preview blob: */}
            <img
              src={foto.url}
              alt="Foto sendo ajustada"
              draggable={false}
              onLoad={e => {
                naturalSize.current = { w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight }
              }}
              className="pointer-events-none h-full w-full object-cover"
              style={{ objectPosition: position }}
            />
            <span className="pointer-events-none absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-white text-xs">
              <Move className="size-3.5" />
              Arraste para mover
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {PREVIAS.map(previa => (
              <div key={previa.label}>
                <div className={`${previa.className} overflow-hidden rounded-md bg-gray-100`}>
                  {/* biome-ignore lint/performance/noImgElement: prévia local */}
                  <img src={foto.url} alt="" className="h-full w-full object-cover" style={{ objectPosition: position }} />
                </div>
                <p className="mt-1 text-center text-gray-500 text-xs">{previa.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setPos({ x: 50, y: 50 })}>
              Centralizar
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => onSave(Math.round(pos.x), Math.round(pos.y))}
              className="bg-blue-800 text-white hover:bg-blue-900"
            >
              Salvar ajuste
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
