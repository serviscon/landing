import { NextRequest, NextResponse } from 'next/server'
import { database, noticiasTable } from '@/db'
import { verifyToken } from '@/lib/auth'
import { validateNoticiaFields } from '@/lib/validators'
import { eq, isNull } from 'drizzle-orm'

// GET - Obter notícia por ID ou slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.cookies.get('admin_token')?.value
    const isAdmin = token && verifyToken(token)

    const noticia = await database
      .select()
      .from(noticiasTable)
      .where(
        isAdmin
          ? eq(noticiasTable.id, parseInt(id)) || eq(noticiasTable.slug, id)
          : (eq(noticiasTable.id, parseInt(id)) || eq(noticiasTable.slug, id)) &&
            eq(noticiasTable.status, 'publicado') &&
            isNull(noticiasTable.deletedAt)
      )
      .limit(1)
      .then(results => results[0])

    if (!noticia) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(noticia, { status: 200 })
  } catch (error) {
    console.error('GET /api/noticias/[id] error:', error)
    return NextResponse.json(
      { error: 'Erro ao obter notícia' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar notícia (apenas admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const data = await request.json()

    // Validar campos obrigatórios
    const validation = validateNoticiaFields(data)
    if (!validation.valid) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 }
      )
    }

    // Atualizar notícia
    const result = await database
      .update(noticiasTable)
      .set({
        titulo: data.titulo,
        resumo: data.resumo,
        categoria: data.categoria,
        data: data.data,
        imagemUrl: data.imagemUrl || null,
        conteudo: data.conteudo,
        status: data.status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(noticiasTable.id, parseInt(id)))
      .returning()

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0], { status: 200 })
  } catch (error) {
    console.error('PUT /api/noticias/[id] error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar notícia' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar notícia (soft delete, apenas admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Soft delete
    const result = await database
      .update(noticiasTable)
      .set({
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(noticiasTable.id, parseInt(id)))
      .returning()

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Notícia deletada com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('DELETE /api/noticias/[id] error:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar notícia' },
      { status: 500 }
    )
  }
}
