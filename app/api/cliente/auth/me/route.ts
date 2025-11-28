import { NextRequest, NextResponse } from 'next/server'
import { validateClienteSession } from '@/lib/auth/cliente-auth'

/**
 * GET /api/cliente/auth/me
 * Obter dados do usuário logado
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('cliente_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const usuario = await validateClienteSession(token)

    if (!usuario) {
      return NextResponse.json(
        { error: 'Sessão inválida ou expirada' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      usuario: {
        id: usuario.id,
        email: usuario.email,
        empresa_id: usuario.empresa_id,
        nome: usuario.nome,
        telefone: usuario.telefone,
        email_verificado: usuario.email_verificado,
      },
    })
  } catch (error: any) {
    console.error('Erro ao obter dados do usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

