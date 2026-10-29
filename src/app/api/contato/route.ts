import { type NextRequest, NextResponse } from 'next/server'

/**
 * Solicitação de proposta (leads): cada envio vira uma linha na planilha do Google.
 * A gravação é feita pelo Apps Script da planilha (scripts/planilha-leads.gs),
 * publicado como app da Web. Variáveis: GOOGLE_SHEETS_WEBHOOK_URL e GOOGLE_SHEETS_WEBHOOK_SECRET.
 */

function texto(formData: FormData, campo: string, max = 200): string {
  const valor = formData.get(campo)
  return typeof valor === 'string' ? valor.trim().slice(0, max) : ''
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Campo invisível: só robôs preenchem
    if (texto(formData, 'site')) {
      return NextResponse.json({ ok: true }, { status: 201 })
    }

    const contato = {
      nome: texto(formData, 'nome'),
      email: texto(formData, 'email'),
      telefone: texto(formData, 'telefone', 40),
      empresa: texto(formData, 'empresa'),
      assunto: texto(formData, 'assunto'),
      mensagem: texto(formData, 'mensagem', 5000),
    }

    const errors: string[] = []
    if (!contato.nome) errors.push('Nome é obrigatório')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato.email)) errors.push('E-mail inválido')
    if (contato.telefone.replace(/\D/g, '').length < 10) errors.push('Telefone inválido')
    if (!contato.assunto) errors.push('Informe o serviço de interesse')
    if (!contato.mensagem) errors.push('Mensagem é obrigatória')
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET
    if (!url || !secret) {
      console.error('Fale conosco: GOOGLE_SHEETS_WEBHOOK_URL/SECRET não configurados')
      return NextResponse.json({ error: 'Formulário indisponível no momento. Fale conosco pelo WhatsApp.' }, { status: 503 })
    }

    const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' })
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, dataHora, ...contato }),
      redirect: 'follow',
    })
    const resultado = await response.json().catch(() => null)

    if (!response.ok || !resultado?.ok) {
      console.error('Fale conosco: erro ao gravar na planilha', response.status, resultado)
      return NextResponse.json({ error: 'Não foi possível enviar agora. Tente novamente em instantes.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('POST /api/contato error:', error)
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
