import { NextResponse } from 'next/server'
import { getTestEmailLogs, getTestEmailStats, clearTestEmailLogs } from '@/lib/email/test-mode'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const logs = await getTestEmailLogs()
    const stats = await getTestEmailStats()
    
    return NextResponse.json({
      logs: logs, // Já vem ordenado do banco
      stats
    })
  } catch (error: any) {
    console.error('Erro ao buscar logs:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar logs' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Limpar cache em memória
    clearTestEmailLogs()
    
    // Limpar logs de teste do banco (opcional - você pode querer manter histórico)
    // const supabase = createAdminClient()
    // await supabase
    //   .from('email_tracking')
    //   .delete()
    //   .eq('status_envio', 'enviado')
    //   .or('template_tipo.eq.teste_configuracao,metadata->modo_teste.eq.true')
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao limpar logs' },
      { status: 500 }
    )
  }
}

