import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path'
import * as schema from './schema'

let db: BetterSQLite3Database<typeof schema>

function getDb() {
  if (!db) {
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path.join(process.cwd(), 'data', 'noticias.db')
    
    // Criar diretório se não existir
    const dir = path.dirname(dbPath)
    const fs = require('fs')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const sqlite = new Database(dbPath)
    db = drizzle(sqlite, { schema })
  }
  return db
}

export const database = getDb()
export * from './schema'
