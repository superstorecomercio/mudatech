import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Rota para deletar TODOS os logs de email_tracking
 * POST /api/admin/emails/logs/limpar-todos
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Contar logs antes de deletar
    const { count: totalLogs } = await supabase
      .from('email_tracking')
      .select('*', { count: 'exact', head: true })

    if (!totalLogs || totalLogs === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum log para deletar',
        detalhes: {
          logs_removidos: 0,
          timestamp: new Date().toISOString()
        }
      })
    }

    // Deletar todos os logs em lotes
    // O Supabase tem limite de 1000 registros por operação, então deletamos em lotes
    let totalDeletados = 0
    const batchSize = 1000
    let hasMore = true

    while (hasMore) {
      // Buscar IDs de um lote
      const { data: batch, error: fetchError } = await supabase
        .from('email_tracking')
        .select('id')
        .limit(batchSize)

      if (fetchError) {
        console.error('❌ Erro ao buscar logs para deletar:', fetchError)
        return NextResponse.json(
          { 
            success: false,
            error: 'Erro ao buscar logs', 
            details: fetchError.message 
          },
          { status: 500 }
        )
      }

      if (!batch || batch.length === 0) {
        hasMore = false
        break
      }

      // Deletar o lote
      const ids = batch.map(log => log.id)
      const { error: deleteError } = await supabase
        .from('email_tracking')
        .delete()
        .in('id', ids)

      if (deleteError) {
        console.error('❌ Erro ao deletar lote de logs:', deleteError)
        return NextResponse.json(
          { 
            success: false,
            error: 'Erro ao deletar logs', 
            details: deleteError.message 
          },
          { status: 500 }
        )
      }

      totalDeletados += ids.length
      console.log(`✅ Lote deletado: ${ids.length} logs (Total: ${totalDeletados})`)

      // Se o lote foi menor que o tamanho máximo, não há mais registros
      if (batch.length < batchSize) {
        hasMore = false
      }
    }

    console.log(`✅ ${totalDeletados} logs deletados com sucesso!`)

    return NextResponse.json({
      success: true,
      message: 'Todos os logs foram deletados com sucesso',
      detalhes: {
        logs_removidos: totalDeletados,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error: any) {
    console.error('❌ Erro inesperado ao deletar logs:', error)
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

