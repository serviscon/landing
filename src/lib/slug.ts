/**
 * Gera um slug a partir de um título
 * @param titulo - O título da notícia
 * @returns slug formatado
 */
export function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim()
    .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
}

/**
 * Gera um slug único adicionando um sufixo numérico se necessário
 * @param baseSlug - O slug base
 * @param existingSlugs - Array de slugs já existentes
 * @returns slug único
 */
export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }

  let counter = 1
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++
  }

  return `${baseSlug}-${counter}`
}
