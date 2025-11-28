import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para proteger rotas admin
 * Verifica autenticação e redireciona para login se necessário
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso à página de login sem autenticação
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Proteger todas as rotas /admin/* (exceto login e API)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/api')) {
    // Verificar bypass de desenvolvimento
    const isDevBypass = process.env.NODE_ENV === 'development' && 
                       process.env.ADMIN_BYPASS_AUTH === 'true'
    
    if (isDevBypass) {
      return NextResponse.next()
    }

    // Verificar token na cookie
    // Nota: O token também é armazenado no localStorage no cliente,
    // mas o middleware só pode verificar cookies
    const token = request.cookies.get('admin_session')?.value

    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // A validação completa do token será feita no layout do admin
  }

  // Permitir acesso à página de login do painel sem autenticação
  if (pathname === '/painel/login') {
    return NextResponse.next()
  }

  // Proteger todas as rotas /painel/* (exceto login e API)
  if (pathname.startsWith('/painel') && !pathname.startsWith('/painel/api') && !pathname.startsWith('/painel/manifest.json') && !pathname.startsWith('/painel/sw.js')) {
    // Verificar token na cookie
    const token = request.cookies.get('cliente_token')?.value

    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/painel/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // A validação completa do token será feita no layout do painel
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/painel/:path*',
  ],
}

