import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { criarOrcamentoENotificar } from '@/lib/db/queries/orcamentos';
import { logger } from '@/lib/utils/logger';
import { checkRateLimit, recordAttempt, getIdentifier, checkDuplicateOrcamento } from '@/lib/utils/rateLimiter';

type TipoImovel = 'kitnet' | '1_quarto' | '2_quartos' | '3_mais' | 'comercial';

interface CalculoRequest {
  origem: string;
  destino: string;
  tipoImovel: TipoImovel;
  temElevador: 'sim' | 'nao';
  andar: number;
  precisaEmbalagem: 'sim' | 'nao';
  nome: string;
  email: string;
  whatsapp: string;
  dataEstimada?: string;
  listaObjetos?: string;
  arquivoListaUrl?: string;
  arquivoListaNome?: string;
}

interface CalculoResponse {
  precoMin: number;
  precoMax: number;
  faixaTexto: string;
  distanciaKm?: number;
  mensagemIA?: string;
  cidadeOrigem?: string;
  estadoOrigem?: string;
  cidadeDestino?: string;
  estadoDestino?: string;
}

// Todas as funções de cálculo de distância foram removidas.
// A IA agora calcula TUDO, incluindo a distância entre origem e destino.

/**
 * Fallback MUITO básico caso a IA não esteja disponível
 * NÃO RECOMENDADO - Configure a OpenAI API Key para ter resultados precisos
 */
async function calcularOrcamentoFallback(params: CalculoRequest): Promise<CalculoResponse> {
  logger.warn('api-calculadora', '❌ OPENAI_API_KEY não configurada! Usando fallback básico.', params);
  
  const tiposImovelLabels: Record<TipoImovel, string> = {
    kitnet: 'kitnet',
    '1_quarto': 'apartamento de 1 quarto',
    '2_quartos': 'apartamento de 2 quartos',
    '3_mais': 'apartamento de 3+ quartos ou casa',
    comercial: 'mudança comercial',
  };

  // Estimativa MUITO genérica (não confiável!)
  const valorBase = 1500; // Valor médio genérico
  const precoMin = 800;
  const precoMax = 3500;

  const faixaTexto = `Para sua mudança de ${tiposImovelLabels[params.tipoImovel]} de ${params.origem} para ${params.destino}, ` +
    `o valor estimado fica entre R$ ${precoMin.toLocaleString('pt-BR')} e R$ ${precoMax.toLocaleString('pt-BR')}. ` +
    `⚠️ ATENÇÃO: Esta é uma estimativa genérica. Configure a OpenAI API Key para ter orçamentos precisos.`;

  // Tentar extrair cidade e estado (fallback simples)
  const extrairEstado = (texto: string): string => {
    const estados = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    
    const textoUpper = texto.toUpperCase();
    for (const estado of estados) {
      if (textoUpper.includes(estado)) {
        return estado;
      }
    }
    return 'SP'; // Padrão
  }

  const extrairCidade = (texto: string): string => {
    return texto.split(',')[0].trim() || texto;
  }

  return {
    precoMin,
    precoMax,
    faixaTexto,
    cidadeOrigem: extrairCidade(params.origem),
    estadoOrigem: extrairEstado(params.origem),
    cidadeDestino: extrairCidade(params.destino),
    estadoDestino: extrairEstado(params.destino),
  };
}

/**
 * Calcula o orçamento usando IA (OpenAI GPT-4o-mini)
 * A IA analisa TODOS os dados, calcula a distância e retorna uma faixa de preço precisa
 */
