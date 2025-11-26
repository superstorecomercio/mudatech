import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route para encurtar URLs do WhatsApp
 * GET /api/w?t=TELEFONE&d=DADOS_ENCODED
 * 
 * Redireciona para WhatsApp com mensagem pré-formatada
 * Usa dados codificados em base64 para reduzir tamanho da URL
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const telefone = searchParams.get('t');
    const dadosEncoded = searchParams.get('d');

    if (!telefone) {
      return NextResponse.json(
        { error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }

    // Limpar telefone (remover caracteres não numéricos)
    const telefoneLimpo = telefone.replace(/\D/g, '');

    // Se não tem dados codificados, apenas redireciona para WhatsApp sem mensagem
    if (!dadosEncoded) {
      const urlWhatsApp = `https://wa.me/${telefoneLimpo}`;
      return NextResponse.redirect(urlWhatsApp);
    }

    // Decodificar dados (base64)
    try {
      const dadosJson = Buffer.from(dadosEncoded, 'base64').toString('utf-8');
      const dados = JSON.parse(dadosJson);

      // Criar mensagem simplificada
      const mensagem = criarMensagemSimplificada(dados);
      
      // Criar URL do WhatsApp
      const urlWhatsApp = `https://wa.me/${telefoneLimpo}?text=${encodeURIComponent(mensagem)}`;
      
      return NextResponse.redirect(urlWhatsApp);
    } catch (err) {
      // Se falhar ao decodificar, redireciona sem mensagem
      console.error('Erro ao decodificar dados:', err);
      const urlWhatsApp = `https://wa.me/${telefoneLimpo}`;
      return NextResponse.redirect(urlWhatsApp);
    }
  } catch (error) {
    console.error('Erro na rota /api/w:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

/**
 * Cria mensagem simplificada para WhatsApp
 * Deve ser idêntica à função criarMensagemSimplificada do url-shortener.js
 */
function criarMensagemSimplificada(dados: any): string {
  const tipoImovelLabels: Record<string, string> = {
    kitnet: 'Kitnet',
    '1_quarto': 'Apto 1q',
    '2_quartos': 'Apto 2q',
    '3_mais': 'Apto 3q+',
    comercial: 'Comercial'
  };
  
  // Compatibilidade: pode vir como 'tipo' ou 'tipo_imovel'
  const tipoImovel = tipoImovelLabels[dados.tipo_imovel || dados.tipo] || dados.tipo_imovel || dados.tipo || 'Não informado';
  
  // Mensagem para empresas - versão otimizada para reduzir tamanho da URL
  let msg = `Vou mudar e preciso desse orçamento:\n\n`;
  msg += `*Orçamento enviado por MudaTech*\n`;
  
  // Adicionar código do orçamento se disponível
  if (dados.codigo_orcamento) {
    msg += `🔖 *Código:* ${dados.codigo_orcamento}\n`;
  }
  msg += `👤 ${dados.nome || 'Cliente'}\n`;
  msg += `📧 ${dados.email || 'Não informado'}\n`;
  
  // Compatibilidade: pode vir como 'origem'/'destino' ou 'cidadeOrigem'/'cidadeDestino'
  const origem = dados.cidadeOrigem || dados.origem || '';
  const estadoOrigem = dados.estadoOrigem || '';
  const destino = dados.cidadeDestino || dados.destino || '';
  const estadoDestino = dados.estadoDestino || '';
  
  msg += `📍 ${origem}${estadoOrigem ? ', ' + estadoOrigem : ''} → ${destino}${estadoDestino ? ', ' + estadoDestino : ''}\n`;
  msg += `🏠 Tipo: ${tipoImovel}\n`;
  msg += `🚪 Elevador: ${dados.tem_elevador ? 'Sim' : 'Não'}\n`;
  msg += `📦 Embalagem: ${dados.precisa_embalagem ? 'Sim' : 'Não'}\n`;
  
  // Compatibilidade: pode vir como 'distancia' ou 'distanciaKm'
  const distancia = dados.distanciaKm || dados.distancia || 0;
  msg += `📏 Distância: ${distancia}km\n`;
  msg += `💰 Faixa: R$ ${dados.precoMin || 0} - R$ ${dados.precoMax || 0}\n`;
  
  // Adicionar data estimada se houver
  if (dados.data_estimada) {
    // Formatar data (DD/MM/YYYY)
    try {
      const data = new Date(dados.data_estimada);
      if (!isNaN(data.getTime())) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        msg += `📅 Data: ${dia}/${mes}/${ano}\n`;
      }
    } catch (e) {
      // Se já estiver formatada, usar como está
      if (typeof dados.data_estimada === 'string' && dados.data_estimada.includes('/')) {
        msg += `📅 Data: ${dados.data_estimada}\n`;
      }
    }
  }
  
  msg += `\nGostaria de uma cotação personalizada.`;
  
  return msg;
}

