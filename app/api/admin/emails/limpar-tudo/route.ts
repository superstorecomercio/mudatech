import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Rota para limpar TODOS os dados relacionados a emails e orçamentos
 * 1. Limpa logs de email_tracking
 * 2. Reseta dados de envio em orcamentos_campanhas
 * 3. Deleta todos os orçamentos (cascata deleta orcamentos_campanhas também)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    const resultados = {
      logs_removidos: 0,
      registros_resetados: 0,
      orcamentos_removidos: 0,
      erros: [] as string[]
    }

    // 1. Contar e limpar logs de email_tracking
    try {
      const { count: totalLogs } = await supabase
        .from('email_tracking')
        .select('*', { count: 'exact', head: true })

      if (totalLogs && totalLogs > 0) {
        // Deletar todos os logs usando uma condição sempre verdadeira
        const { error: deleteLogsError } = await supabase
          .from('email_tracking')
          .delete()
          .gte('created_at', '1970-01-01') // Sempre verdadeiro

        if (deleteLogsError) {
          resultados.erros.push(`Erro ao limpar logs: ${deleteLogsError.message}`)
          console.error('❌ Erro ao limpar logs:', deleteLogsError)
        } else {
          resultados.logs_removidos = totalLogs
          console.log(`✅ Logs removidos: ${totalLogs}`)
        }
      }
    } catch (error: any) {
      resultados.erros.push(`Erro ao processar logs: ${error.message}`)
      console.error('❌ Erro ao processar logs:', error)
    }

    // 2. Contar registros em orcamentos_campanhas antes de resetar
    try {
      const { count: totalRegistros } = await supabase
        .from('orcamentos_campanhas')
        .select('*', { count: 'exact', head: true })

      if (totalRegistros && totalRegistros > 0) {
        // Resetar campos de envio usando uma condição sempre verdadeira
        const { error: resetError } = await supabase
          .from('orcamentos_campanhas')
          .update({
            status_envio_email: 'na_fila',
            tentativas_envio: 0,
            ultimo_erro_envio: null,
            email_enviado_em: null,
            ultima_tentativa_envio: null
          })
          .gte('tentativas_envio', -1) // Sempre verdadeiro

        if (resetError) {
          resultados.erros.push(`Erro ao resetar registros: ${resetError.message}`)
          console.error('❌ Erro ao resetar orcamentos_campanhas:', resetError)
        } else {
          resultados.registros_resetados = totalRegistros
          console.log(`✅ Registros resetados: ${totalRegistros}`)
        }
      }
    } catch (error: any) {
      resultados.erros.push(`Erro ao processar registros: ${error.message}`)
      console.error('❌ Erro ao processar registros:', error)
    }

    // 3. Contar e deletar todos os orçamentos
    try {
      const { count: totalOrcamentos } = await supabase
        .from('orcamentos')
        .select('*', { count: 'exact', head: true })

      if (totalOrcamentos && totalOrcamentos > 0) {
        // Deletar todos os orçamentos usando uma condição sempre verdadeira
        // O CASCADE vai deletar automaticamente os registros em orcamentos_campanhas
        const { error: deleteOrcamentosError } = await supabase
          .from('orcamentos')
          .delete()
          .gte('created_at', '1970-01-01') // Sempre verdadeiro

        if (deleteOrcamentosError) {
          resultados.erros.push(`Erro ao deletar orçamentos: ${deleteOrcamentosError.message}`)
          console.error('❌ Erro ao deletar orçamentos:', deleteOrcamentosError)
        } else {
          resultados.orcamentos_removidos = totalOrcamentos
          console.log(`✅ Orçamentos removidos: ${totalOrcamentos}`)
        }
      }
    } catch (error: any) {
      resultados.erros.push(`Erro ao processar orçamentos: ${error.message}`)
      console.error('❌ Erro ao processar orçamentos:', error)
    }

    // Verificar se houve erros críticos
    const sucesso = resultados.erros.length === 0 || 
                    (resultados.orcamentos_removidos > 0 && resultados.erros.length < 3)

    return NextResponse.json({
      success: sucesso,
      message: sucesso 
        ? 'Limpeza concluída com sucesso' 
        : 'Limpeza concluída com alguns erros',
      detalhes: {
        ...resultados,
        timestamp: new Date().toISOString()
      }
    }, { status: sucesso ? 200 : 207 }) // 207 = Multi-Status (sucesso parcial)
  } catch (error: any) {
    console.error('❌ Erro inesperado ao limpar tudo:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro inesperado', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

