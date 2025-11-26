import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getEmailConfig } from '@/lib/email/config'
import { processEmailTemplate, saveEmailTracking } from '@/lib/email/template-service'
import { importEmailService } from '@/lib/email/dynamic-import'

/**
 * Rota para enviar emails de prospecção para potenciais clientes
 * POST /api/admin/emails/enviar-prospeccao-clientes
 * 
 * Body: { emails?: string[] } - Se não fornecido, busca de uma tabela de leads (a ser criada)
 */
export async function POST(request: NextRequest) {
  try {
    const { emails } = await request.json()

    const supabase = createAdminClient()
    
    // Buscar configuração de email
    const emailConfig = await getEmailConfig()
    if (!emailConfig || !emailConfig.ativo) {
      return NextResponse.json(
        { error: 'Configuração de email não encontrada ou inativa' },
        { status: 400 }
      )
    }

    // Se emails não foram fornecidos, buscar de uma tabela de leads (futuro)
    // Por enquanto, retornar erro se não fornecido
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Lista de emails é obrigatória' },
        { status: 400 }
      )
    }

    // Importar serviço de email
    const emailService = await importEmailService(emailConfig.provider!)
    if (!emailService) {
      return NextResponse.json(
        { error: `Serviço de email ${emailConfig.provider} não disponível` },
        { status: 500 }
      )
    }

    const resultados = {
      enviados: 0,
      erros: 0,
      detalhes: [] as Array<{ email: string; status: string; erro?: string }>
    }

    // Processar cada email
    for (const email of emails) {
      try {
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          resultados.erros++
          resultados.detalhes.push({
            email,
            status: 'erro',
            erro: 'Email inválido'
          })
          continue
        }

        // Preparar variáveis para o template (prospecção)
        const variables = {
          nome_cliente: email.split('@')[0], // Nome genérico baseado no email
          email_cliente: email
        }

        // Processar template
        const templateResult = await processEmailTemplate('prospeccao_clientes', variables)
        if (!templateResult) {
          resultados.erros++
          resultados.detalhes.push({
            email,
            status: 'erro',
            erro: 'Template de email não encontrado ou inativo'
          })
          continue
        }

        // Preparar configuração do serviço
        const serviceConfig: any = {
          apiKey: emailConfig.api_key,
          from: emailConfig.from_email,
          fromName: emailConfig.from_name,
          replyTo: emailConfig.reply_to || emailConfig.from_email
        }

        if (emailConfig.provider === 'socketlabs' && emailConfig.server_id) {
          serviceConfig.serverId = emailConfig.server_id
        }

        // Enviar email
        const sendResult = await emailService.sendEmail(
          {
            to: email,
            subject: templateResult.assunto,
            html: templateResult.html,
            from: emailConfig.from_email,
            fromName: emailConfig.from_name,
            replyTo: emailConfig.reply_to || emailConfig.from_email
          },
          serviceConfig
        )

        if (sendResult.success) {
          // Salvar tracking
          await saveEmailTracking({
            codigo_rastreamento: templateResult.codigoRastreamento,
            hotsite_id: '00000000-0000-0000-0000-000000000000', // Prospecção não tem hotsite
            tipo_email: 'prospeccao_clientes',
            email_destinatario: email,
            assunto: templateResult.assunto,
            metadata: {
              provider: emailConfig.provider,
              messageId: sendResult.messageId,
              testMode: sendResult.testMode || false,
              from: emailConfig.from_email,
              fromName: emailConfig.from_name,
              replyTo: emailConfig.reply_to || emailConfig.from_email,
              to: email,
              subject: templateResult.assunto,
              html_completo: templateResult.html,
              html_preview: templateResult.html.substring(0, 500)
            }
          })

          resultados.enviados++
          resultados.detalhes.push({
            email,
            status: 'enviado'
          })
        } else {
          throw new Error(sendResult.error || 'Erro desconhecido ao enviar email')
        }
      } catch (error: any) {
        resultados.erros++
        resultados.detalhes.push({
          email,
          status: 'erro',
          erro: error.message || 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processados ${emails.length} emails: ${resultados.enviados} enviados, ${resultados.erros} erros`,
      ...resultados
    })

  } catch (error: any) {
    console.error('Erro ao enviar emails de prospecção:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar envio de emails' },
      { status: 500 }
    )
  }
}
