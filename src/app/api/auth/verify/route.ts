import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { authenticated: true, admin: payload.admin },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: 'Erro ao verificar autenticação' },
      { status: 500 }
    )
  }
}
