import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Rota para limpar todos os dados de envio de emails
 * Reseta os campos de controle de envio em orcamentos_campanhas
 * e opcionalmente limpa os logs de email_tracking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { limparLogs = false } = body

    const supabase = createAdminClient()

    // 1. Contar registros antes do reset
    const { count: totalAntes } = await supabase
      .from('orcamentos_campanhas')
      .select('*', { count: 'exact', head: true })

    // 2. Resetar campos de envio em orcamentos_campanhas usando SQL direto
    // O Supabase não permite UPDATE sem WHERE, então usamos uma condição sempre verdadeira
    const { error: resetError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE orcamentos_campanhas
        SET 
          status_envio_email = 'na_fila',
          tentativas_envio = 0,
          ultimo_erro_envio = NULL,
          email_enviado_em = NULL,
          ultima_tentativa_envio = NULL
        WHERE id IS NOT NULL;
      `
    })

    // Se a função RPC não existir, usar UPDATE com condição sempre verdadeira
    if (resetError) {
      // Tentar com uma condição que sempre seja verdadeira
      const { error: updateError } = await supabase
        .from('orcamentos_campanhas')
        .update({
          status_envio_email: 'na_fila',
          tentativas_envio: 0,
          ultimo_erro_envio: null,
          email_enviado_em: null,
          ultima_tentativa_envio: null
        })
        .gte('tentativas_envio', -1) // Sempre verdadeiro (tentativas_envio >= -1)

      if (updateError) {
        console.error('❌ Erro ao resetar orcamentos_campanhas:', updateError)
        return NextResponse.json(
          { error: 'Erro ao resetar dados de envio', details: updateError.message },
          { status: 500 }
        )
      }
    }

    const totalResetados = totalAntes || 0

    // 3. Opcionalmente limpar logs de email_tracking
    let logsRemovidos = 0
    if (limparLogs) {
      // Contar logs antes de deletar
      const { count: totalLogsAntes } = await supabase
        .from('email_tracking')
        .select('*', { count: 'exact', head: true })

      // Deletar todos os logs usando uma condição sempre verdadeira
      const { error: deleteLogsError } = await supabase
        .from('email_tracking')
        .delete()
        .gte('created_at', '1970-01-01') // Sempre verdadeiro (created_at >= 1970)

      if (deleteLogsError) {
        console.error('❌ Erro ao limpar logs:', deleteLogsError)
        return NextResponse.json(
          { error: 'Erro ao limpar logs de email', details: deleteLogsError.message },
          { status: 500 }
        )
      }

      logsRemovidos = totalLogsAntes || 0
    }

    console.log('✅ Dados de envio resetados com sucesso!')
    console.log(`   - Registros resetados: ${totalResetados}`)
    if (limparLogs) {
      console.log(`   - Logs removidos: ${logsRemovidos}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Dados de envio resetados com sucesso',
      detalhes: {
        registros_resetados: totalResetados,
        logs_removidos: limparLogs ? logsRemovidos : null,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error('❌ Erro inesperado ao limpar dados:', error)
    return NextResponse.json(
      { error: 'Erro inesperado', details: error.message },
      { status: 500 }
    )
  }
}
