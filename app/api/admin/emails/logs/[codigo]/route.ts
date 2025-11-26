import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const resolvedParams = await params
    const codigo = resolvedParams.codigo

    if (!codigo) {
      return NextResponse.json(
        { error: 'Código de rastreamento é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('email_tracking')
      .select(`
        *,
        orcamentos(*),
        hotsites(*)
      `)
      .eq('codigo_rastreamento', codigo.toUpperCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Log não encontrado', codigo },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Erro ao buscar log:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao buscar log',
        details: error.details || null
      },
      { status: 500 }
    )
  }
}

