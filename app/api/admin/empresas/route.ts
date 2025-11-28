import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/empresas
 * Lista todas as empresas com informações relacionadas
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('empresas')
      .select(`
        *,
        cidade:cidades(id, nome, slug, estado)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Busca por nome, CNPJ, razão social ou nome fantasia
    if (search) {
      query = query.or(
        `nome.ilike.%${search}%,cnpj.ilike.%${search}%,razao_social.ilike.%${search}%,nome_fantasia.ilike.%${search}%`
      )
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ [API] Erro ao buscar empresas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar empresas: ' + error.message },
        { status: 500 }
      )
    }

    // Buscar hotsites para cada empresa
    const empresasComHotsites = await Promise.all(
      (data || []).map(async (empresa: any) => {
        const { data: hotsites } = await supabase
          .from('hotsites')
          .select('id, nome_exibicao, slug, ativo')
          .eq('empresa_id', empresa.id)
        
        return {
          ...empresa,
          hotsites: hotsites || []
        }
      })
    )

    // Contar total de empresas (para paginação)
    let countQuery = supabase.from('empresas').select('id', { count: 'exact', head: true })
    if (search) {
      countQuery = countQuery.or(
        `nome.ilike.%${search}%,cnpj.ilike.%${search}%,razao_social.ilike.%${search}%,nome_fantasia.ilike.%${search}%`
      )
    }
    const { count } = await countQuery

    return NextResponse.json({
      empresas: empresasComHotsites,
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('❌ [API] Erro inesperado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

