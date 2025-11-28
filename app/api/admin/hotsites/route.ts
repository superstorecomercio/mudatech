import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    console.log('📥 [API] Recebendo requisição para criar hotsite:', {
      nome_exibicao: body.nome_exibicao,
      cidade_id: body.cidade_id,
    });

    // Validação básica
    if (!body.nome_exibicao || !body.cidade_id) {
      console.error('❌ [API] Campos obrigatórios faltando');
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome_exibicao, cidade_id' },
        { status: 400 }
      );
    }

    // Buscar dados da cidade na tabela cidades
    const { data: cidadeData, error: cidadeError } = await supabase
      .from('cidades')
      .select('nome, estado')
      .eq('id', body.cidade_id)
      .single();

    if (cidadeError || !cidadeData) {
      console.error('❌ [API] Cidade não encontrada:', cidadeError);
      return NextResponse.json(
        { error: 'Cidade inválida' },
        { status: 400 }
      );
    }

    // Criar empresa automaticamente com dados placeholder
    // Gerar slug único baseado no nome + timestamp para garantir unicidade
    const slugBase = body.nome_exibicao
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 200); // Limitar tamanho
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const slug = `${slugBase}-${timestamp}-${randomSuffix}`;

    const empresaData: any = {
      nome: body.nome_exibicao, // Campo obrigatório da tabela existente
      slug: slug, // Campo obrigatório da tabela existente (UNIQUE)
      cnpj: null,
      razao_social: `Empresa - ${body.nome_exibicao}`,
      nome_fantasia: body.nome_exibicao,
      nome_responsavel: 'A preencher',
      email_responsavel: body.email || null,
      telefone_responsavel: body.telefone1 || null,
      endereco_completo: body.endereco || null,
      cidade: cidadeData.nome,
      estado: cidadeData.estado,
      cep: null,
      ativo: true
    };

    // Adicionar campos opcionais que podem existir na tabela original
    if (body.email) empresaData.email = body.email;
    if (body.telefone1) empresaData.telefones = [body.telefone1];
    if (body.endereco) empresaData.endereco = body.endereco;
    if (body.cidade_id) empresaData.cidade_id = body.cidade_id;

    console.log('💾 [API] Criando empresa automaticamente...', empresaData);

    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .insert(empresaData)
      .select()
      .single();

    if (empresaError) {
      console.error('❌ [API] Erro ao criar empresa:', empresaError);
      return NextResponse.json(
        { error: 'Erro ao criar empresa: ' + empresaError.message },
        { status: 500 }
      );
    }

    console.log('✅ [API] Empresa criada com sucesso! ID:', empresa.id);

    // Preparar dados para inserção do hotsite
    const hotsiteData = {
      nome_exibicao: body.nome_exibicao,
      descricao: body.descricao || null,
      endereco: body.endereco || null,
      cidade_id: body.cidade_id,
      cidade: cidadeData.nome, // Sincroniza com tabela cidades
      estado: cidadeData.estado, // Sincroniza com tabela cidades
      empresa_id: empresa.id, // Vincular empresa criada
      tipoempresa: body.tipoempresa || 'Empresa de Mudança',
      telefone1: body.telefone1 || null,
      telefone2: body.telefone2 || null,
      logo_url: body.logo_url || null,
      foto1_url: body.foto1_url || null,
      foto2_url: body.foto2_url || null,
      foto3_url: body.foto3_url || null,
      servicos: body.servicos || null,
      descontos: body.descontos || null,
      formas_pagamento: body.formas_pagamento || null,
      highlights: body.highlights || null,
    };

    console.log('💾 [API] Inserindo hotsite no banco...', hotsiteData);

    // Inserir hotsite no banco
    const { data, error } = await supabase
      .from('hotsites')
      .insert(hotsiteData)
      .select(`
        *,
        empresa:empresas(*)
      `)
      .single();

    if (error) {
      console.error('❌ [API] Erro ao criar hotsite:', error);
      // Se falhar, tentar deletar a empresa criada
      await supabase.from('empresas').delete().eq('id', empresa.id);
      return NextResponse.json(
        { error: 'Erro ao criar hotsite: ' + error.message },
        { status: 500 }
      );
    }

    console.log('✅ [API] Hotsite criado com sucesso! ID:', data.id);

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('❌ [API] Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
