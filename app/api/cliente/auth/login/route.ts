import { NextRequest, NextResponse } from 'next/server'
import { verifyClienteCredentials, createClienteSession, createVerificationCode } from '@/lib/auth/cliente-auth'
import { getEmailConfig } from '@/lib/email/config'
import { importEmailService } from '@/lib/email/dynamic-import'

/**
 * POST /api/cliente/auth/login
 * Login de cliente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, senha } = body

    if (!email || !senha) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar credenciais
    const result = await verifyClienteCredentials(email, senha)

    if (!result.success || !result.usuario) {
      return NextResponse.json(
        { error: result.error || 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Se email não verificado, enviar código novamente
    if (!result.usuario.email_verificado) {
      const codigo = await createVerificationCode(email)

      try {
        const emailConfig = await getEmailConfig()
        
        if (emailConfig && emailConfig.ativo) {
          const emailService = await importEmailService(
            emailConfig.provider as 'socketlabs' | 'resend' | 'sendgrid' | 'nodemailer'
          )

          const serviceConfig: any = {}
          if (emailConfig.provider === 'socketlabs') {
            serviceConfig.serverId = emailConfig.server_id
            serviceConfig.apiKey = emailConfig.api_key
          } else {
            serviceConfig.apiKey = emailConfig.api_key
          }

          await emailService.sendEmail({
            to: email,
            from: emailConfig.from_email || 'noreply@mudatech.com.br',
            subject: 'Código de verificação - MudaTech',
            html: `
              <h2>Verifique seu email</h2>
              <p>Seu código de verificação é: <strong>${codigo}</strong></p>
              <p>Este código expira em 15 minutos.</p>
            `,
          }, serviceConfig)
        }
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError)
      }

      return NextResponse.json(
        {
          error: 'Email não verificado',
          requiresVerification: true,
          message: 'Um novo código de verificação foi enviado para seu email.',
        },
        { status: 403 }
      )
    }

    // Criar sessão
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    const token = await createClienteSession(result.usuario.id, ipAddress, userAgent)

    // Criar cookie
    const response = NextResponse.json({
      success: true,
      usuario: {
        id: result.usuario.id,
        email: result.usuario.email,
        empresa_id: result.usuario.empresa_id,
        nome: result.usuario.nome,
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
    console.error('Erro ao fazer login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