async function calcularOrcamentoComIA(params: CalculoRequest): Promise<CalculoResponse | null> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    console.warn('⚠️ OPENAI_API_KEY não configurada.');
    return null;
  }

  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const tiposImovelLabels: Record<TipoImovel, string> = {
      kitnet: 'kitnet',
      '1_quarto': 'apartamento de 1 quarto',
      '2_quartos': 'apartamento de 2 quartos',
      '3_mais': 'apartamento de 3+ quartos ou casa',
      comercial: 'mudança comercial (escritório, loja, etc.)',
    };

    const prompt = `Você é um especialista em orçamentos de mudanças residenciais no Brasil com amplo conhecimento do mercado atual e geografia brasileira.

Analise os dados abaixo e retorne:
1. A distância REAL em km entre origem e destino (use seu conhecimento geográfico)
2. Uma estimativa de preço REALISTA baseada no mercado brasileiro atual

DADOS DA MUDANÇA:
- Origem digitada pelo usuário: "${params.origem}"
- Destino digitado pelo usuário: "${params.destino}"
- Tipo de imóvel: ${tiposImovelLabels[params.tipoImovel]}
- Tem elevador na origem/destino: ${params.temElevador === 'sim' ? 'Sim' : 'Não'}
- Andar: ${params.andar}º
- Precisa de embalagem e desmontagem completa: ${params.precisaEmbalagem === 'sim' ? 'Sim' : 'Não'}

⚠️ INSTRUÇÕES CRÍTICAS PARA INTERPRETAR LOCALIDADES:

1. **CORRIJA ERROS DE DIGITAÇÃO E INTERPRETE O CONTEXTO:**
   - "MOEM" = Moema (bairro de São Paulo, SP)
   - "Santana SP" = Santana (bairro de São Paulo, SP)
   - "SP" = São Paulo, SP (capital)
   - "RJ" = Rio de Janeiro, RJ (capital)
   - "BH" = Belo Horizonte, MG
   - Se ambos têm "SP", provavelmente são da mesma cidade/região
   - Se menciona bairro, procure a cidade correspondente
   - Tolere variações de escrita (acentos, maiúsculas, abreviações)

2. **IDENTIFIQUE O TIPO DE MUDANÇA:**
   - **Mesma cidade (bairros diferentes)**: 5-25 km
     * Ex: Moema → Santana (São Paulo) = ~12 km
     * Ex: Copacabana → Tijuca (Rio de Janeiro) = ~15 km
   - **Mesma região metropolitana**: 30-80 km
     * Ex: São Paulo → Guarulhos = ~25 km
     * Ex: São Paulo → Santo André = ~30 km
   - **Mesmo estado (cidades diferentes)**: 80-400 km
     * Ex: São Paulo → Campinas = ~100 km
     * Ex: São Paulo → Santos = ~80 km
   - **Estados próximos**: 400-800 km
     * Ex: São Paulo → Curitiba = ~400 km
     * Ex: São Paulo → Rio de Janeiro = ~430 km
   - **Interestadual longa distância**: 800+ km
     * Ex: São Paulo → Porto Alegre = ~1.100 km
     * Ex: São Paulo → Salvador = ~1.960 km

3. **CÁLCULO DE PREÇO - CONSIDERE TODOS OS CUSTOS:**
   
   **CUSTOS BASE POR TIPO DE IMÓVEL (mão de obra + veículo):**
   - Kitnet: R$ 800-1.200 (2 pessoas, veículo pequeno)
   - 1 quarto: R$ 1.200-1.800 (2-3 pessoas, veículo médio)
   - 2 quartos: R$ 1.800-2.500 (3-4 pessoas, veículo médio/grande)
   - 3+ quartos/Casa: R$ 2.500-4.000 (4+ pessoas, veículo grande)
   - Comercial: R$ 2.000-5.000+ (depende do volume)
   
   **CUSTOS ADICIONAIS:**
   - Combustível: R$ 0,80-1,20 por km (ida e volta = 2x a distância)
   - Pedágios: R$ 50-200 dependendo da rota (interestadual)
   - Embalagem profissional completa: +R$ 800-2.000 (papelão, plástico bolha, caixas, mão de obra)
   - Desmontagem/Remontagem: +R$ 300-800 (móveis, eletrodomésticos)
   - Sem elevador (3º andar+): +R$ 300-600 (esforço físico extra)
   - Sem elevador (5º andar+): +R$ 500-1.000 (risco e dificuldade)
   - Seguro de carga: +R$ 200-500 (recomendado para mudanças de valor)
   - Pernoite (mudanças >600km): +R$ 400-800 (diárias, alimentação)
   - Margem de lucro empresa: 20-30% sobre custos totais
   
   **REGRAS IMPORTANTES:**
   - Faixa deve ter mínimo 30% de diferença entre min e max
   - Valores devem refletir mercado brasileiro 2024/2025 (inflação, combustível caro)
   - Mudanças interestaduais: SEMPRE incluir custos de logística, pedágios e possíveis pernoites
   - Preços muito baixos indicam empresa não profissional ou sem seguro

4. **EXEMPLOS DE REFERÊNCIA REALISTAS (2024/2025):**
   - Mesma cidade (12 km, kitnet, com elevador, sem embalagem): R$ 1.200 - R$ 1.600
   - Mesma cidade (12 km, 2 quartos, sem elevador 3º andar, sem embalagem): R$ 1.800 - R$ 2.500
   - Mesma cidade (12 km, 2 quartos, com elevador, COM embalagem completa): R$ 2.800 - R$ 3.800
   - Interestadual (430 km, 2 quartos, com elevador, com embalagem): R$ 4.500 - R$ 6.500
   - Interestadual (1.100 km, 3+ quartos, sem elevador 4º andar, com embalagem): R$ 8.000 - R$ 12.000

Retorne APENAS um JSON válido neste formato exato:
{
  "distanciaKm": 12,
  "precoMin": 800,
  "precoMax": 1200,
  "explicacao": "Explicação clara (máx 3 frases) mencionando: (1) localidades interpretadas, (2) distância calculada, (3) principais fatores de custo.",
  "cidadeOrigem": "São Paulo",
  "estadoOrigem": "SP",
  "cidadeDestino": "São Paulo",
  "estadoDestino": "SP"
}

⚠️ IMPORTANTE: Sempre retorne cidade e estado CORRIGIDOS e ESTRUTURADOS, mesmo que o usuário tenha digitado errado.

EXEMPLO DE RESPOSTA CORRETA:
{
  "distanciaKm": 12,
  "precoMin": 850,
  "precoMax": 1150,
  "explicacao": "Mudança entre Moema e Santana, ambos bairros de São Paulo (12km). Distância curta dentro da mesma cidade, acesso facilitado com elevador. A faixa considera variação entre empresas mais econômicas e premium.",
  "cidadeOrigem": "São Paulo",
  "estadoOrigem": "SP",
  "cidadeDestino": "São Paulo",
  "estadoDestino": "SP"
}`;

    logger.info('api-calculadora', '🤖 Consultando IA para calcular distância e orçamento...', params);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Modelo mais rápido e barato
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em orçamentos de mudanças residenciais e geografia brasileira. Seja inteligente ao interpretar localidades, tolerando erros de digitação, abreviações e variações. Retorne sempre JSON válido.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3, // Temperatura mais baixa para maior consistência e preços mais realistas
      max_tokens: 600, // Mais tokens para considerar todos os fatores
      response_format: { type: 'json_object' },
    });

    const resposta = completion.choices[0].message.content;
    if (!resposta) {
      logger.warn('api-calculadora', '❌ IA retornou resposta vazia', params);
      return null;
    }

    const resultado = JSON.parse(resposta);
    logger.info('api-calculadora', '✅ IA calculou orçamento completo', resultado);

    // Validação e ajuste de preços mínimos realistas
    const distanciaKm = resultado.distanciaKm || 0;
    
    // Calcular preço mínimo baseado em distância e tipo
    const precosMinimosBase: Record<TipoImovel, number> = {
      kitnet: 1000,
      '1_quarto': 1400,
      '2_quartos': 1800,
      '3_mais': 2500,
      comercial: 2000,
    };
    
    const precoMinimoBase = precosMinimosBase[params.tipoImovel] || 1500;
    
    // Adicionar custos por distância (combustível ida e volta)
    const custoCombustivel = distanciaKm * 2 * 1.0; // R$ 1,00 por km (ida e volta)
    
    // Adicionar custos adicionais
    let custosAdicionais = 0;
    if (params.precisaEmbalagem === 'sim') {
      custosAdicionais += 1000; // Embalagem profissional
    }
    if (params.temElevador === 'nao' && params.andar >= 3) {
      custosAdicionais += params.andar >= 5 ? 600 : 400; // Sem elevador
    }
    if (distanciaKm > 600) {
      custosAdicionais += 600; // Pernoite para mudanças longas
    }
    if (distanciaKm > 100) {
      custosAdicionais += 150; // Pedágios estimados
    }
    
    // Preço mínimo realista = base + combustível + adicionais + margem (20%)
    const precoMinimoCalculado = Math.round((precoMinimoBase + custoCombustivel + custosAdicionais) * 1.2);
    
    // Garantir que os preços retornados pela IA não sejam muito baixos
    if (resultado.precoMin < precoMinimoCalculado * 0.8) {
      logger.warn('api-calculadora', '⚠️ Preço mínimo muito baixo detectado. Ajustando...', {
        precoMinOriginal: resultado.precoMin,
        precoMinimoCalculado,
        ajuste: 'aplicado'
      });
      resultado.precoMin = Math.round(precoMinimoCalculado * 0.9); // 90% do mínimo calculado
    }
    
    // Garantir que precoMax seja pelo menos 30% maior que precoMin
    const diferencaMinima = resultado.precoMin * 0.3;
    if (resultado.precoMax < resultado.precoMin + diferencaMinima) {
      resultado.precoMax = Math.round(resultado.precoMin + diferencaMinima);
    }
    
    const distanciaTexto =
      distanciaKm >= 500
        ? `aproximadamente ${distanciaKm} km (mudança interestadual)`
        : distanciaKm >= 100
        ? `aproximadamente ${distanciaKm} km`
        : `${distanciaKm} km`;

    const faixaTexto = `Para sua mudança de ${tiposImovelLabels[params.tipoImovel]} de ${params.origem} para ${params.destino} ` +
      `(${distanciaTexto}), o valor estimado fica entre R$ ${resultado.precoMin.toLocaleString('pt-BR')} e R$ ${resultado.precoMax.toLocaleString('pt-BR')}.`;

    return {
      precoMin: Math.round(resultado.precoMin),
      precoMax: Math.round(resultado.precoMax),
      faixaTexto,
      distanciaKm,
      mensagemIA: resultado.explicacao,
      cidadeOrigem: resultado.cidadeOrigem || params.origem,
      estadoOrigem: resultado.estadoOrigem || 'SP',
      cidadeDestino: resultado.cidadeDestino || params.destino,
      estadoDestino: resultado.estadoDestino || 'SP',
    };
  } catch (error) {
    logger.error('api-calculadora', '❌ Erro ao calcular com IA', error instanceof Error ? error : new Error(String(error)), params);
    return null;
  }
}

