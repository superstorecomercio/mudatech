import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { processEmailTemplate } from '@/lib/email/template-service'
import { htmlToTextServer } from '@/lib/utils/html-to-text'

export async function POST(request: NextRequest) {
  try {
    const { orcamentoId, empresaId } = await request.json()

    if (!orcamentoId || !empresaId) {
      return NextResponse.json(
        { error: 'ID do orçamento e empresa são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Buscar orçamento completo
    const { data: orcamento, error: orcamentoError } = await supabase
      .from('orcamentos')
      .select('*')
      .eq('id', orcamentoId)
      .single()

    if (orcamentoError || !orcamento) {
      return NextResponse.json(
        { error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    // Buscar vínculo empresa-orçamento
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

    const hotsite = vinculo.hotsites

    // Preparar variáveis para o template
    const tipoImovelLabels: Record<string, string> = {
      casa: 'Casa',
      apartamento: 'Apartamento',
      empresa: 'Empresa'
    }

    const tipoImovel = tipoImovelLabels[orcamento.tipo_imovel] || orcamento.tipo_imovel

    const variables = {
      codigo_orcamento: orcamento.codigo_orcamento || '',
      nome_cliente: orcamento.nome_cliente,
      email_cliente: orcamento.email_cliente,
      telefone_cliente: orcamento.telefone_cliente || orcamento.whatsapp,
      origem_completo: orcamento.origem_completo,
      destino_completo: orcamento.destino_completo,
      tipo_imovel: tipoImovel,
      metragem: orcamento.metragem || 'Não informado',
      distancia_km: orcamento.distancia_km?.toString() || '0',
      preco_min: orcamento.preco_min?.toLocaleString('pt-BR') || '0',
      preco_max: orcamento.preco_max?.toLocaleString('pt-BR') || '0',
      data_estimada: orcamento.data_estimada 
        ? new Date(orcamento.data_estimada).toLocaleDateString('pt-BR')
        : 'Não informado',
      lista_objetos: orcamento.lista_objetos || '',
      empresa_nome: hotsite?.nome_exibicao || '',
      empresa_email: hotsite?.email || ''
    }

    // Processar template
    const resultado = await processEmailTemplate('orcamento_empresa', variables)

    if (!resultado) {
      return NextResponse.json(
        { error: 'Template de email não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Converter HTML para texto puro
    const texto = htmlToTextServer(resultado.html)
    
    // Log para debug
    console.log('📧 [Preview] HTML length:', resultado.html.length)
    console.log('📧 [Preview] Texto length:', texto.length)
    console.log('📧 [Preview] Texto preview:', texto.substring(0, 200))

    return NextResponse.json({
      success: true,
      assunto: resultado.assunto,
      html: resultado.html,
      texto: texto || 'Erro ao converter HTML para texto',
      codigo_rastreamento: resultado.codigoRastreamento,
      destinatario: hotsite?.email,
      empresa: hotsite?.nome_exibicao
    })

  } catch (error: any) {
    console.error('Erro ao gerar preview do email:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar preview do email' },
      { status: 500 }
    )
  }
}

