import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { Foto } from '@/lib/fotos'

export const noticiasTable = sqliteTable('noticias', {
  id: integer().primaryKey({ autoIncrement: true }),
  titulo: text().notNull(),
  resumo: text().notNull(),
  categoria: text().notNull(), // Institucional, Eventos, Treinamentos, etc
  data: text().notNull(), // ISO string: YYYY-MM-DD
  imagemUrl: text(), // Imagem de capa (sempre a primeira de `imagens`)
  imagens: text({ mode: 'json' }).$type<Foto[] | string[]>(), // Até 4 fotos (url + enquadramento); a primeira é a capa
  conteudo: text().notNull(), // HTML ou texto simples
  slug: text().notNull().unique(),
  status: text('status').default('rascunho').notNull(), // 'rascunho' ou 'publicado'
  deletedAt: text(), // Soft delete: ISO string ou null
  createdAt: text()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type Noticia = typeof noticiasTable.$inferSelect
export type NoticiaInsert = typeof noticiasTable.$inferInsert
