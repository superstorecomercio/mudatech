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

1. BASE POR TIPO DE IMÓVEL E METRAGEM:
   - Casa:
     * Até 50m²: R$ 800 - R$ 2.000
     * 50-150m²: R$ 1.500 - R$ 4.000
     * 150-300m²: R$ 2.500 - R$ 6.000
     * Acima de 300m²: R$ 4.000 - R$ 10.000
   - Apartamento:
     * Até 50m²: R$ 600 - R$ 1.800
     * 50-150m²: R$ 1.200 - R$ 3.500
     * 150-300m²: R$ 2.000 - R$ 5.500
     * Acima de 300m²: R$ 3.500 - R$ 9.000
   - Empresa:
     * Até 50m²: R$ 1.000 - R$ 2.500
     * 50-150m²: R$ 2.000 - R$ 5.000
     * 150-300m²: R$ 3.500 - R$ 8.000
     * Acima de 300m²: R$ 6.000 - R$ 15.000

2. ADICIONAL POR DISTÂNCIA:
   - Até 50km: +R$ 0 (incluído na base)
   - 51-200km: +R$ 8 a R$ 12 por km adicional
   - 201-500km: +R$ 10 a R$ 15 por km adicional
   - 501km+: +R$ 12 a R$ 18 por km adicional

3. AJUSTES:
   - SEM elevador: +20% a +30%
   - COM embalagem profissional: +R$ 300 a R$ 800
   - Lista de objetos grande: +10% a +25%

4. LIMITES REALISTAS:
   - Mínimo absoluto: R$ 600
   - Máximo para residencial: R$ 15.000
   - Máximo para comercial: R$ 25.000

IMPORTANTE: Retorne APENAS um JSON válido, sem texto adicional, markdown ou código. O JSON deve ter exatamente esta estrutura:

{
  "distanciaKm": número (distância em km entre origem e destino),
  "precoMin": número (preço mínimo REALISTA em reais),
  "precoMax": número (preço máximo REALISTA em reais),
  "explicacao": "string (máximo 3 frases explicando o cálculo de forma clara)",
  "cidadeOrigem": "string (nome da cidade de origem corrigido)",
  "estadoOrigem": "string (sigla do estado de origem, ex: SP)",
  "cidadeDestino": "string (nome da cidade de destino corrigido)",
  "estadoDestino": "string (sigla do estado de destino, ex: SP)"
}

CALCULE valores REALISTAS baseados nas regras acima. 

IMPORTANTE: Use a combinação de TIPO DE IMÓVEL + METRAGEM para determinar a base do preço. Por exemplo:
- Casa com 50-150m² → usar faixa "Casa: 50-150m²"
- Apartamento com até 50m² → usar faixa "Apartamento: Até 50m²"
- Empresa com acima de 300m² → usar faixa "Empresa: Acima de 300m²"

Depois aplique os ajustes de distância, elevador e embalagem sobre essa base.

Não use multiplicação simples de km × valor fixo.
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
