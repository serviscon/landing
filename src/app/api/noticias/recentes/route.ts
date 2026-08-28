import { NextRequest, NextResponse } from 'next/server'
import { database, noticiasTable } from '@/db'
import { desc, eq, isNull } from 'drizzle-orm'

// GET - Obter 3 notícias mais recentes (apenas publicadas)
export async function GET(request: NextRequest) {
  try {
    const noticias = await database
      .select()
      .from(noticiasTable)
      .where(eq(noticiasTable.status, 'publicado') && isNull(noticiasTable.deletedAt))
      .orderBy(desc(noticiasTable.data))
      .limit(3)
      .all()

    return NextResponse.json(noticias, { status: 200 })
  } catch (error) {
    console.error('GET /api/noticias/recentes error:', error)
    return NextResponse.json(
      { error: 'Erro ao listar notícias recentes' },
      { status: 500 }
    )
  }
}
