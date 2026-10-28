import nodemailer from 'nodemailer'

/**
 * Envio de e-mail por SMTP, por padrão com uma conta Gmail comum (não depende do domínio da empresa).
 * Variáveis: SMTP_USER (a conta), SMTP_PASS (senha de app da conta) e RH_EMAIL (destino).
 * Opcionais para outro provedor: SMTP_HOST e SMTP_PORT (padrão: smtp.gmail.com, 465).
 * Sem SMTP_USER, SMTP_PASS ou RH_EMAIL, o envio é ignorado.
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
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const to = process.env.RH_EMAIL
  if (!user || !pass || !to) return false

  const port = Number(process.env.SMTP_PORT || 465)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    // Senhas de app do Google são exibidas com espaços ("abcd efgh ijkl mnop")
    auth: { user, pass: pass.replace(/\s+/g, '') },
  })

  // O Gmail só envia com o próprio endereço da conta como remetente
  await transporter.sendMail({
    from: { name: 'Serviscon Vagas', address: user },
    to: to.split(',').map(email => email.trim()),
    subject,
    html,
    replyTo,
  })
  return true
}
