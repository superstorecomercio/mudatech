# 🤖 PROMPT DA IA CORRIGIDO - Cálculo de Orçamento

## 🔴 PROBLEMA ATUAL

A IA está interpretando erroneamente e calculando:
- **390 km × R$ 50-150/km = R$ 19.500 - R$ 58.500** ❌

Isso está **completamente errado**! O correto seria:
- **Base R$ 1.800 + Combustível R$ 780 + Embalagem R$ 1.000 + Margem 25% = ~R$ 5.000** ✅

---

## ✅ PROMPT CORRIGIDO

Substitua o prompt atual (linhas 122-222 do arquivo `app/api/calcular-orcamento/route.ts`) por este:

```javascript
const prompt = `Você é um especialista em orçamentos de mudanças residenciais no Brasil com 20 anos de experiência e amplo conhecimento do mercado atual.

⚠️ ATENÇÃO: Os preços NÃO são calculados por "valor por km". Use o modelo de CUSTO BASE + ADICIONAIS descrito abaixo.

DADOS DA MUDANÇA:
- Origem: "${params.origem}"
- Destino: "${params.destino}"
- Tipo de imóvel: ${tiposImovelLabels[params.tipoImovel]}
- Tem elevador: ${params.temElevador === 'sim' ? 'Sim' : 'Não'}
- Andar: ${params.andar}º
- Precisa de embalagem: ${params.precisaEmbalagem === 'sim' ? 'Sim' : 'Não'}

═══════════════════════════════════════════════════════════════════
METODOLOGIA DE CÁLCULO (SIGA RIGOROSAMENTE):
═══════════════════════════════════════════════════════════════════

PASSO 1: CALCULAR DISTÂNCIA
- Use seu conhecimento geográfico do Brasil
- Exemplos de referência:
  * São Paulo → Rio de Janeiro = 430 km
  * São Paulo → Belo Horizonte = 585 km
  * São Paulo → Curitiba = 408 km
  * Rio de Janeiro → Belo Horizonte = 434 km

PASSO 2: DEFINIR CUSTO BASE (não varia com distância)
┌─────────────────┬──────────────────┬────────────────────┐
│ Tipo de Imóvel  │ Preço MIN (R$)   │ Preço MAX (R$)     │
├─────────────────┼──────────────────┼────────────────────┤
│ Kitnet          │ 1.000            │ 1.500              │
│ 1 quarto        │ 1.400            │ 2.000              │
│ 2 quartos       │ 1.800            │ 2.800              │
│ 3+ quartos/Casa │ 2.500            │ 4.000              │
│ Comercial       │ 3.000            │ 6.000              │
└─────────────────┴──────────────────┴────────────────────┘

PASSO 3: ADICIONAR CUSTOS VARIÁVEIS

A) COMBUSTÍVEL (IDA + VOLTA):
   Fórmula: distância_km × 2 × R$ 1,00
   Exemplos:
   - 100 km: 100 × 2 × 1,00 = R$ 200
   - 400 km: 400 × 2 × 1,00 = R$ 800
   - 1.000 km: 1.000 × 2 × 1,00 = R$ 2.000

B) PEDÁGIOS:
   - Mesma cidade: R$ 0
   - Região metropolitana (até 100km): R$ 30-50
   - Mesmo estado (100-400km): R$ 80-150
   - Interestadual (400-800km): R$ 150-250
   - Longa distância (>800km): R$ 250-400

C) EMBALAGEM PROFISSIONAL (se precisaEmbalagem = true):
   - Kitnet: +R$ 500
   - 1 quarto: +R$ 700
   - 2 quartos: +R$ 1.000
   - 3+ quartos: +R$ 1.500
   - Comercial: +R$ 2.000

D) SEM ELEVADOR (se temElevador = false):
   - Térreo ao 2º andar: R$ 0
   - 3º ao 5º andar: +R$ 400
   - 6º andar ou mais: +R$ 700

E) PERNOITE (apenas se distância > 700km):
   - Uma pernoite: +R$ 500
   - Duas pernoites: +R$ 1.000

F) MARGEM DE LUCRO E SEGUROS:
   - Multiplicar total por 1,25 (25% de margem)

═══════════════════════════════════════════════════════════════════
EXEMPLO DE CÁLCULO COMPLETO:
═══════════════════════════════════════════════════════════════════

Caso: Vargem Grande Paulista (SP) → Rio de Janeiro (RJ)
- Distância: 390 km (interestadual)
- Imóvel: 2 quartos
- Elevador: Sim
- Embalagem: Sim

CÁLCULO DO PREÇO MÍNIMO:
1. Base (2 quartos):              R$ 1.800
2. Combustível (390×2×1,00):      R$ 780
3. Pedágios (interestadual):      R$ 150
4. Embalagem (2 quartos):         R$ 1.000
5. Sem elevador:                  R$ 0 (tem elevador)
6. Pernoite:                      R$ 0 (390km não precisa)
   SUBTOTAL:                      R$ 3.730
7. Margem 25%:                    R$ 933
   TOTAL MÍNIMO:                  R$ 4.663 ≈ R$ 4.700

CÁLCULO DO PREÇO MÁXIMO:
1. Base (2 quartos):              R$ 2.800
2. Combustível (390×2×1,00):      R$ 780
3. Pedágios (interestadual):      R$ 250
4. Embalagem (2 quartos):         R$ 1.000
5. Sem elevador:                  R$ 0
6. Pernoite:                      R$ 0
   SUBTOTAL:                      R$ 4.830
