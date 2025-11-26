import { NextResponse } from 'next/server'
import { isTestMode, setTestModeConfig, loadTestModeConfig } from '@/lib/email/test-mode'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Forçar recarregamento da configuração do banco
    await loadTestModeConfig()
    
    // Buscar configuração do banco
    const supabase = createAdminClient()
    const { data: testModeData } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'email_test_mode')
      .single()

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

    // Se encontrou configuração no banco, usar ela (mesmo que seja false)
    let active: boolean
    let source: string
    
    if (testModeData && testModeData.valor && testModeData.valor.enabled !== undefined) {
      // Configuração explícita no banco
      active = testModeData.valor.enabled === true
      source = 'database'
      console.log('📧 [Test Mode Status] Usando configuração do banco:', active)
    } else {
      // Não há configuração no banco, usar lógica padrão (assíncrona)
      active = await isTestMode()
      source = 'environment'
      console.log('📧 [Test Mode Status] Usando configuração de ambiente:', active)
    }
    
    // Atualizar cache com o valor correto
    setTestModeConfig(active, testEmail)
    
    return NextResponse.json({
      active,
      testEmail: testEmail || null,
      source
    })
  } catch (error) {
    // Em caso de erro, usar lógica padrão (assíncrona)
    const active = await isTestMode()
    return NextResponse.json({
      active,
      testEmail: null,
      source: 'environment'
    })
  }
}

