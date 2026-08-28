import { NextRequest, NextResponse } from 'next/server'
import { database, noticiasTable } from '@/db'
import { verifyToken } from '@/lib/auth'
import { validateNoticiaFields } from '@/lib/validators'
import { generateSlug, ensureUniqueSlug } from '@/lib/slug'
import { desc, eq, isNull } from 'drizzle-orm'

// GET - Listar notícias públicas (apenas publicadas)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const isAdmin = request.cookies.get('admin_token')?.value

    // Usuários públicos veem apenas notícias publicadas
    // Admins podem ver todas (rascunho e publicado)
    const query = isAdmin
      ? database
          .select()
          .from(noticiasTable)
          .where(isNull(noticiasTable.deletedAt))
          .orderBy(desc(noticiasTable.data))
      : database
          .select()
          .from(noticiasTable)
          .where(
            isAdmin
              ? isNull(noticiasTable.deletedAt)
              : eq(noticiasTable.status, 'publicado') && isNull(noticiasTable.deletedAt)
          )
          .orderBy(desc(noticiasTable.data))

    const noticias = await query.all()

    return NextResponse.json(noticias, { status: 200 })
  } catch (error) {
    console.error('GET /api/noticias error:', error)
    return NextResponse.json(
      { error: 'Erro ao listar notícias' },
      { status: 500 }
    )
  }
}

// POST - Criar notícia (apenas admin)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validar campos obrigatórios
    const validation = validateNoticiaFields(data)
    if (!validation.valid) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 }
      )
    }

    // Gerar slug único
    const baseSlug = generateSlug(data.titulo)
    const allSlugs = (await database.select({ slug: noticiasTable.slug }).from(noticiasTable).all()).map(n => n.slug)
    const uniqueSlug = ensureUniqueSlug(baseSlug, allSlugs)

    // Inserir notícia
    const result = await database
      .insert(noticiasTable)
      .values({
        titulo: data.titulo,
        resumo: data.resumo,
        categoria: data.categoria,
        data: data.data,
        imagemUrl: data.imagemUrl || null,
        conteudo: data.conteudo,
        slug: uniqueSlug,
        status: data.status || 'rascunho',
      })
      .returning()

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('POST /api/noticias error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar notícia' },
      { status: 500 }
    )
  }
}
