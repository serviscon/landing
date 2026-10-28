import { desc, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { candidaturasTable, database } from '@/db'
import { verifyToken } from '@/lib/auth'
import { escapeHtml, sendEmailToRh } from '@/lib/email'
import { saveFile } from '@/lib/storage'
import { CURRICULO_EXTENSOES, CURRICULO_MAX_BYTES, getVaga } from '@/lib/vagas'

function texto(formData: FormData, campo: string, max = 200): string {
  const valor = formData.get(campo)
  return typeof valor === 'string' ? valor.trim().slice(0, max) : ''
}

// POST - Enviar candidatura (público)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Campo invisível: só robôs preenchem
    if (texto(formData, 'site')) {
      return NextResponse.json({ ok: true }, { status: 201 })
    }

    const vaga = getVaga(texto(formData, 'area'))
    const nome = texto(formData, 'nome')
    const email = texto(formData, 'email')
    const telefone = texto(formData, 'telefone', 40)
    const cidade = texto(formData, 'cidade')
    const bairro = texto(formData, 'bairro')
    const observacoes = texto(formData, 'observacoes', 2000)
    const curriculo = formData.get('curriculo')

    const errors: string[] = []
    if (!vaga || !vaga.aberta) errors.push('Área inválida ou sem vagas abertas')
    if (!nome) errors.push('Nome é obrigatório')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('E-mail inválido')
    if (telefone.replace(/\D/g, '').length < 10) errors.push('Telefone inválido')
    if (!cidade) errors.push('Cidade é obrigatória')
    if (!bairro) errors.push('Bairro é obrigatório')

    if (!(curriculo instanceof File) || curriculo.size === 0) {
      errors.push('Envie seu currículo')
    } else {
      const extensao = curriculo.name.split('.').pop()?.toLowerCase() ?? ''
      if (!CURRICULO_EXTENSOES.includes(extensao)) errors.push('O currículo deve ser PDF, DOC ou DOCX')
      if (curriculo.size > CURRICULO_MAX_BYTES) errors.push('O currículo deve ter no máximo 4 MB')
    }

    if (errors.length > 0 || !vaga || !(curriculo instanceof File)) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Apenas os campos extras definidos para a área, com valores válidos
    const respostas: Record<string, string> = {}
    for (const campo of vaga.campos) {
      const valor = texto(formData, campo.id)
      if (valor && campo.opcoes.includes(valor)) respostas[campo.label] = valor
    }

    const curriculoUrl = await saveFile(curriculo, { folder: 'curriculos', unguessable: true })

    const [candidatura] = await database
      .insert(candidaturasTable)
      .values({
        area: vaga.id,
        nome,
        email,
        telefone,
        cidade,
        bairro,
        respostas,
        observacoes: observacoes || null,
        curriculoUrl,
        curriculoNome: curriculo.name.slice(0, 200),
      })
      .returning()

    // O aviso por e-mail não pode impedir a candidatura de ser registrada
    try {
      const painelUrl = new URL('/admin/candidaturas', request.nextUrl.origin).toString()
      const linhas = [
        ['Área', vaga.titulo],
        ['Nome', nome],
        ['E-mail', email],
        ['Telefone', telefone],
        ['Cidade', cidade],
        ['Bairro', bairro],
        ...Object.entries(respostas),
        ...(observacoes ? [['Observações', observacoes]] : []),
      ]
      await sendEmailToRh({
        subject: `Novo currículo: ${vaga.titulo} - ${nome}`,
        replyTo: email,
        html: `
          <h2 style="font-family:sans-serif;color:#1e3a8a">Novo currículo recebido pelo site</h2>
          <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
            ${linhas
              .map(
                ([label, valor]) =>
                  `<tr><td style="padding:4px 12px 4px 0;color:#555"><strong>${escapeHtml(label)}</strong></td><td style="padding:4px 0">${escapeHtml(valor)}</td></tr>`
              )
              .join('')}
          </table>
          <p style="font-family:sans-serif;font-size:14px">
            <a href="${escapeHtml(curriculoUrl)}">Baixar currículo</a> ·
            <a href="${escapeHtml(painelUrl)}">Ver todas as candidaturas no painel</a>
          </p>`,
      })
    } catch (error) {
      console.error('Erro ao enviar aviso de candidatura:', error)
    }

    return NextResponse.json({ ok: true, id: candidatura.id }, { status: 201 })
  } catch (error) {
    console.error('POST /api/candidaturas error:', error)
    return NextResponse.json({ error: 'Erro ao enviar candidatura' }, { status: 500 })
  }
}

// GET - Listar candidaturas (apenas admin)
export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const area = request.nextUrl.searchParams.get('area')
    const candidaturas = await database
      .select()
      .from(candidaturasTable)
      .where(area ? eq(candidaturasTable.area, area) : undefined)
      .orderBy(desc(candidaturasTable.createdAt))
      .all()

    return NextResponse.json(candidaturas, { status: 200 })
  } catch (error) {
    console.error('GET /api/candidaturas error:', error)
    return NextResponse.json({ error: 'Erro ao listar candidaturas' }, { status: 500 })
  }
}
