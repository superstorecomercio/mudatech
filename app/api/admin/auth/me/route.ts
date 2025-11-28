import { NextRequest, NextResponse } from 'next/server'
import { validateSession, isDevBypassEnabled } from '@/lib/auth/admin-auth'

/**
 * GET /api/admin/auth/me
 * Retorna dados do admin logado
 */
export async function GET(request: NextRequest) {
  try {
    // Bypass para desenvolvimento
    if (isDevBypassEnabled()) {
      return NextResponse.json({
        success: true,
        admin: {
          id: 'dev-bypass',
          email: 'dev@mudatech.com.br',
          nome: 'Dev Admin (Bypass)',
          primeiro_login: false,
          ativo: true
        },
        bypass: true
      })
    }
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('admin_session')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }
    
    // Obter informações do dispositivo para validação
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    const session = await validateSession(token, ipAddress, userAgent)
    
    if (!session.success || !session.admin) {
      return NextResponse.json(
        { error: session.error || 'Sessão inválida' },
        { status: 401 }
      )
    }
    
    // Se o dispositivo mudou, retornar flag para forçar nova verificação
    if (session.deviceChanged) {
      return NextResponse.json({
        success: true,
        admin: session.admin,
        deviceChanged: true,
        message: 'Dispositivo diferente detectado. Nova verificação necessária.'
      })
    }
    
    return NextResponse.json({
      success: true,
      admin: session.admin
    })
  } catch (error: any) {
    console.error('Erro ao buscar dados do admin:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

