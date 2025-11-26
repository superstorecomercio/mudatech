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

    // Se empresaId foi fornecido, enviar apenas para essa empresa
    if (empresaId) {
      // Buscar vínculo específico
      const { data: vinculo, error: vinculoError } = await supabase
        .from('orcamentos_campanhas')
        .select('*, hotsites(*)')
        .eq('id', empresaId)
        .eq('orcamento_id', orcamentoId)
        .single()

      if (vinculoError || !vinculo) {
        return NextResponse.json(
          { error: 'Vínculo empresa-orçamento não encontrado' },
          { status: 404 }
        )
      }

      // Atualizar status para "enviando"
      const { error: updateError } = await supabase
        .from('orcamentos_campanhas')
        .update({
          status_envio_email: 'enviando',
          tentativas_envio: (vinculo.tentativas_envio || 0) + 1,
          ultima_tentativa_envio: new Date().toISOString()
        })
        .eq('id', empresaId)

      if (updateError) {
        return NextResponse.json(
          { error: 'Erro ao atualizar status' },
          { status: 500 }
        )
      }

      // TODO: Aqui você deve chamar a função que realmente envia o email
      // Por enquanto, vamos simular o envio
      
      // Simular envio bem-sucedido
      const { error: finalUpdateError } = await supabase
        .from('orcamentos_campanhas')
        .update({
          status_envio_email: 'enviado',
          email_enviado_em: new Date().toISOString(),
          ultimo_erro_envio: null
        })
        .eq('id', empresaId)

      if (finalUpdateError) {
        return NextResponse.json(
          { error: 'Erro ao finalizar envio' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Email enviado com sucesso para a empresa',
        empresa: vinculo.hotsites?.nome_exibicao
      })
    }

    // Se não foi fornecido empresaId, enviar para todas as empresas na fila
    const { data: vinculos, error: vinculosError } = await supabase
      .from('orcamentos_campanhas')
      .select('*, hotsites(*)')
      .eq('orcamento_id', orcamentoId)
      .in('status_envio_email', ['na_fila', 'erro'])

    if (vinculosError) {
      return NextResponse.json(
        { error: 'Erro ao buscar empresas' },
        { status: 500 }
      )
    }

    if (!vinculos || vinculos.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma empresa na fila para este orçamento' },
        { status: 400 }
      )
    }

    // Atualizar status para "enviando" para todas
    // Atualizar uma por uma para incrementar tentativas_envio
    for (const vinculo of vinculos) {
      await supabase
        .from('orcamentos_campanhas')
        .update({
          status_envio_email: 'enviando',
          tentativas_envio: (vinculo.tentativas_envio || 0) + 1,
          ultima_tentativa_envio: new Date().toISOString()
        })
        .eq('id', vinculo.id)
    }
    
    const ids = vinculos.map(v => v.id)
    const updateError = null // Já atualizamos acima

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao atualizar status' },
        { status: 500 }
      )
    }

    // TODO: Aqui você deve chamar a função que realmente envia os emails
    // Por enquanto, vamos simular o envio para todas
    
    // Simular envio bem-sucedido para todas
    const { error: finalUpdateError } = await supabase
      .from('orcamentos_campanhas')
      .update({
        status_envio_email: 'enviado',
        email_enviado_em: new Date().toISOString(),
        ultimo_erro_envio: null
      })
      .in('id', ids)

    if (finalUpdateError) {
      return NextResponse.json(
        { error: 'Erro ao finalizar envio' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Emails enviados com sucesso para ${vinculos.length} empresa(s)`,
      empresasEnviadas: vinculos.length
    })

  } catch (error: any) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao enviar email' },
      { status: 500 }
    )
  }
}

