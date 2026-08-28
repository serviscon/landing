import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export type JWTPayload = {
  admin: boolean
  iat: number
  exp: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'seu-segredo-muito-longo-minimo-32-caracteres'
const TOKEN_EXPIRY = '7d' // Token válido por 7 dias

/**
 * Cria um token JWT para autenticação do painel
 */
export function createToken(admin: boolean = true): string {
  return jwt.sign({ admin }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  })
}

/**
 * Verifica e decodifica um token JWT
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Obtém o token do cookie
 */
export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value || null
}

/**
 * Verifica se o usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getTokenFromCookie()
  if (!token) return false
  return verifyToken(token) !== null
}

/**
 * Define o cookie de autenticação
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 dias
    path: '/',
  })
}

/**
 * Remove o cookie de autenticação
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}
