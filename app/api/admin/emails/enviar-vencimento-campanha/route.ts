import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getEmailConfig } from '@/lib/email/config'
import { processEmailTemplate, saveEmailTracking } from '@/lib/email/template-service'
import { importEmailService } from '@/lib/email/dynamic-import'

/**
 * Rota para enviar emails de aviso de vencimento de campanha
 * POST /api/admin/emails/enviar-vencimento-campanha
 * 
 * Busca campanhas que estão próximas do vencimento (ex: 7 dias antes)
 * e envia emails de aviso para as empresas
 */
export async function POST(request: NextRequest) {
  try {
    const { diasAntecedencia = 7 } = await request.json()

    const supabase = createAdminClient()
    
    // Buscar configuração de email
    const emailConfig = await getEmailConfig()
    if (!emailConfig || !emailConfig.ativo) {
      return NextResponse.json(
        { error: 'Configuração de email não encontrada ou inativa' },
        { status: 400 }
      )
    }

    // Calcular data limite (diasAntecedencia dias a partir de hoje)
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() + diasAntecedencia)
    const dataLimiteISO = dataLimite.toISOString().split('T')[0]

    // Buscar campanhas que vencem em até diasAntecedencia dias
    const { data: campanhas, error: campanhasError } = await supabase
      .from('campanhas')
      .select(`
        id,
        nome,
        data_inicio,
        data_fim,
        ativo,
        hotsites (
          id,
          nome_exibicao,
          email
        )
      `)
      .eq('ativo', true)
      .not('data_fim', 'is', null)
      .lte('data_fim', dataLimiteISO)
      .gte('data_fim', new Date().toISOString().split('T')[0]) // Ainda não vencidas

    if (campanhasError) {
      console.error('Erro ao buscar campanhas:', campanhasError)
      return NextResponse.json(
        { error: 'Erro ao buscar campanhas próximas do vencimento' },
        { status: 500 }
      )
    }

    if (!campanhas || campanhas.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma campanha próxima do vencimento encontrada',
        enviados: 0
      })
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
      detalhes: [] as Array<{ empresa: string; campanha: string; status: string; erro?: string }>
    }

    // Processar cada campanha
    for (const campanha of campanhas) {
      const hotsite = (campanha as any).hotsites

      if (!hotsite?.email) {
        resultados.erros++
        resultados.detalhes.push({
          empresa: hotsite?.nome_exibicao || 'N/A',
          campanha: (campanha as any).nome || 'N/A',
          status: 'erro',
          erro: 'Hotsite não possui email cadastrado'
        })
        continue
      }

      try {
        // Preparar variáveis para o template
        const dataFim = new Date((campanha as any).data_fim)
        const diasRestantes = Math.ceil((dataFim.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

        const variables = {
          empresa_nome: hotsite.nome_exibicao,
          empresa_email: hotsite.email,
          campanha_nome: (campanha as any).nome || 'Campanha',
          data_fim: dataFim.toLocaleDateString('pt-BR'),
          dias_restantes: diasRestantes.toString()
        }

        // Processar template
        const templateResult = await processEmailTemplate('vencimento_campanha', variables)
        if (!templateResult) {
          resultados.erros++
          resultados.detalhes.push({
            empresa: hotsite.nome_exibicao,
            campanha: (campanha as any).nome || 'N/A',
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
            to: hotsite.email,
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
            campanha_id: (campanha as any).id,
            hotsite_id: hotsite.id,
            tipo_email: 'vencimento_campanha',
            email_destinatario: hotsite.email,
            assunto: templateResult.assunto,
            metadata: {
              provider: emailConfig.provider,
              messageId: sendResult.messageId,
              testMode: sendResult.testMode || false,
              dias_restantes: diasRestantes,
              from: emailConfig.from_email,
              fromName: emailConfig.from_name,
              replyTo: emailConfig.reply_to || emailConfig.from_email,
              to: hotsite.email,
              subject: templateResult.assunto,
              html_completo: templateResult.html,
              html_preview: templateResult.html.substring(0, 500)
            }
          })

          resultados.enviados++
          resultados.detalhes.push({
            empresa: hotsite.nome_exibicao,
            campanha: (campanha as any).nome || 'N/A',
            status: 'enviado'
          })
        } else {
          throw new Error(sendResult.error || 'Erro desconhecido ao enviar email')
        }
      } catch (error: any) {
        resultados.erros++
        resultados.detalhes.push({
          empresa: hotsite?.nome_exibicao || 'N/A',
          campanha: (campanha as any).nome || 'N/A',
          status: 'erro',
          erro: error.message || 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processadas ${campanhas.length} campanhas: ${resultados.enviados} emails enviados, ${resultados.erros} erros`,
      ...resultados
    })

  } catch (error: any) {
    console.error('Erro ao enviar emails de vencimento:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar envio de emails' },
      { status: 500 }
    )
  }
}
