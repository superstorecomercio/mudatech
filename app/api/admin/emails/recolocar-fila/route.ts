import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { orcamentoId, empresaId } = await request.json()

    if (!orcamentoId) {
      return NextResponse.json(
        { error: 'ID do orçamento é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Se empresaId foi fornecido, recolocar apenas essa empresa
    if (empresaId) {
      // Verificar se o vínculo existe
      const { data: vinculo, error: vinculoError } = await supabase
        .from('orcamentos_campanhas')
        .select('id, status_envio_email')
        .eq('id', empresaId)
        .eq('orcamento_id', orcamentoId)
        .single()

      if (vinculoError || !vinculo) {
        return NextResponse.json(
          { error: 'Vínculo empresa-orçamento não encontrado' },
          { status: 404 }
        )
      }

      // Recolocar na fila (resetar status e limpar erro)
      const { error: updateError } = await supabase
        .from('orcamentos_campanhas')
        .update({
          status_envio_email: 'na_fila',
          ultimo_erro_envio: null
          // Não resetar tentativas_envio para manter histórico
        })
        .eq('id', empresaId)

      if (updateError) {
        return NextResponse.json(
          { error: 'Erro ao recolocar empresa na fila' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Empresa recolocada na fila com sucesso'
      })
    }

    // Se não foi fornecido empresaId, recolocar todas as empresas enviadas/erro
    const { data: vinculos, error: vinculosError } = await supabase
      .from('orcamentos_campanhas')
      .select('id')
      .eq('orcamento_id', orcamentoId)
      .in('status_envio_email', ['enviado', 'erro'])

    if (vinculosError) {
      return NextResponse.json(
        { error: 'Erro ao buscar empresas' },
        { status: 500 }
      )
    }

    if (!vinculos || vinculos.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma empresa para recolocar na fila' },
        { status: 400 }
      )
    }

    // Recolocar todas na fila
    const ids = vinculos.map(v => v.id)
    const { error: updateError } = await supabase
      .from('orcamentos_campanhas')
      .update({
        status_envio_email: 'na_fila',
        ultimo_erro_envio: null
      })
      .in('id', ids)

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao recolocar empresas na fila' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${vinculos.length} empresa(s) recolocada(s) na fila com sucesso`,
      empresasRecolocadas: vinculos.length
    })

  } catch (error: any) {
    console.error('Erro ao recolocar na fila:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao recolocar na fila' },
      { status: 500 }
    )
  }
}

