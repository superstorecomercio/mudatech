import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { formatDateOnlyBR } from '@/lib/utils/date'

/**
 * API Route para buscar informações do dashboard
 * GET /api/admin/dashboard
 * 
 * Retorna resumo do sistema:
 * - Status dos envios de emails de orçamentos
 * - Status dos emails de vencimento
 * - Campanhas que vencem hoje e ontem
 * - Indicadores de erros
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Obter data atual no timezone de São Paulo
    const hoje = new Date()
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const hojeSPStr = formatter.format(hoje)
    const ontem = new Date(hoje)
    ontem.setDate(ontem.getDate() - 1)
    const ontemSPStr = formatter.format(ontem)
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)
    const amanhaSPStr = formatter.format(amanha)

    // 1. Status dos envios de emails de orçamentos (últimas 24h)
    const vinteQuatroHorasAtras = new Date()
    vinteQuatroHorasAtras.setHours(vinteQuatroHorasAtras.getHours() - 24)

    const { data: emailsOrcamentos, error: emailsOrcamentosError } = await supabase
      .from('email_tracking')
      .select('status_envio_email, tipo_email')
      .eq('tipo_email', 'orcamento_empresa')
      .gte('created_at', vinteQuatroHorasAtras.toISOString())

    const emailsOrcamentosStats = {
      total: emailsOrcamentos?.length || 0,
      enviados: emailsOrcamentos?.filter(e => e.status_envio_email === 'enviado').length || 0,
      na_fila: emailsOrcamentos?.filter(e => e.status_envio_email === 'na_fila').length || 0,
      erro: emailsOrcamentos?.filter(e => e.status_envio_email === 'erro').length || 0,
      enviando: emailsOrcamentos?.filter(e => e.status_envio_email === 'enviando').length || 0
    }

    // Verificar se há erros recentes (últimas 2 horas)
    const duasHorasAtras = new Date()
    duasHorasAtras.setHours(duasHorasAtras.getHours() - 2)

    const { data: errosRecentes, error: errosRecentesError } = await supabase
      .from('email_tracking')
      .select('id, status_envio_email, tipo_email, created_at, metadata')
      .eq('status_envio_email', 'erro')
      .gte('created_at', duasHorasAtras.toISOString())
      .order('created_at', { ascending: false })
      .limit(10)

    // 2. Status dos emails de vencimento
    const { data: emailsVencimento, error: emailsVencimentoError } = await supabase
      .from('email_tracking')
      .select('status_envio_email, tipo_email, created_at')
      .in('tipo_email', ['campanha_vencendo_hoje', 'campanha_vencendo_1dia'])
      .gte('created_at', vinteQuatroHorasAtras.toISOString())

    const emailsVencimentoStats = {
      total: emailsVencimento?.length || 0,
      enviados: emailsVencimento?.filter(e => e.status_envio_email === 'enviado').length || 0,
      na_fila: emailsVencimento?.filter(e => e.status_envio_email === 'na_fila').length || 0,
      erro: emailsVencimento?.filter(e => e.status_envio_email === 'erro').length || 0
    }

    // 3. Campanhas que vencem hoje e ontem
    const { data: campanhasVencendo, error: campanhasVencendoError } = await supabase
      .from('campanhas')
      .select(`
        id,
        data_fim,
        ativo,
        hotsite:hotsites!hotsite_id(
          id,
          nome_exibicao,
          email
        )
      `)
      .eq('ativo', true)
      .not('data_fim', 'is', null)
      .in('data_fim', [hojeSPStr, ontemSPStr, amanhaSPStr])
      .order('data_fim', { ascending: true })

    // Processar campanhas vencendo
    const campanhasVencendoProcessadas = (campanhasVencendo || []).map((c: any) => {
      const hotsite = Array.isArray(c.hotsite) ? c.hotsite[0] : c.hotsite
      const dataFim = c.data_fim ? c.data_fim.split('T')[0] : null
      const venceHoje = dataFim === hojeSPStr
      const venceOntem = dataFim === ontemSPStr
      const venceAmanha = dataFim === amanhaSPStr

      return {
        id: c.id,
        data_fim: c.data_fim,
        data_fim_formatada: formatDateOnlyBR(c.data_fim),
        hotsite_nome: hotsite?.nome_exibicao || 'N/A',
        hotsite_email: hotsite?.email || null,
        vence_hoje: venceHoje,
        vence_ontem: venceOntem,
        vence_amanha: venceAmanha,
        status: venceOntem ? 'vencida' : venceHoje ? 'vence_hoje' : 'vence_amanha'
      }
    })

    // Verificar se há emails de vencimento criados para essas campanhas
    const campanhaIds = campanhasVencendoProcessadas.map(c => c.id)
    const { data: emailsVencimentoCampanhas } = await supabase
      .from('email_tracking')
      .select('campanha_id, tipo_email, status_envio_email, created_at')
      .in('campanha_id', campanhaIds)
      .in('tipo_email', ['campanha_vencendo_hoje', 'campanha_vencendo_1dia'])
      .gte('created_at', hojeSPStr + 'T00:00:00')

    // Adicionar status de email para cada campanha
    const campanhasComStatus = campanhasVencendoProcessadas.map(campanha => {
      const emailCampanha = emailsVencimentoCampanhas?.find(
        e => e.campanha_id === campanha.id
      )
      return {
        ...campanha,
        email_criado: !!emailCampanha,
        email_status: emailCampanha?.status_envio_email || null,
        email_enviado: emailCampanha?.status_envio_email === 'enviado'
      }
    })

    // 4. Status geral do sistema
    const statusGeral = {
      emails_orcamentos_ok: emailsOrcamentosStats.erro === 0 && emailsOrcamentosStats.na_fila < 50,
      emails_vencimento_ok: emailsVencimentoStats.erro === 0,
      tem_erros_recentes: (errosRecentes?.length || 0) > 0,
      campanhas_vencidas_hoje: campanhasComStatus.filter(c => c.vence_hoje).length,
      campanhas_vencidas_ontem: campanhasComStatus.filter(c => c.vence_ontem).length,
      campanhas_vencendo_amanha: campanhasComStatus.filter(c => c.vence_amanha).length
    }

    return NextResponse.json({
      status_geral: statusGeral,
      emails_orcamentos: emailsOrcamentosStats,
      emails_vencimento: emailsVencimentoStats,
      erros_recentes: errosRecentes?.map(e => ({
        id: e.id,
        tipo_email: e.tipo_email,
        created_at: e.created_at,
        erro: e.metadata?.erro || 'Erro desconhecido'
      })) || [],
      campanhas_vencendo: campanhasComStatus,
      data_atual: hojeSPStr,
      data_ontem: ontemSPStr,
      data_amanha: amanhaSPStr
    })
  } catch (error: any) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar dados do dashboard',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

