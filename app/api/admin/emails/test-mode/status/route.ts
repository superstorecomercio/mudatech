import { NextResponse } from 'next/server'
import { isTestMode } from '@/lib/email/test-mode'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Buscar configuração do banco
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'email_test_mode')
      .single()

    const enabled = data?.valor?.enabled
    
    // Se não tem configuração no banco, usar lógica padrão
    const active = enabled !== undefined ? enabled : isTestMode()
    
    return NextResponse.json({
      active,
      source: enabled !== undefined ? 'database' : 'environment'
    })
  } catch (error) {
    // Em caso de erro, usar lógica padrão
    return NextResponse.json({
      active: isTestMode(),
      source: 'environment'
    })
  }
}

