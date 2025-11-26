import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isTestMode, loadTestModeConfig } from '@/lib/email/test-mode'

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    // Buscar configuração do banco
    const { data: testModeData, error: testModeError } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('chave', 'email_test_mode')
      .single()
    
    // Forçar recarregamento
    await loadTestModeConfig()
    const isActive = await isTestMode()
    
    return NextResponse.json({
      database: {
        exists: !!testModeData,
        data: testModeData,
        error: testModeError?.message || null,
        enabled: testModeData?.valor?.enabled
      },
      cache: {
        isActive,
        source: testModeData ? 'database' : 'environment'
      },
      environment: {
        EMAIL_TEST_MODE: process.env.EMAIL_TEST_MODE,
        NODE_ENV: process.env.NODE_ENV
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

