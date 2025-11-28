import { NextRequest, NextResponse } from 'next/server'
import { deleteClienteSession } from '@/lib/auth/cliente-auth'

/**
 * POST /api/cliente/auth/logout
 * Logout do cliente
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('cliente_token')?.value

    if (token) {
      await deleteClienteSession(token)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete('cliente_token')

    return response
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

