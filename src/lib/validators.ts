/**
 * Valida os campos obrigatórios de uma notícia
 */
export function validateNoticiaFields(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.titulo?.trim()) {
    errors.push('Título é obrigatório')
  }

  if (!data.resumo?.trim()) {
    errors.push('Resumo é obrigatório')
  }

  if (!data.categoria?.trim()) {
    errors.push('Categoria é obrigatória')
  }

  if (!data.conteudo?.trim()) {
    errors.push('Conteúdo é obrigatório')
  }

  if (!data.data?.trim()) {
    errors.push('Data é obrigatória')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export const MAX_IMAGENS = 4

/**
 * Normaliza a lista de fotos recebida do painel (até 4 URLs).
 * Notícias antigas só têm `imagemUrl`, que vira uma lista de um item.
 */
export function normalizeImagens(data: { imagens?: unknown; imagemUrl?: unknown }): string[] {
  const imagens = Array.isArray(data.imagens)
    ? data.imagens.filter((url): url is string => typeof url === 'string' && url.trim() !== '')
    : typeof data.imagemUrl === 'string' && data.imagemUrl
      ? [data.imagemUrl]
      : []

  return imagens.slice(0, MAX_IMAGENS)
}

/**
 * Valida o arquivo de imagem
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Imagem deve ter no máximo 5MB' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Apenas JPEG, PNG e WebP são permitidos' }
  }

  return { valid: true }
}

/**
 * Categorias padrão do sistema
 */
export const CATEGORIAS = [
  'Institucional',
  'Eventos',
  'Treinamentos',
  'Responsabilidade Social',
  'Tecnologia',
  'Operações',
  'Pessoas',
]
