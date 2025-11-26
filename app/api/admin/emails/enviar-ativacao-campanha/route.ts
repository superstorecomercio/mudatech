import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getEmailConfig } from '@/lib/email/config'
import { processEmailTemplate, saveEmailTracking } from '@/lib/email/template-service'
import { importEmailService } from '@/lib/email/dynamic-import'

/**
 * Rota para enviar emails de notificação de ativação de campanha
 * POST /api/admin/emails/enviar-ativacao-campanha
 * 
 * Body: { campanhaId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { campanhaId } = await request.json()

    if (!campanhaId) {
      return NextResponse.json(
        { error: 'ID da campanha é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    
    // Buscar configuração de email
    const emailConfig = await getEmailConfig()
    if (!emailConfig || !emailConfig.ativo) {
      return NextResponse.json(
        { error: 'Configuração de email não encontrada ou inativa' },
        { status: 400 }
      )
    }

    // Buscar campanha com hotsite
    const { data: campanha, error: campanhaError } = await supabase
      .from('campanhas')
      .select(`
        *,
        hotsites (
          id,
          nome_exibicao,
          email
        )
      `)
      .eq('id', campanhaId)
      .single()

    if (campanhaError || !campanha) {
      return NextResponse.json(
        { error: 'Campanha não encontrada' },
        { status: 404 }
      )
    }

    const hotsite = (campanha as any).hotsites
    if (!hotsite?.email) {
      return NextResponse.json(
        { error: 'Hotsite não possui email cadastrado' },
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

    // Preparar variáveis para o template
    const variables = {
      empresa_nome: hotsite.nome_exibicao,
      empresa_email: hotsite.email,
      campanha_nome: (campanha as any).nome || 'Nova Campanha',
      data_inicio: (campanha as any).data_inicio 
        ? new Date((campanha as any).data_inicio).toLocaleDateString('pt-BR')
        : 'Não informado',
      data_fim: (campanha as any).data_fim 
        ? new Date((campanha as any).data_fim).toLocaleDateString('pt-BR')
        : 'Sem data de término'
    }

    // Processar template
    const templateResult = await processEmailTemplate('ativacao_campanha', variables)
    if (!templateResult) {
      return NextResponse.json(
        { error: 'Template de email não encontrado ou inativo' },
        { status: 404 }
      )
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
        to: hotsite.email,
        subject: templateResult.assunto,
        html: templateResult.html,
        from: emailConfig.from_email,
        fromName: emailConfig.from_name,
        replyTo: emailConfig.reply_to || emailConfig.from_email
      },
      serviceConfig
    )

    if (!sendResult.success) {
      return NextResponse.json(
        { error: sendResult.error || 'Erro ao enviar email' },
        { status: 500 }
      )
    }

    // Salvar tracking
    await saveEmailTracking({
      codigo_rastreamento: templateResult.codigoRastreamento,
      campanha_id: campanhaId,
      hotsite_id: hotsite.id,
      tipo_email: 'ativacao_campanha',
      email_destinatario: hotsite.email,
      assunto: templateResult.assunto,
      metadata: {
        provider: emailConfig.provider,
        messageId: sendResult.messageId,
        testMode: sendResult.testMode || false,
        from: emailConfig.from_email,
        fromName: emailConfig.from_name,
        replyTo: emailConfig.reply_to || emailConfig.from_email,
        to: hotsite.email,
        subject: templateResult.assunto,
        html_completo: templateResult.html,
        html_preview: templateResult.html.substring(0, 500)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Email de ativação enviado com sucesso',
      codigo_rastreamento: templateResult.codigoRastreamento
    })

  } catch (error: any) {
    console.error('Erro ao enviar email de ativação:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar envio de email' },
      { status: 500 }
    )
  }
}
