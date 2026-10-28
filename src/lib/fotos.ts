export const MAX_IMAGENS = 4

/**
 * Foto de uma notícia. `x` e `y` (0–100) definem o enquadramento quando a foto
 * é cortada para caber num formato (equivale ao CSS object-position).
 */
export type Foto = { url: string; x: number; y: number }

const CENTRO = 50

function clampPercent(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return CENTRO
  return Math.min(100, Math.max(0, Math.round(n)))
}

/**
 * Normaliza a lista de fotos recebida do painel ou lida do banco (até 4).
 * Aceita o formato antigo (lista de URLs) e notícias que só têm `imagemUrl`.
 */
export function normalizeFotos(data: { imagens?: unknown; imagemUrl?: unknown }): Foto[] {
  const brutas: unknown[] = Array.isArray(data.imagens)
    ? data.imagens
    : typeof data.imagemUrl === 'string' && data.imagemUrl
      ? [data.imagemUrl]
      : []

  const fotos: Foto[] = []
  for (const item of brutas) {
    if (typeof item === 'string' && item.trim()) {
      fotos.push({ url: item, x: CENTRO, y: CENTRO })
    } else if (item && typeof item === 'object' && typeof (item as Foto).url === 'string' && (item as Foto).url.trim()) {
      const foto = item as Foto
      fotos.push({ url: foto.url, x: clampPercent(foto.x), y: clampPercent(foto.y) })
    }
  }

  return fotos.slice(0, MAX_IMAGENS)
}

/** Valor para `style.objectPosition` de uma foto */
export function objectPosition(foto: Pick<Foto, 'x' | 'y'>): string {
  return `${foto.x}% ${foto.y}%`
}
