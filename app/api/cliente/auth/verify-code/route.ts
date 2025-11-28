import { NextRequest, NextResponse } from 'next/server'
import { verifyCode, createClienteSession } from '@/lib/auth/cliente-auth'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * POST /api/cliente/auth/verify-code
 * Verificar código de email e criar sessão
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email e código são obrigatórios' },
        { status: 400 }
      )
    }

    const isValid = await verifyCode(email, code)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Código inválido ou expirado' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const supabase = createAdminClient()
    const { data: usuario } = await supabase
      .from('usuarios_clientes')
      .select('id, email, empresa_id, nome')
      .eq('email', email.toLowerCase())
      .single()

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Criar sessão
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    const token = await createClienteSession(usuario.id, ipAddress, userAgent)

    const response = NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        empresa_id: usuario.empresa_id,
        nome: usuario.nome,
      },
    })

    response.cookies.set('cliente_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Erro ao verificar código:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

