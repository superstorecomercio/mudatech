import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * PATCH /api/admin/empresas/[id]
 * Atualiza dados cadastrais da empresa
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const body = await request.json()

    console.log('📥 [API] Atualizando empresa:', { id, body })

    // Preparar dados para atualização (apenas campos permitidos)
    const empresaData: any = {}

    if (body.cnpj !== undefined) {
      // Remover formatação do CNPJ
      empresaData.cnpj = body.cnpj.replace(/\D/g, '') || null
    }
    if (body.razao_social !== undefined) empresaData.razao_social = body.razao_social || null
    if (body.nome_fantasia !== undefined) empresaData.nome_fantasia = body.nome_fantasia || null
    if (body.nome_responsavel !== undefined) empresaData.nome_responsavel = body.nome_responsavel || null
    if (body.email_responsavel !== undefined) empresaData.email_responsavel = body.email_responsavel || null
    if (body.telefone_responsavel !== undefined) {
      // Remover formatação do telefone
      empresaData.telefone_responsavel = body.telefone_responsavel.replace(/\D/g, '') || null
    }
    if (body.endereco_completo !== undefined) empresaData.endereco_completo = body.endereco_completo || null
    if (body.cidade !== undefined) empresaData.cidade = body.cidade || null
    if (body.estado !== undefined) empresaData.estado = body.estado?.toUpperCase().slice(0, 2) || null
    if (body.cep !== undefined) {
      // Remover formatação do CEP
      empresaData.cep = body.cep.replace(/\D/g, '') || null
    }
    if (body.ativo !== undefined) {
      empresaData.ativo = body.ativo
    }

    // Atualizar empresa
    const { data, error } = await supabase
      .from('empresas')
      .update(empresaData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ [API] Erro ao atualizar empresa:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar empresa: ' + error.message },
        { status: 500 }
      )
    }

    console.log('✅ [API] Empresa atualizada com sucesso! ID:', data.id)

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error('❌ [API] Erro inesperado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/empresas/[id]
 * Busca dados da empresa
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    console.error('❌ [API] Erro inesperado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
