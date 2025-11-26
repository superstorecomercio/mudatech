import { NextResponse } from 'next/server'
import { isTestMode, setTestModeConfig } from '@/lib/email/test-mode'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Buscar configuração do banco
    const supabase = createAdminClient()
    const { data: testModeData } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'email_test_mode')
      .single()

    const enabled = testModeData?.valor?.enabled
    
    // Buscar email de teste da configuração de email
    let testEmail: string | undefined
    try {
      const { data: emailConfig } = await supabase
        .from('configuracoes')
        .select('valor')
        .eq('chave', 'email_config')
        .single()

      if (emailConfig?.valor?.test_email) {
        testEmail = emailConfig.valor.test_email
      }
    } catch (error) {
      // Ignorar erro, usar padrão
    }

    // Se não tem configuração no banco, usar lógica padrão
    const active = enabled !== undefined ? enabled : isTestMode()
    
    // Atualizar cache
    setTestModeConfig(active, testEmail)
    
    return NextResponse.json({
      active,
      testEmail: testEmail || null,
      source: enabled !== undefined ? 'database' : 'environment'
    })
  } catch (error) {
    // Em caso de erro, usar lógica padrão
    return NextResponse.json({
      active: isTestMode(),
      testEmail: null,
      source: 'environment'
    })
  }
}

