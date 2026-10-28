'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type NewsGalleryProps = {
  imagens: string[]
  titulo: string
}

export function NewsGallery({ imagens, titulo }: NewsGalleryProps) {
  const [aberta, setAberta] = useState<number | null>(null)

  if (imagens.length === 0) return null

  const [capa, ...demais] = imagens
  const total = imagens.length

  function navegar(direcao: 1 | -1) {
    setAberta(atual => (atual === null ? null : (atual + direcao + total) % total))
  }

  return (
    <div className="mb-12 max-w-4xl space-y-3">
      <button
        type="button"
        onClick={() => setAberta(0)}
        className="group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-xl bg-gray-100 shadow-md"
      >
        <Image
          src={capa}
          alt={titulo}
          fill
          priority
          sizes="(min-width: 896px) 896px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </button>

      {demais.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {demais.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setAberta(i + 1)}
              className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-lg bg-gray-100"
            >
              <Image
                src={url}
                alt={`${titulo} - foto ${i + 2}`}
                fill
                sizes="(min-width: 896px) 290px, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog.Root open={aberta !== null} onOpenChange={open => !open && setAberta(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90" />
          <Dialog.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none"
            onKeyDown={e => {
              if (e.key === 'ArrowRight') navegar(1)
              if (e.key === 'ArrowLeft') navegar(-1)
            }}
          >
            <Dialog.Title className="sr-only">{titulo}</Dialog.Title>
            <Dialog.Description className="sr-only">
              Foto {(aberta ?? 0) + 1} de {total}
            </Dialog.Description>

            {aberta !== null && (
              <div className="relative h-full max-h-[85vh] w-full max-w-5xl">
                <Image
                  src={imagens[aberta]}
                  alt={`${titulo} - foto ${aberta + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            )}

            <Dialog.Close
              aria-label="Fechar"
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X className="size-6" />
            </Dialog.Close>

            {total > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  onClick={() => navegar(-1)}
                  className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="size-7" />
                </button>
                <button
                  type="button"
                  aria-label="Próxima foto"
                  onClick={() => navegar(1)}
                  className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <ChevronRight className="size-7" />
                </button>
                <span className="absolute bottom-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                  {(aberta ?? 0) + 1} / {total}
                </span>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
