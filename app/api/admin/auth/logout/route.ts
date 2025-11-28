import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth/admin-auth'

/**
 * POST /api/admin/auth/logout
 * Remove sessão do admin
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      )
    }
    
    await deleteSession(token)
    
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    })
    
    // Remover cookie
    response.cookies.delete('admin_session')
    
    return response
  } catch (error: any) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

