/**
 * Envio de e-mail pelo Resend (https://resend.com), sem SDK.
 * Variáveis: RESEND_API_KEY, RH_EMAIL (destino) e EMAIL_FROM (remetente de um domínio verificado no Resend).
 * Sem RESEND_API_KEY ou RH_EMAIL, o envio é ignorado.
 */

type EmailInput = {
  subject: string
  html: string
  replyTo?: string
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendEmailToRh({ subject, html, replyTo }: EmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.RH_EMAIL
  if (!apiKey || !to) return false

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'Serviscon <onboarding@resend.dev>',
      to: to.split(',').map(email => email.trim()),
      subject,
      html,
      reply_to: replyTo,
    }),
  })

  if (!response.ok) {
    console.error('Erro ao enviar e-mail:', response.status, await response.text())
    return false
  }
  return true
}
