import { del } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { candidaturasTable, database } from '@/db'
import { verifyToken } from '@/lib/auth'

function isAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  return Boolean(token && verifyToken(token))
}

// PATCH - Alterar status (apenas admin)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { status } = await request.json()
    if (status !== 'novo' && status !== 'analisado') {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const result = await database
      .update(candidaturasTable)
      .set({ status })
      .where(eq(candidaturasTable.id, Number(id)))
      .returning()

    if (result.length === 0) {
      return NextResponse.json({ error: 'Candidatura não encontrada' }, { status: 404 })
    }
    return NextResponse.json(result[0], { status: 200 })
  } catch (error) {
    console.error('PATCH /api/candidaturas/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar candidatura' }, { status: 500 })
  }
}

// DELETE - Excluir candidatura e o arquivo do currículo (dados pessoais: exclusão definitiva, apenas admin)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const { id } = await params
    const result = await database
      .delete(candidaturasTable)
      .where(eq(candidaturasTable.id, Number(id)))
      .returning()

    if (result.length === 0) {
      return NextResponse.json({ error: 'Candidatura não encontrada' }, { status: 404 })
    }

    const { curriculoUrl } = result[0]
    if (process.env.BLOB_READ_WRITE_TOKEN && curriculoUrl.startsWith('https://')) {
      await del(curriculoUrl).catch(error => console.error('Erro ao apagar currículo do Blob:', error))
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/candidaturas/[id] error:', error)
    return NextResponse.json({ error: 'Erro ao excluir candidatura' }, { status: 500 })
  }
}
