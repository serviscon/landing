import { NextRequest, NextResponse } from 'next/server'

const encoder = new TextEncoder()

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.JWT_SECRET
  if (!secret) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false

  try {
    const [header, payload, signature] = parts
    const parsedHeader = JSON.parse(new TextDecoder().decode(decodeBase64Url(header)))
    const parsedPayload = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)))

    if (parsedHeader.alg !== 'HS256' || parsedPayload.admin !== true) return false
    if (typeof parsedPayload.exp !== 'number' || parsedPayload.exp <= Date.now() / 1000) return false

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )

    return crypto.subtle.verify(
      'HMAC',
      key,
      decodeBase64Url(signature),
      encoder.encode(`${header}.${payload}`),
    )
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  // Rotas protegidas
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value

    if (!token || !(await verifyToken(token))) {
      // Redirecionar para login se não autenticado
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/((?!login).*)'],
}
