import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getEmailConfig } from '@/lib/email/config'
import { processEmailTemplate, saveEmailTracking } from '@/lib/email/template-service'
import { importEmailService } from '@/lib/email/dynamic-import'

/**
 * Rota para enviar emails para clientes (confirmação de recebimento)
 * POST /api/admin/emails/enviar-para-cliente
 * 
 * Body: { orcamentoId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { orcamentoId } = await request.json()

    if (!orcamentoId) {
      return NextResponse.json(
        { error: 'ID do orçamento é obrigatório' },
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

    // Buscar orçamento
    const { data: orcamento, error: orcamentoError } = await supabase
      .from('orcamentos')
      .select('*')
      .eq('id', orcamentoId)
      .single()

    if (orcamentoError || !orcamento) {
      return NextResponse.json(
        { error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    if (!orcamento.email_cliente) {
      return NextResponse.json(
        { error: 'Orçamento não possui email do cliente' },
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
      codigo_orcamento: orcamento.codigo_orcamento || '',
      nome_cliente: orcamento.nome_cliente,
      email_cliente: orcamento.email_cliente,
      origem_completo: orcamento.origem_completo,
      destino_completo: orcamento.destino_completo
    }

    // Processar template (assumindo que existe um template 'confirmacao_cliente')
    const templateResult = await processEmailTemplate('confirmacao_cliente', variables)
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
        to: orcamento.email_cliente,
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
      orcamento_id: orcamento.id,
      hotsite_id: '00000000-0000-0000-0000-000000000000', // Cliente não tem hotsite
      tipo_email: 'confirmacao_cliente',
      email_destinatario: orcamento.email_cliente,
      assunto: templateResult.assunto,
      metadata: {
        provider: emailConfig.provider,
        messageId: sendResult.messageId,
        testMode: sendResult.testMode || false,
        from: emailConfig.from_email,
        fromName: emailConfig.from_name,
        replyTo: emailConfig.reply_to || emailConfig.from_email,
        to: orcamento.email_cliente,
        subject: templateResult.assunto,
        html_completo: templateResult.html,
        html_preview: templateResult.html.substring(0, 500)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Email enviado com sucesso para o cliente',
      codigo_rastreamento: templateResult.codigoRastreamento
    })

  } catch (error: any) {
    console.error('Erro ao enviar email para cliente:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar envio de email' },
      { status: 500 }
    )
  }
}
