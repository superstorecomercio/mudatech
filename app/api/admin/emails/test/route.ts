import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { provider, api_key, server_id, from_email, from_name } = await request.json()

    if (!provider || !api_key || !from_email) {
      return NextResponse.json(
        { error: 'Provider, API Key e From Email são obrigatórios' },
        { status: 400 }
      )
    }

    // Validação específica para SocketLabs
    if (provider === 'socketlabs' && !server_id) {
      return NextResponse.json(
        { error: 'Server ID é obrigatório para SocketLabs' },
        { status: 400 }
      )
    }

    // Importar o serviço de email apropriado
    let emailService
    try {
      if (provider === 'socketlabs') {
        emailService = await import('@/lib/email/socketlabs')
      } else if (provider === 'resend') {
        emailService = await import('@/lib/email/resend')
      } else if (provider === 'sendgrid') {
        emailService = await import('@/lib/email/sendgrid')
      } else if (provider === 'nodemailer') {
        emailService = await import('@/lib/email/nodemailer')
      } else {
        return NextResponse.json(
          { error: 'Provedor não suportado' },
          { status: 400 }
        )
      }
    } catch (importError) {
      // Se o módulo não existe, retornar erro informativo
      return NextResponse.json(
        { 
          error: `Serviço de email não implementado. Veja a documentação em /docs/INTEGRACAO_EMAIL.md`,
          hint: 'Você precisa implementar o serviço de email primeiro'
        },
        { status: 501 }
      )
    }

    // Enviar email de teste
    const testEmail = process.env.ADMIN_EMAIL || from_email
    
    // Configuração específica por provedor
    let config: any = { apiKey: api_key }
    if (provider === 'socketlabs') {
      config = { serverId: server_id, apiKey: api_key }
    }
    
    const result = await emailService.sendEmail({
      to: testEmail,
      subject: 'Teste de Configuração - MudaTech',
      html: `
        <h2>Email de Teste</h2>
        <p>Este é um email de teste da configuração de envio de emails do MudaTech.</p>
        <p>Se você recebeu este email, a configuração está funcionando corretamente!</p>
        <hr>
        <p><small>Enviado em ${new Date().toLocaleString('pt-BR')}</small></p>
      `,
      from: from_email,
      fromName: from_name
    }, config)

    return NextResponse.json({
      success: true,
      message: `Email de teste enviado com sucesso para ${testEmail}`,
      result
    })

  } catch (error: any) {
    console.error('Erro ao testar email:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao enviar email de teste',
        details: error.details || error.response?.body || null
      },
      { status: 500 }
    )
  }
}

