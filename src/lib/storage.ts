import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { put } from '@vercel/blob'

type SaveFileOptions = {
  // Pasta dentro do Blob (produção) ou de public/ (desenvolvimento)
  folder: string
  // Acrescenta um sufixo aleatório longo ao nome, deixando o link impossível de adivinhar
  unguessable?: boolean
}

/**
 * Salva um arquivo enviado e devolve a URL pública.
 * Produção: Vercel Blob (o disco da Vercel não é persistente).
 * Desenvolvimento (sem BLOB_READ_WRITE_TOKEN): public/<folder>.
 */
export async function saveFile(file: File, { folder, unguessable = false }: SaveFileOptions): Promise<string> {
  const timestamp = new Date().toISOString().split('T')[0]
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const fileName = `${timestamp}-${randomSuffix}.${fileExtension}`

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${fileName}`, file, {
      access: 'public',
      contentType: file.type || undefined,
      addRandomSuffix: unguessable,
    })
    return blob.url
  }

  const uploadDir = path.join(process.cwd(), 'public', folder)
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()))
  return `/${folder}/${fileName}`
}
