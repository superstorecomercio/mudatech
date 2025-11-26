import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { setTestModeConfig, resetTestModeConfig } from '@/lib/email/test-mode'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Buscar configuração do modo de teste
    const { data, error } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'email_test_mode')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    const enabled = data?.valor?.enabled || false

    // Atualizar cache
    setTestModeConfig(enabled)

    return NextResponse.json({
      enabled
    })
  } catch (error: any) {
    console.error('Erro ao buscar configuração do modo de teste:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar configuração' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json()

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Parâmetro "enabled" deve ser um boolean' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Salvar ou atualizar configuração
    const { data: existing } = await supabase
      .from('configuracoes')
      .select('id')
      .eq('chave', 'email_test_mode')
      .single()

    let data, error
    if (existing) {
      // Atualizar
      const result = await supabase
        .from('configuracoes')
        .update({
          valor: { enabled },
          updated_at: new Date().toISOString()
        })
        .eq('chave', 'email_test_mode')
        .select()
        .single()
      data = result.data
      error = result.error
    } else {
      // Inserir
      const result = await supabase
        .from('configuracoes')
        .insert({
          chave: 'email_test_mode',
          valor: { enabled },
          descricao: 'Configuração do modo de teste de emails'
        })
        .select()
        .single()
      data = result.data
      error = result.error
    }

    if (error) {
      throw error
    }

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

    // Invalidar cache e atualizar com nova configuração
    resetTestModeConfig()
    setTestModeConfig(enabled, testEmail)

    console.log('✅ [Test Mode Toggle] Configuração salva:', { enabled, testEmail })

    return NextResponse.json({
      success: true,
      enabled,
      message: enabled ? 'Modo de teste ativado' : 'Modo de teste desativado'
    })
  } catch (error: any) {
    console.error('Erro ao salvar configuração do modo de teste:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao salvar configuração' },
      { status: 500 }
    )
  }
}

