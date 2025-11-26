const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function calcularOrcamentoComIA(dados) {
  try {
    const prompt = `
Você é um especialista em mudanças residenciais e comerciais no Brasil.

Dados da mudança:
- Origem: ${dados.origem}
- Destino: ${dados.destino}
- Tipo de imóvel: ${dados.tipo_imovel}
- Metragem: ${dados.metragem || 'Não informado'}
- Tem elevador: ${dados.tem_elevador ? 'Sim' : 'Não'}
${!dados.tem_elevador ? `- Andar: ${dados.andar}º` : ''}
- Precisa embalagem: ${dados.precisa_embalagem ? 'Sim' : 'Não'}
${dados.lista_objetos ? `- Lista de objetos: ${dados.lista_objetos}` : ''}

REGRAS DE PRECIFICAÇÃO (mercado brasileiro real):

IMPORTANTE: SEMPRE retorne apenas UMA faixa estimada completa que já inclua TODOS os custos (base + distância + adicionais). NÃO retorne duas faixas separadas.

1. BASE POR TIPO DE IMÓVEL E METRAGEM (já inclui custos básicos):
   - Casa:
     * Até 50m²: R$ 1.200 - R$ 2.500
     * 50-150m²: R$ 2.000 - R$ 5.000
     * 150-300m²: R$ 3.500 - R$ 7.500
     * Acima de 300m²: R$ 5.500 - R$ 12.000
   - Apartamento:
     * Até 50m²: R$ 900 - R$ 2.200
     * 50-150m²: R$ 1.600 - R$ 4.500
     * 150-300m²: R$ 2.800 - R$ 7.000
     * Acima de 300m²: R$ 4.500 - R$ 11.000
   - Empresa:
     * Até 50m²: R$ 1.500 - R$ 3.200
     * 50-150m²: R$ 2.800 - R$ 6.500
     * 150-300m²: R$ 4.800 - R$ 10.000
     * Acima de 300m²: R$ 8.000 - R$ 18.000

2. ADICIONAL POR DISTÂNCIA (já aplicado na faixa acima):
   - Até 50km: já incluído na base
   - 51-200km: adicione R$ 8-12 por km adicional à faixa
   - 201-500km: adicione R$ 10-15 por km adicional à faixa
   - 501km+: adicione R$ 12-18 por km adicional à faixa

3. AJUSTES (já aplicados na faixa final):
   - SEM elevador: adicione 20-30% à faixa
   - COM embalagem profissional: adicione R$ 400-1.000 à faixa
   - Lista de objetos grande: adicione 10-25% à faixa

4. LIMITES REALISTAS:
   - Mínimo absoluto: R$ 800
   - Máximo para residencial: R$ 18.000
   - Máximo para comercial: R$ 25.000

5. CÁLCULO FINAL:
   - Comece com a BASE (tipo + metragem)
   - Adicione o custo de DISTÂNCIA
   - Adicione os AJUSTES (elevador, embalagem, objetos)
   - Retorne apenas UMA faixa final: precoMin e precoMax já com TODOS os custos incluídos
   - NÃO retorne duas faixas separadas (uma base e outra com adicionais)
   - A faixa retornada deve ser a MAIOR/MAIS COMPLETA possível

IMPORTANTE: Retorne APENAS um JSON válido, sem texto adicional, markdown ou código. O JSON deve ter exatamente esta estrutura:

{
  "distanciaKm": número (distância em km entre origem e destino),
  "precoMin": número (preço mínimo REALISTA em reais - SEMPRE use a faixa MAIOR/mais completa),
  "precoMax": número (preço máximo REALISTA em reais - SEMPRE use a faixa MAIOR/mais completa),
  "explicacao": "string (máximo 3 frases explicando o cálculo de forma clara)",
  "cidadeOrigem": "string (nome da cidade de origem corrigido)",
  "estadoOrigem": "string (sigla do estado de origem, ex: SP)",
  "cidadeDestino": "string (nome da cidade de destino corrigido)",
  "estadoDestino": "string (sigla do estado de destino, ex: SP)"
}

CALCULE valores REALISTAS baseados nas regras acima. 

IMPORTANTE - Siga estes passos na ordem:

1. Identifique a BASE (tipo + metragem):
   - Casa com 50-150m² → base: R$ 2.000 - R$ 5.000
   - Apartamento com até 50m² → base: R$ 900 - R$ 2.200
   - Empresa com acima de 300m² → base: R$ 8.000 - R$ 18.000

2. Calcule o ADICIONAL DE DISTÂNCIA:
   - Se 100km: adicione R$ 400-600 (50km × R$ 8-12)
   - Se 300km: adicione R$ 2.500-3.750 (250km × R$ 10-15)
   - Se 600km: adicione R$ 6.000-9.000 (550km × R$ 12-18)

3. Aplique os AJUSTES:
   - Sem elevador: multiplique por 1.20-1.30
   - Com embalagem: adicione R$ 400-1.000
   - Lista grande: multiplique por 1.10-1.25

4. CALCULE A FAIXA FINAL (soma tudo):
   - precoMin = (baseMin + distânciaMin) × ajustes + embalagemMin
   - precoMax = (baseMax + distânciaMax) × ajustes + embalagemMax

5. RETORNE APENAS UMA FAIXA:
   - precoMin e precoMax já com TODOS os custos incluídos
   - NÃO retorne duas faixas separadas
   - A faixa deve ser a MAIOR/MAIS COMPLETA possível

EXEMPLO CORRETO:
- Casa 50-150m², 100km, sem elevador, com embalagem
- Base: R$ 2.000 - R$ 5.000
- Distância (100km): +R$ 400-600
- Subtotal: R$ 2.400 - R$ 5.600
- Sem elevador (×1.25): R$ 3.000 - R$ 7.000
- Com embalagem (+R$ 600): R$ 3.600 - R$ 7.600
- RESULTADO: precoMin = 3.600, precoMax = 7.600 (UMA faixa completa)
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em calcular orçamentos de mudanças no Brasil. Retorne APENAS JSON válido, sem formatação markdown. Use valores realistas do mercado brasileiro.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    let resultado = completion.choices[0].message.content.trim();
    
    // Remover markdown se houver
    resultado = resultado.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const json = JSON.parse(resultado);
    
    console.log('Resultado da IA:', json);
    return json;
    
  } catch (error) {
    console.error('Erro ao calcular com IA:', error);
    throw error;
  }
}

module.exports = {
  calcularOrcamentoComIA
};