7. Margem 25%:                    R$ 1.207
   TOTAL MÁXIMO:                  R$ 6.037 ≈ R$ 6.000

RESULTADO ESPERADO: R$ 4.700 - R$ 6.000 ✅

═══════════════════════════════════════════════════════════════════
EXEMPLOS DE REFERÊNCIA (USE COMO VALIDAÇÃO):
═══════════════════════════════════════════════════════════════════

1. Mesma cidade (15 km, 2 quartos, elevador, sem embalagem):
   Base R$ 1.800 + Combustível R$ 30 + Margem 25% = R$ 2.300 - R$ 3.500

2. Mesma cidade (15 km, 2 quartos, elevador, COM embalagem):
   Base R$ 1.800 + Combustível R$ 30 + Embalagem R$ 1.000 + Margem 25% = R$ 3.500 - R$ 4.800

3. Interestadual (430 km, 2 quartos, elevador, com embalagem):
   Base R$ 1.800 + Combustível R$ 860 + Pedágio R$ 150 + Embalagem R$ 1.000 + Margem 25% = R$ 4.800 - R$ 7.000

4. Longa distância (1.100 km, 3+ quartos, sem elevador 4º, com embalagem):
   Base R$ 2.500 + Combustível R$ 2.200 + Pedágio R$ 300 + Embalagem R$ 1.500 + Elevador R$ 400 + Pernoite R$ 500 + Margem 25% = R$ 9.250 - R$ 14.000

═══════════════════════════════════════════════════════════════════
⚠️ REGRAS CRÍTICAS:
═══════════════════════════════════════════════════════════════════

1. NUNCA calcule "preço por km" multiplicado pela distância
2. O preço MAX deve ser no máximo 60% maior que o MIN
3. Para distâncias curtas (<50km), o combustível tem pouco impacto
4. Para distâncias longas (>400km), combustível é o maior custo adicional
5. Embalagem profissional é um valor FIXO por tipo de imóvel
6. A base NÃO aumenta com a distância (apenas custos variáveis)

═══════════════════════════════════════════════════════════════════
FORMATO DE RESPOSTA (JSON):
═══════════════════════════════════════════════════════════════════

Retorne APENAS um JSON válido:
{
  "distanciaKm": 390,
  "precoMin": 4700,
  "precoMax": 6000,
  "explicacao": "Mudança interestadual entre Vargem Grande Paulista (SP) e Rio de Janeiro (RJ), 390 km. Custo base para 2 quartos com elevador, mais combustível ida/volta, pedágios e embalagem profissional. Valores incluem margem de segurança e seguro.",
  "cidadeOrigem": "Vargem Grande Paulista",
  "estadoOrigem": "SP",
  "cidadeDestino": "Rio de Janeiro",
  "estadoDestino": "RJ"
}

⚠️ NÃO mencione "custo por km" na explicação!
⚠️ A explicação deve ser clara e baseada nos custos reais (base + combustível + adicionais).
`;
```

---

## 📝 COMO APLICAR A CORREÇÃO

### Método 1: Editar o arquivo diretamente

1. Abra: `app/api/calcular-orcamento/route.ts`
2. Localize a linha 122 (início do prompt)
3. Substitua TODO o texto do prompt (até a linha 222) pelo novo prompt acima
4. Salve o arquivo
5. Restart do servidor Next.js

### Método 2: Criar versão corrigida

1. Vou criar um arquivo patch para você aplicar

---

## 🧪 TESTE DO CÁLCULO CORRETO

### Caso Real: Vargem Grande Paulista → Rio de Janeiro

**Dados:**
- Distância: 390 km
- Imóvel: 2 quartos
- Elevador: Sim
- Embalagem: Sim

**Cálculo Detalhado:**

| Item | MIN (R$) | MAX (R$) |
|------|----------|----------|
| Base (2 quartos) | 1.800 | 2.800 |
| Combustível (390×2×1,00) | 780 | 780 |
| Pedágios | 150 | 250 |
| Embalagem | 1.000 | 1.000 |
| **SUBTOTAL** | **3.730** | **4.830** |
| Margem 25% | 933 | 1.207 |
| **TOTAL** | **4.663** | **6.037** |
| **ARREDONDADO** | **R$ 4.700** | **R$ 6.000** |

**Resultado Esperado:** R$ 4.700 - R$ 6.000 ✅

**Resultado Atual (ERRADO):** R$ 19.500 - R$ 58.500 ❌

---

## 📊 COMPARAÇÃO: ANTES vs DEPOIS

| Caso | Distância | Atual (ERRADO) | Corrigido | Diferença |
|------|-----------|----------------|-----------|-----------|
| VGP → RJ (2Q, elev, embal) | 390 km | R$ 19.500 - 58.500 | R$ 4.700 - 6.000 | **-74% MIN, -90% MAX** |
| SP → RJ (2Q, elev, embal) | 430 km | R$ 21.500 - 64.500 | R$ 4.800 - 7.000 | Similar |
| SP → BH (3Q, s/elev, embal) | 585 km | R$ 29.250 - 87.750 | R$ 7.500 - 11.000 | Similar |

**CONCLUSÃO:** A IA está calculando preços **3x a 10x MAIORES** do que o real!
