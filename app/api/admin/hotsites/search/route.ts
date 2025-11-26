import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/hotsites/search?q=termo
 * Busca hotsites por nome (busca sob demanda)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('q') || '';

    if (!searchTerm.trim()) {
      return NextResponse.json({ hotsites: [], total: 0 });
    }

    const supabase = createAdminClient();

    // Buscar hotsites que contenham o termo no nome
    const { data: hotsites, error } = await supabase
      .from('hotsites')
      .select('id, nome_exibicao, email, descricao, endereco, cidade, estado, logo_url, foto1_url')
      .ilike('nome_exibicao', `%${searchTerm}%`)
      .order('nome_exibicao', { ascending: true })
      .limit(100); // Limitar a 100 resultados para performance

    if (error) {
      console.error('❌ [API Hotsites Search] Erro ao buscar:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar hotsites', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hotsites: hotsites || [],
      total: hotsites?.length || 0
    });
  } catch (error: any) {
    console.error('❌ [API Hotsites Search] Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}