/**
 * Rota POST: /api/calcular-orcamento
 * 
 * Recebe os dados da mudança e retorna a faixa de preço estimada
 */
export async function POST(request: NextRequest) {
  try {
    const body: CalculoRequest = await request.json();

    // ⚠️ PROTEÇÃO ANTI-SPAM: Verificar rate limiting ANTES de processar
    let identifier: string = 'unknown';
    let rateLimitCheck: { allowed: boolean; reason?: string; retryAfter?: number };

    try {
      identifier = getIdentifier(request, body.email);
      rateLimitCheck = checkRateLimit(identifier);
    } catch (error) {
      logger.error('api-calculadora', 'Erro ao verificar rate limit:', error instanceof Error ? error : new Error(String(error)));
      // Em caso de erro, permitir (fail open)
      rateLimitCheck = { allowed: true };
    }

    if (!rateLimitCheck.allowed) {
      logger.warn('api-calculadora', '🚫 Rate limit excedido', {
        identifier,
        reason: rateLimitCheck.reason,
        retryAfter: rateLimitCheck.retryAfter,
      });

      return NextResponse.json(
        { 
          error: rateLimitCheck.reason || 'Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente.',
          retryAfter: rateLimitCheck.retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitCheck.retryAfter ? Math.ceil(rateLimitCheck.retryAfter / 1000).toString() : '1800',
          },
        }
      );
    }

    // ⚠️ PROTEÇÃO ANTI-SPAM: Verificar duplicatas recentes
    if (body.email && body.origem && body.destino) {
      let duplicateCheck: { isDuplicate: boolean; existingId?: string };
      
      try {
        duplicateCheck = await checkDuplicateOrcamento(
          body.email,
          body.origem,
          body.destino,
          5 // 5 minutos
        );
      } catch (error) {
        logger.error('api-calculadora', 'Erro ao verificar duplicatas:', error instanceof Error ? error : new Error(String(error)));
        // Em caso de erro, permitir (fail open)
        duplicateCheck = { isDuplicate: false };
      }

      if (duplicateCheck.isDuplicate) {
        logger.warn('api-calculadora', '🚫 Orçamento duplicado detectado', {
          email: body.email,
          origem: body.origem,
          destino: body.destino,
          existingId: duplicateCheck.existingId,
        });

        return NextResponse.json(
          { 
            error: 'Você já solicitou um orçamento com estes dados recentemente. Aguarde alguns minutos antes de tentar novamente.',
            duplicate: true,
            existingId: duplicateCheck.existingId,
          },
          { status: 409 }
        );
      }
    }

    // Registrar tentativa (após passar nas validações)
    recordAttempt(identifier);

    // Validação básica dos dados
    if (!body.origem || !body.destino || !body.tipoImovel || !body.temElevador || typeof body.andar !== 'number' || !body.precisaEmbalagem) {
      return NextResponse.json(
        { error: 'Dados inválidos. Verifique todos os campos.' },
        { status: 400 }
      );
    }

    // Validação dos dados de contato
    if (!body.nome || body.nome.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório.' },
        { status: 400 }
      );
    }

    if (!body.email || body.email.trim() === '') {
      return NextResponse.json(
        { error: 'E-mail é obrigatório.' },
        { status: 400 }
      );
    }

    if (!body.whatsapp || body.whatsapp.trim() === '') {
      return NextResponse.json(
        { error: 'WhatsApp é obrigatório.' },
        { status: 400 }
      );
    }

    // CALCULAR COM IA (calcula distância + orçamento)
    let resultado = await calcularOrcamentoComIA(body);

    // Se a IA não estiver disponível, usar fallback básico
    if (!resultado) {
      logger.warn('api-calculadora', '⚠️ IA não disponível. Usando estimativa básica (fallback)', body);
      resultado = await calcularOrcamentoFallback(body);
    }

    // Salvar orçamento no banco de dados
    try {
      logger.info('api-calculadora', '💾 Salvando orçamento no banco...', {
        nome: body.nome,
        email: body.email,
        origem: body.origem,
        destino: body.destino,
        estadoOrigem: resultado.estadoOrigem,
        cidadeOrigem: resultado.cidadeOrigem,
        estadoDestino: resultado.estadoDestino,
        cidadeDestino: resultado.cidadeDestino,
        tipoImovel: body.tipoImovel,
        temElevador: body.temElevador,
        andar: body.andar,
        precisaEmbalagem: body.precisaEmbalagem,
      });
      
      const orcamentoSalvo = await criarOrcamentoENotificar({
        nome: body.nome,
        email: body.email,
        whatsapp: body.whatsapp,
        origem: body.origem,
        destino: body.destino,
        estadoOrigem: resultado.estadoOrigem || undefined,
        cidadeOrigem: resultado.cidadeOrigem || undefined,
        estadoDestino: resultado.estadoDestino || undefined,
        cidadeDestino: resultado.cidadeDestino || undefined,
        tipoImovel: body.tipoImovel,
        temElevador: body.temElevador === 'sim',
        andar: body.andar,
        precisaEmbalagem: body.precisaEmbalagem === 'sim',
        dataEstimada: body.dataEstimada,
        distanciaKm: resultado.distanciaKm,
        precoMin: resultado.precoMin,
        precoMax: resultado.precoMax,
        mensagemIA: resultado.mensagemIA,
        listaObjetos: body.listaObjetos,
        arquivoListaUrl: body.arquivoListaUrl,
        arquivoListaNome: body.arquivoListaNome,
        origemFormulario: 'calculadora',
        userAgent: request.headers.get('user-agent') || undefined,
        ipCliente: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      });
      
      logger.info('api-calculadora', '✅ Orçamento salvo com sucesso!', {
        orcamentoId: orcamentoSalvo.orcamentoId,
        hotsitesNotificados: orcamentoSalvo.hotsitesNotificados,
        campanhasVinculadas: orcamentoSalvo.hotsitesIds?.length || 0,
      });
    } catch (error) {
      logger.error('api-calculadora', '❌ ERRO ao salvar orçamento no banco', error instanceof Error ? error : new Error(String(error)), {
        nome: body.nome,
        email: body.email,
        origem: body.origem,
        destino: body.destino,
      });
      // ⚠️ IMPORTANTE: Não falha a requisição se o salvamento falhar
      // O usuário ainda recebe o orçamento calculado
      // Mas o erro é logado para debug
    }

    return NextResponse.json(resultado);
  } catch (error) {
    logger.error('api-calculadora', 'Erro ao processar cálculo de orçamento', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Erro ao processar sua solicitação. Por favor, tente novamente.' },
      { status: 500 }
    );
  }
}

