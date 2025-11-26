import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Buscar configuração
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('chave', 'email_config')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error
    }

    // Se não existe, retornar valores padrão
    if (!data) {
      return NextResponse.json({
        config: {
          provider: null,
          api_key: '',
          from_email: process.env.EMAIL_FROM || '',
          from_name: 'MudaTech',
          reply_to: process.env.EMAIL_REPLY_TO || '',
          ativo: false,
          testado: false
        }
      })
    }

    return NextResponse.json({
      config: data.valor
    })

  } catch (error: any) {
    console.error('Erro ao buscar configuração:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar configuração' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    // Validações
    if (!config.provider) {
      return NextResponse.json(
        { error: 'Provedor é obrigatório' },
        { status: 400 }
      )
    }

    if (!config.api_key) {
      return NextResponse.json(
        { error: 'API Key é obrigatória' },
        { status: 400 }
      )
    }

    // Validação específica para SocketLabs
    if (config.provider === 'socketlabs' && !config.server_id) {
      return NextResponse.json(
        { error: 'Server ID é obrigatório para SocketLabs' },
        { status: 400 }
      )
    }

    if (!config.from_email) {
      return NextResponse.json(
        { error: 'Email remetente é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Salvar ou atualizar configuração
    // Primeiro, verificar se existe
    const { data: existing } = await supabase
      .from('configuracoes')
      .select('id')
      .eq('chave', 'email_config')
      .single()

    let data, error
    if (existing) {
      // Atualizar
      const result = await supabase
        .from('configuracoes')
        .update({
          valor: config,
          updated_at: new Date().toISOString()
        })
        .eq('chave', 'email_config')
        .select()
        .single()
      data = result.data
      error = result.error
    } else {
      // Inserir
      const result = await supabase
        .from('configuracoes')
        .insert({
          chave: 'email_config',
          valor: config,
          descricao: 'Configuração de envio de emails'
        })
        .select()
        .single()
      data = result.data
      error = result.error
    }

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Configuração salva com sucesso',
      config: data.valor
    })

  } catch (error: any) {
    console.error('Erro ao salvar configuração:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao salvar configuração' },
      { status: 500 }
    )
  }
}

