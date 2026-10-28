import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { validateImageFile } from '@/lib/validators'
import { saveFile } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Validar arquivo
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const publicUrl = await saveFile(file, { folder: 'noticias' })

    return NextResponse.json(
      { url: publicUrl, message: 'Imagem enviada com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    )
  }
}
