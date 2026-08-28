import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { validateImageFile } from '@/lib/validators'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

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

    // Converter arquivo para buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Gerar nome único para o arquivo
    const timestamp = new Date().toISOString().split('T')[0]
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}-${randomSuffix}.${fileExtension}`

    // Caminho do arquivo
    const uploadDir = path.join(process.cwd(), 'public', 'noticias')
    const filePath = path.join(uploadDir, fileName)

    // Criar diretório se não existir
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Salvar arquivo
    await writeFile(filePath, buffer)

    // Retornar URL pública
    const publicUrl = `/noticias/${fileName}`

    return NextResponse.json(
      { url: publicUrl, fileName, message: 'Imagem enviada com sucesso' },
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
