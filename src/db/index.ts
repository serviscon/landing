import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

// Em produção usa o Turso (TURSO_DATABASE_URL + TURSO_AUTH_TOKEN).
// Sem essas variáveis, cai num arquivo SQLite local para desenvolvimento.
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data/noticias.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const database = drizzle(client, { schema })
export * from './schema'
