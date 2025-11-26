import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getEmailConfig } from '@/lib/email/config'
import { processEmailTemplate, saveEmailTracking } from '@/lib/email/template-service'
import { isTestMode } from '@/lib/email/test-mode'
import { importEmailService } from '@/lib/email/dynamic-import'

/**
 * Rota para enviar emails pendentes (orçamentos para empresas)
 * POST /api/admin/emails/enviar-pendentes
 * 
 * Busca orçamentos com empresas em status 'na_fila' ou 'erro' (com menos de 3 tentativas)
 * e envia os emails automaticamente.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    
    // Buscar configuração de email
    const emailConfig = await getEmailConfig()
    
    // Verificar se está em modo teste
    const testMode = await isTestMode()
    
    console.log('📧 [Enviar Pendentes] Configuração:', {
      existe: !!emailConfig,
      from_email: emailConfig?.from_email,
      provider: emailConfig?.provider,
      ativo: emailConfig?.ativo,
      testMode
    })
    
    // Em modo teste, permitir mesmo se inativo, mas precisa ter dados básicos
    if (!emailConfig) {
      return NextResponse.json(
        { error: 'Configuração de email não encontrada. Configure em /admin/emails/configuracao' },
        { status: 400 }
      )
    }
    
    // Validar dados mínimos necessários (from_email é obrigatório sempre)
    if (!emailConfig.from_email || emailConfig.from_email.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Email de origem não configurado. Configure em /admin/emails/configuracao',
          debug: { from_email: emailConfig.from_email, provider: emailConfig.provider }
        },
        { status: 400 }
      )
    }
    
    // Provider é obrigatório apenas se não estiver em modo teste
    // Em modo teste, podemos usar um provider padrão ou permitir sem provider
    if (!testMode && (!emailConfig.provider || emailConfig.provider === null)) {
      return NextResponse.json(
        { error: 'Provedor de email não configurado. Configure em /admin/emails/configuracao' },
        { status: 400 }
      )
    }
    
    // Se não está em modo teste, precisa estar ativo
    if (!testMode && !emailConfig.ativo) {
      return NextResponse.json(
        { error: 'Configuração de email está inativa. Ative em /admin/emails/configuracao' },
        { status: 400 }
      )
    }
    
    // Em modo teste, se não tiver provider, usar um padrão para processar templates
    if (testMode && (!emailConfig.provider || emailConfig.provider === null)) {
      // Em modo teste, não precisa de provider real, mas vamos usar socketlabs como padrão
      emailConfig.provider = 'socketlabs'
      emailConfig.api_key = emailConfig.api_key || 'test-key'
    }

    // Buscar empresas na fila ou com erro (menos de 3 tentativas)
    const { data: todosVinculos, error: vinculosError } = await supabase
      .from('orcamentos_campanhas')
      .select(`
        id,
        orcamento_id,
        hotsite_id,
        status_envio_email,
        tentativas_envio,
        ultimo_erro_envio,
        hotsites (
          id,
          nome_exibicao,
          email
        ),
        orcamentos (
          id,
          codigo_orcamento,
          nome_cliente,
          email_cliente,
          telefone_cliente,
          whatsapp,
          origem_completo,
          destino_completo,
          tipo_imovel,
          metragem,
          distancia_km,
          preco_min,
          preco_max,
          data_estimada,
          lista_objetos
        )
      `)
      .or('status_envio_email.eq.na_fila,and(status_envio_email.eq.erro,tentativas_envio.lt.3)')
      .order('created_at', { ascending: true }) // Processar os mais antigos primeiro

    if (vinculosError) {
      console.error('Erro ao buscar vínculos:', vinculosError)
      return NextResponse.json(
        { error: 'Erro ao buscar emails pendentes' },
        { status: 500 }
      )
    }

    if (!todosVinculos || todosVinculos.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum email pendente para enviar',
        enviados: 0,
        erros: 0,
        total: 0,
        lotes: 0
      })
    }

    // Dividir em lotes de 50 emails
    const TAMANHO_LOTE = 50
    const lotes: typeof todosVinculos[] = []
    for (let i = 0; i < todosVinculos.length; i += TAMANHO_LOTE) {
      lotes.push(todosVinculos.slice(i, i + TAMANHO_LOTE))
    }

    console.log(`📦 [Enviar Pendentes] Processando ${todosVinculos.length} emails em ${lotes.length} lote(s)`)

    if (vinculosError) {
      console.error('Erro ao buscar vínculos:', vinculosError)
      return NextResponse.json(
        { error: 'Erro ao buscar emails pendentes' },
        { status: 500 }
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
      total: todosVinculos.length,
      lotes: lotes.length,
      detalhes: [] as Array<{ empresa: string; status: string; erro?: string; lote?: number }>
    }

    // Processar em lotes
    for (let indiceLote = 0; indiceLote < lotes.length; indiceLote++) {
      const lote = lotes[indiceLote]
      const numeroLote = indiceLote + 1
      
      console.log(`📦 [Lote ${numeroLote}/${lotes.length}] Processando ${lote.length} emails...`)

      // Processar cada vínculo do lote
      for (const vinculo of lote) {
      const hotsite = vinculo.hotsites as any
      const orcamento = vinculo.orcamentos as any

      if (!hotsite?.email || !orcamento) {
        resultados.erros++
        const erroMsg = 'Dados incompletos (hotsite ou orçamento não encontrado)'
        resultados.detalhes.push({
          empresa: hotsite?.nome_exibicao || 'N/A',
          status: 'erro',
          erro: erroMsg
        })
        
        // Salvar erro no tracking também
        try {
          await saveEmailTracking({
            codigo_rastreamento: `ERROR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            orcamento_id: vinculo.orcamento_id || undefined,
            hotsite_id: vinculo.hotsite_id || '00000000-0000-0000-0000-000000000000',
            tipo_email: 'orcamento_empresa',
            email_destinatario: hotsite?.email || 'N/A',
            assunto: 'Erro ao enviar orçamento',
            metadata: {
              provider: emailConfig.provider,
              status_envio: 'erro',
              erro_mensagem: erroMsg,
              testMode: testMode,
              lote: numeroLote,
              total_lotes: lotes.length,
              processado_em: new Date().toISOString()
            }
          })
        } catch (trackError) {
          console.error('Erro ao salvar tracking de erro:', trackError)
        }
        
        continue
      }

      try {
        // Atualizar status para "enviando"
        await supabase
          .from('orcamentos_campanhas')
          .update({
            status_envio_email: 'enviando',
            tentativas_envio: (vinculo.tentativas_envio || 0) + 1,
            ultima_tentativa_envio: new Date().toISOString()
          })
          .eq('id', vinculo.id)

        // Preparar variáveis para o template
        const tipoImovelLabels: Record<string, string> = {
          casa: 'Casa',
          apartamento: 'Apartamento',
          empresa: 'Empresa',
          '1_quarto': '1 Quarto',
          '2_quartos': '2 Quartos',
          '3_quartos': '3 Quartos',
          '4_quartos': '4 Quartos'
        }

        const tipoImovel = tipoImovelLabels[orcamento.tipo_imovel] || orcamento.tipo_imovel

        const variables = {
          codigo_orcamento: orcamento.codigo_orcamento || '',
          nome_cliente: orcamento.nome_cliente,
          email_cliente: orcamento.email_cliente,
          telefone_cliente: orcamento.telefone_cliente || orcamento.whatsapp,
          origem_completo: orcamento.origem_completo,
          destino_completo: orcamento.destino_completo,
          tipo_imovel: tipoImovel,
          metragem: orcamento.metragem || 'Não informado',
          distancia_km: orcamento.distancia_km?.toString() || '0',
          preco_min: orcamento.preco_min?.toLocaleString('pt-BR') || '0',
          preco_max: orcamento.preco_max?.toLocaleString('pt-BR') || '0',
          data_estimada: orcamento.data_estimada 
            ? new Date(orcamento.data_estimada).toLocaleDateString('pt-BR')
            : 'Não informado',
          lista_objetos: orcamento.lista_objetos || '',
          empresa_nome: hotsite.nome_exibicao,
          empresa_email: hotsite.email
        }

        // Processar template
        const templateResult = await processEmailTemplate('orcamento_empresa', variables)
        if (!templateResult) {
          throw new Error('Template de email não encontrado ou inativo')
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
        // replyTo será o email da empresa (destinatária) para que respostas voltem para ela
        const sendResult = await emailService.sendEmail(
          {
            to: hotsite.email,
            subject: templateResult.assunto,
            html: templateResult.html,
            from: emailConfig.from_email,
            fromName: emailConfig.from_name,
            replyTo: hotsite.email // Email da empresa destinatária
          },
          serviceConfig
        )

        if (sendResult.success) {
          // Atualizar status para "enviado"
          await supabase
            .from('orcamentos_campanhas')
            .update({
              status_envio_email: 'enviado',
              email_enviado_em: new Date().toISOString(),
              ultimo_erro_envio: null
            })
            .eq('id', vinculo.id)

          // Salvar tracking com HTML completo e todas as informações
          await saveEmailTracking({
            codigo_rastreamento: templateResult.codigoRastreamento,
            orcamento_id: orcamento.id,
            hotsite_id: hotsite.id,
            tipo_email: 'orcamento_empresa',
            email_destinatario: hotsite.email,
            assunto: templateResult.assunto,
            metadata: {
              provider: emailConfig.provider,
              messageId: sendResult.messageId,
              testMode: sendResult.testMode || false,
              lote: numeroLote,
              total_lotes: lotes.length,
              processado_em: new Date().toISOString(),
              // Informações completas do email
              from: emailConfig.from_email,
              fromName: emailConfig.from_name,
              replyTo: hotsite.email, // Email da empresa destinatária
              to: hotsite.email,
              subject: templateResult.assunto,
              html_completo: templateResult.html, // HTML completo do email
              html_preview: templateResult.html.substring(0, 500) // Preview para listagem
            }
          })

          resultados.enviados++
          resultados.detalhes.push({
            empresa: hotsite.nome_exibicao,
            status: 'enviado',
            lote: numeroLote
          })
        } else {
          throw new Error(sendResult.error || 'Erro desconhecido ao enviar email')
        }
      } catch (error: any) {
        const errorMessage = error.message || 'Erro desconhecido'
        
        // Atualizar status para "erro"
        await supabase
          .from('orcamentos_campanhas')
          .update({
            status_envio_email: 'erro',
            ultimo_erro_envio: errorMessage
          })
          .eq('id', vinculo.id)

        // Salvar erro no tracking também
        try {
          // Tentar gerar código de rastreamento mesmo em caso de erro
          const codigoRastreamento = `ERROR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
          
          await saveEmailTracking({
            codigo_rastreamento: codigoRastreamento,
            orcamento_id: orcamento?.id,
            hotsite_id: hotsite?.id || '00000000-0000-0000-0000-000000000000',
            tipo_email: 'orcamento_empresa',
            email_destinatario: hotsite?.email || 'N/A',
            assunto: templateResult?.assunto || 'Erro ao enviar orçamento',
            metadata: {
              provider: emailConfig.provider,
              status_envio: 'erro',
              erro_mensagem: errorMessage,
              erro_codigo: error.code || 'UNKNOWN',
              testMode: testMode,
              lote: numeroLote,
              total_lotes: lotes.length,
              processado_em: new Date().toISOString(),
              from: emailConfig.from_email,
              fromName: emailConfig.from_name,
              replyTo: hotsite?.email || emailConfig.from_email,
              to: hotsite?.email || 'N/A',
              subject: templateResult?.assunto || 'Erro ao enviar orçamento',
              html_completo: templateResult?.html || '',
              html_preview: templateResult?.html?.substring(0, 500) || ''
            }
          })
        } catch (trackError) {
          console.error('Erro ao salvar tracking de erro:', trackError)
        }

        resultados.erros++
        resultados.detalhes.push({
          empresa: hotsite?.nome_exibicao || 'N/A',
          status: 'erro',
          erro: errorMessage,
          lote: numeroLote
        })
      }
    }

      // Aguardar 500ms entre lotes (exceto no último lote)
      if (indiceLote < lotes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processados ${resultados.total} emails em ${resultados.lotes} lote(s): ${resultados.enviados} enviados, ${resultados.erros} erros`,
      ...resultados
    })

  } catch (error: any) {
    console.error('Erro ao enviar emails pendentes:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar envio de emails' },
      { status: 500 }
    )
  }
}
