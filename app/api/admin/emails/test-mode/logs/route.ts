import { NextResponse } from 'next/server'
import { getTestEmailLogs, getTestEmailStats, clearTestEmailLogs } from '@/lib/email/test-mode'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Buscar diretamente do banco para debug
    const supabase = createAdminClient()
    
    // Primeiro, tentar buscar todos os logs de teste
    const { data: allTestLogs, error: allError } = await supabase
      .from('email_tracking')
      .select('*')
      .eq('tipo_email', 'teste_configuracao') // Usar tipo_email ao invés de template_tipo
      .order('enviado_em', { ascending: false })
      .limit(100)
    
    if (allError) {
      console.error('❌ [API LOGS] Erro na query direta:', allError)
    }
    
    // Também buscar por metadata (sem filtro de status_envio que não existe)
    const { data: metadataLogs, error: metadataError } = await supabase
      .from('email_tracking')
      .select('*')
      .contains('metadata', { modo_teste: true })
      .order('enviado_em', { ascending: false })
      .limit(100)
    
    if (metadataError) {
      console.error('❌ [API LOGS] Erro na query por metadata:', metadataError)
    }
    
    // Combinar resultados (remover duplicatas)
    const combinedLogs = [...(allTestLogs || []), ...(metadataLogs || [])]
    const uniqueLogs = combinedLogs.filter((log, index, self) => 
      index === self.findIndex(l => l.id === log.id)
    )
    
    // Usar função helper para converter
    const logs = await getTestEmailLogs()
    const stats = await getTestEmailStats()
    
    return NextResponse.json({
      logs: logs.length > 0 ? logs : uniqueLogs.map(item => ({
        to: item.metadata?.destinatario_original || [item.destinatario_email],
        subject: item.assunto || '',
        html: item.metadata?.html_preview || '',
        from: item.metadata?.from || '',
        fromName: item.metadata?.fromName,
        timestamp: item.enviado_em || new Date().toISOString(),
        provider: item.metadata?.provider || 'unknown'
      })),
      stats: stats || {
        total: uniqueLogs.length,
        uniqueRecipients: new Set(uniqueLogs.map(l => l.destinatario_email)).size,
        providers: [...new Set(uniqueLogs.map(l => l.metadata?.provider).filter(Boolean))],
        lastEmail: uniqueLogs[0] || null
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar logs:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar logs', logs: [], stats: null },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const supabase = createAdminClient()
    
    // Limpar cache em memória
    clearTestEmailLogs()
    
    // Deletar logs de teste do banco de dados
    // Buscar IDs dos logs de teste primeiro
    const { data: testLogs } = await supabase
      .from('email_tracking')
      .select('id')
      .or('tipo_email.eq.teste_configuracao,and(tipo_email.neq.null,metadata->modo_teste.eq.true)')
    
    if (testLogs && testLogs.length > 0) {
      const ids = testLogs.map(log => log.id)
      
      // Deletar em lotes (Supabase tem limite de 1000 por vez)
      const batchSize = 1000
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize)
        const { error: deleteError } = await supabase
          .from('email_tracking')
          .delete()
          .in('id', batch)
        
        if (deleteError) {
          console.error('Erro ao deletar lote de logs:', deleteError)
          throw deleteError
        }
      }
      
      console.log(`✅ ${ids.length} logs de teste deletados do banco`)
    }
    
    return NextResponse.json({ 
      success: true,
      deleted: testLogs?.length || 0,
      message: `${testLogs?.length || 0} logs de teste foram deletados`
    })
  } catch (error: any) {
    console.error('Erro ao limpar logs:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao limpar logs' },
      { status: 500 }
    )
  }
}

