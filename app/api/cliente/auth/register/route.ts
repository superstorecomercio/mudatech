import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { hashPassword, createVerificationCode } from '@/lib/auth/cliente-auth'
import { getEmailConfig } from '@/lib/email/config'
import { importEmailService } from '@/lib/email/dynamic-import'

/**
 * POST /api/cliente/auth/register
 * Cadastro de novo cliente (empresa)
 */
/**
 * Gerar senha aleatória
 */
function generatePassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, senha, nome, telefone, empresaData, plano_id } = body

    if (!email || !empresaData) {
      return NextResponse.json(
        { error: 'Email e dados da empresa são obrigatórios' },
        { status: 400 }
      )
    }

    // Gerar senha automaticamente se não fornecida
    const senhaFinal = senha || generatePassword()

    const supabase = createAdminClient()

    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('usuarios_clientes')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Criar empresa primeiro
    const slug = empresaData.nome_fantasia
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'empresa'

    // Garantir slug único
    let slugFinal = slug
    let counter = 1
    while (true) {
      const { data: existing } = await supabase
        .from('empresas')
        .select('id')
        .eq('slug', slugFinal)
        .single()

      if (!existing) break
      slugFinal = `${slug}-${counter}`
      counter++
    }

    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .insert({
        nome: empresaData.nome_fantasia || empresaData.razao_social || 'Empresa',
        slug: slugFinal,
        cnpj: empresaData.cnpj?.replace(/\D/g, '') || null,
        razao_social: empresaData.razao_social || null,
        nome_fantasia: empresaData.nome_fantasia || null,
        nome_responsavel: empresaData.nome_responsavel || null,
        email_responsavel: email,
        telefone_responsavel: telefone?.replace(/\D/g, '') || null,
        endereco_completo: empresaData.endereco_completo || null,
        cidade: empresaData.cidade || null,
        estado: empresaData.estado?.toUpperCase().slice(0, 2) || null,
        cep: empresaData.cep?.replace(/\D/g, '') || null,
        email: email,
        telefones: telefone ? [telefone.replace(/\D/g, '')] : null,
        ativo: true,
      })
      .select()
      .single()

    if (empresaError || !empresa) {
      console.error('Erro ao criar empresa:', empresaError)
      return NextResponse.json(
        { error: 'Erro ao criar empresa: ' + (empresaError?.message || 'Erro desconhecido') },
        { status: 500 }
      )
    }

    // Criar hash da senha
    const senhaHash = await hashPassword(senhaFinal)

    // Criar usuário vinculado à empresa
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios_clientes')
      .insert({
        email: email.toLowerCase(),
        senha_hash: senhaHash,
        empresa_id: empresa.id,
        nome: nome || null,
        telefone: telefone?.replace(/\D/g, '') || null,
        email_verificado: false,
        ativo: true,
      })
      .select()
      .single()

    if (usuarioError || !usuario) {
      // Rollback: deletar empresa criada
      await supabase.from('empresas').delete().eq('id', empresa.id)

      console.error('Erro ao criar usuário:', usuarioError)
      return NextResponse.json(
        { error: 'Erro ao criar usuário: ' + (usuarioError?.message || 'Erro desconhecido') },
        { status: 500 }
      )
    }

    // Criar código de verificação
    const codigo = await createVerificationCode(email)

    // Enviar email com credenciais
    let emailEnviado = false
    let emailError: any = null
    
    try {
      console.log('[Cliente Register] Iniciando envio de email para:', email)
      const emailConfig = await getEmailConfig()
      
      console.log('[Cliente Register] Configuração de email:', {
        existe: !!emailConfig,
        ativo: emailConfig?.ativo,
        provider: emailConfig?.provider,
        from_email: emailConfig?.from_email
      })
      
      if (!emailConfig) {
        console.error('[Cliente Register] Configuração de email não encontrada')
        emailError = 'Configuração de email não encontrada'
      } else if (!emailConfig.ativo) {
        console.warn('[Cliente Register] Configuração de email está inativa')
        emailError = 'Configuração de email está inativa'
      } else if (!emailConfig.from_email) {
        console.error('[Cliente Register] Email de origem não configurado')
        emailError = 'Email de origem não configurado'
      } else if (!emailConfig.provider) {
        console.error('[Cliente Register] Provedor de email não configurado')
        emailError = 'Provedor de email não configurado'
      } else {
        const emailService = await importEmailService(
          emailConfig.provider as 'socketlabs' | 'resend' | 'sendgrid' | 'nodemailer'
        )

        if (!emailService) {
          console.error('[Cliente Register] Serviço de email não disponível')
          emailError = 'Serviço de email não disponível'
        } else {
          const serviceConfig: any = {}
          if (emailConfig.provider === 'socketlabs') {
            serviceConfig.serverId = emailConfig.server_id
            serviceConfig.apiKey = emailConfig.api_key
          } else {
            serviceConfig.apiKey = emailConfig.api_key
          }

          console.log('[Cliente Register] Enviando email...')
          const sendResult = await emailService.sendEmail({
            to: email,
            from: emailConfig.from_email,
            fromName: emailConfig.from_name || 'MudaTech',
            subject: 'Bem-vindo ao MudaTech - Suas credenciais de acesso',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #667eea;">Bem-vindo ao MudaTech!</h2>
                <p>Seu cadastro foi realizado com sucesso. Abaixo estão suas credenciais de acesso:</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 10px 0;"><strong>Senha:</strong> ${senhaFinal}</p>
                </div>
                
                <p><strong>⚠️ Importante:</strong> Guarde estas credenciais com segurança. Você precisará delas para acessar o painel administrativo.</p>
                
                <p>Para acessar o painel, visite: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://mudatech.com.br'}/painel">${process.env.NEXT_PUBLIC_SITE_URL || 'https://mudatech.com.br'}/painel</a></p>
                
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                  Este é um email automático. Por favor, não responda.
                </p>
              </div>
            `,
          }, serviceConfig)

          console.log('[Cliente Register] Resultado do envio:', {
            success: sendResult.success,
            error: sendResult.error,
            messageId: sendResult.messageId
          })

          if (sendResult.success) {
            emailEnviado = true
          } else {
            emailError = sendResult.error || 'Erro desconhecido ao enviar email'
          }
        }
      }
    } catch (err: any) {
      console.error('[Cliente Register] Erro ao enviar email:', err)
      emailError = err.message || 'Erro ao enviar email'
    }

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        empresa_id: usuario.empresa_id,
      },
      senha_gerada: !senha, // Indica se a senha foi gerada automaticamente
      plano_id: plano_id || null,
      email_enviado: emailEnviado,
      email_erro: emailError,
      senha: senhaFinal, // Retornar senha caso email não tenha sido enviado
      message: emailEnviado 
        ? 'Cadastro realizado com sucesso! Verifique seu email para receber suas credenciais de acesso.'
        : `Cadastro realizado com sucesso! ${emailError ? `Atenção: Email não foi enviado (${emailError}). ` : ''}Suas credenciais: Email: ${email}, Senha: ${senhaFinal}`,
    })
  } catch (error: any) {
    console.error('Erro ao cadastrar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

