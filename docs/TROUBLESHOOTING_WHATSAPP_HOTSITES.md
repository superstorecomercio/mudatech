# 🔧 Troubleshooting: WhatsApp não está notificando empresas

## 🎯 Problema

Quando orçamentos são criados via **API do WhatsApp**, o campo `hotsites_notificados` fica em **0** (zero), mas quando criados pela **Calculadora Web**, funciona perfeitamente.

---

## 📊 Como Diagnosticar

### **Passo 1: Execute o script de diagnóstico completo**

```sql
-- No Supabase SQL Editor
\i scripts/diagnostico-whatsapp-completo.sql
```

Este script vai mostrar:
- ✅ Comparação entre orçamentos Web vs WhatsApp
- ✅ Formato dos campos `estado_destino` e `cidade_destino`
- ✅ Se o `cidade_id` está sendo encontrado
- ✅ Campanhas ativas disponíveis no estado
- ✅ Conclusão do que está errado

---

## 🔍 Causas Comuns e Soluções

### **Causa 1: `estado_destino` está NULL ou vazio**

**Sintoma:**
```sql
SELECT estado_destino FROM orcamentos
WHERE origem_formulario = 'formulario_simples'
ORDER BY created_at DESC LIMIT 1;

-- Retorna: NULL ou ''
```

**Solução:** O webhook do WhatsApp **NÃO está enviando** o campo `estadoDestino`. Verifique:

1. O payload do webhook deve incluir:
```json
{
  "nomeCliente": "João Silva",
  "emailCliente": "joao@email.com",
  "telefoneCliente": "11987654321",
  "cidadeOrigem": "São Paulo",
  "estadoOrigem": "SP",           // ✅ OBRIGATÓRIO
  "cidadeDestino": "Rio de Janeiro",
  "estadoDestino": "RJ",          // ✅ OBRIGATÓRIO (ESTE É O CRÍTICO!)
  "tipo": "mudanca",
  "dataEstimada": "2025-12-15"
}
```

2. Verifique o código do webhook que está fazendo o POST para `/api/orcamentos`

---

### **Causa 2: `estado_destino` está em formato incorreto**

**Sintoma:**
```sql
SELECT estado_destino, LENGTH(estado_destino)
FROM orcamentos
WHERE origem_formulario = 'formulario_simples';

-- Retorna: "São Paulo" (10 caracteres) ao invés de "SP" (2 caracteres)
```

**Solução:** O campo deve ser a **SIGLA** do estado (2 letras maiúsculas), não o nome completo.

**Formato correto:**
- ✅ `"SP"` (São Paulo)
- ✅ `"RJ"` (Rio de Janeiro)
- ✅ `"MG"` (Minas Gerais)
- ❌ `"Sao Paulo"`
- ❌ `"sp"` (minúscula)
- ❌ `"S P"` (com espaço)

---

### **Causa 3: `cidade_destino` não existe na tabela `cidades`**

**Sintoma:**
```sql
SELECT o.cidade_destino, o.estado_destino, o.cidade_id
FROM orcamentos o
WHERE origem_formulario = 'formulario_simples'
ORDER BY created_at DESC LIMIT 1;

-- cidade_id está NULL
```

**Como a função SQL funciona:**
```sql
-- 1. Tenta encontrar cidade específica
SELECT id FROM cidades
WHERE LOWER(TRIM(nome)) = LOWER(TRIM('Rio de Janeiro'))
  AND LOWER(TRIM(estado)) = LOWER(TRIM('RJ'));

-- Se encontrar → busca campanhas POR CIDADE (mais específico)
-- Se NÃO encontrar → busca campanhas POR ESTADO (mais amplo) ✅
```

**Solução:** Isso **NÃO é um erro crítico**. A função automaticamente busca por estado quando não encontra a cidade. Mas você pode:

1. Verificar se a cidade existe:
```sql
SELECT * FROM cidades WHERE nome ILIKE '%Rio de Janeiro%' AND estado = 'RJ';
```

2. Se não existir, adicionar:
```sql
INSERT INTO cidades (nome, estado, slug)
VALUES ('Rio de Janeiro', 'RJ', 'rio-de-janeiro');
```

---

### **Causa 4: Não há campanhas ativas no estado**

**Sintoma:**
```sql
SELECT * FROM buscar_hotsites_ativos_por_estado('SP');
-- Retorna 0 linhas
```

**Solução:** Verifique se há campanhas ativas:

```sql
-- Ver todas as campanhas no estado
SELECT
  h.nome_exibicao,
  c.ativo,
  c.participa_cotacao,
  c.data_fim,
  CASE
    WHEN c.ativo = false THEN '❌ Campanha inativa'
    WHEN c.participa_cotacao = false THEN '❌ Não participa de cotação'
    WHEN c.data_fim < CURRENT_DATE THEN '❌ Campanha expirada'
    WHEN h.nome_exibicao IS NULL THEN '❌ nome_exibicao NULL'
    ELSE '✅ OK'
  END as status
FROM hotsites h
INNER JOIN campanhas c ON c.hotsite_id = h.id
INNER JOIN cidades ci ON h.cidade_id = ci.id
WHERE ci.estado = 'SP';
```

**Para ativar campanhas:**
```sql
UPDATE campanhas
SET ativo = true,
    participa_cotacao = true,
    data_fim = NULL  -- ou uma data futura
WHERE id = 'uuid-da-campanha';
```

---

### **Causa 5: Funções SQL desatualizadas**

**Sintoma:** A função `criar_orcamento_e_notificar` não existe ou está desatualizada.

**Solução:** Execute o script completo:

```sql
\i scripts/SISTEMA_ORCAMENTOS_COMPLETO.sql
```

Este script cria/atualiza:
- ✅ `buscar_hotsites_ativos_por_cidade()`
- ✅ `buscar_hotsites_ativos_por_estado()`
- ✅ `criar_orcamento_e_notificar()`

---

## 🧪 Como Testar

### **Teste 1: Simular chamada do WhatsApp**

```bash
curl -X POST http://localhost:3000/api/orcamentos \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCliente": "Teste WhatsApp",
    "emailCliente": "teste@whatsapp.com",
    "telefoneCliente": "11987654321",
    "cidadeOrigem": "São Paulo",
    "estadoOrigem": "SP",
    "cidadeDestino": "Rio de Janeiro",
    "estadoDestino": "RJ",
    "tipo": "mudanca",
    "dataEstimada": "2025-12-15"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "orcamentoId": "uuid-do-orcamento",
  "hotsitesNotificados": 3,  // ✅ MAIOR QUE 0
  "message": "Orçamento criado com sucesso! 3 empresas foram notificadas."
}
```

### **Teste 2: Verificar no banco**

```sql
SELECT
  id,
  nome_cliente,
  estado_destino,
  cidade_destino,
  cidade_id,
  hotsites_notificados,
  created_at
FROM orcamentos
WHERE email_cliente = 'teste@whatsapp.com'
ORDER BY created_at DESC LIMIT 1;
```

**Resultado esperado:**
- `estado_destino`: "RJ" (2 caracteres)
- `hotsites_notificados`: > 0

### **Teste 3: Verificar vínculos criados**

```sql
SELECT
  oc.orcamento_id,
  oc.campanha_id,
  h.nome_exibicao as empresa,
  c.data_inicio,
  c.ativo
FROM orcamentos_campanhas oc
INNER JOIN campanhas c ON oc.campanha_id = c.id
INNER JOIN hotsites h ON oc.hotsite_id = h.id
WHERE oc.orcamento_id = 'uuid-do-orcamento';
```

**Resultado esperado:** Lista de empresas vinculadas

---

## 📝 Logs para Verificar

### **No servidor Next.js:**

```bash
# Procurar por estes logs
grep "API Orçamentos" logs/app.log

# Logs esperados:
✅ "🚀 [API Orçamentos] Chamando criarOrcamentoENotificar..."
✅ "📦 Dados preparados para RPC: { estadoDestino: 'SP', ... }"
✅ "✅ [API Orçamentos] Orçamento criado: { hotsites: 3 }"

# Logs de erro:
❌ "❌ [API Orçamentos] ERRO: estadoDestino está vazio ou não foi enviado!"
❌ "❌ [API Orçamentos] Erro ao criar orçamento: ..."
```

### **No Supabase (Logs da função SQL):**

```sql
-- Ver erros recentes da função
SELECT * FROM pg_stat_statements
WHERE query LIKE '%criar_orcamento_e_notificar%'
ORDER BY last_call DESC LIMIT 10;
```

---

## ✅ Checklist Final

Antes de declarar que está funcionando, verifique:

- [ ] `estado_destino` está sendo enviado pelo webhook
- [ ] `estado_destino` está no formato correto (2 letras maiúsculas)
- [ ] Existem campanhas ativas no estado (`buscar_hotsites_ativos_por_estado('SP')` retorna > 0)
- [ ] A função SQL `criar_orcamento_e_notificar` existe e está atualizada
- [ ] Tabela `orcamentos_campanhas` tem vínculos sendo criados
- [ ] Campo `hotsites_notificados` está sendo atualizado (> 0)
- [ ] Logs do servidor mostram sucesso sem erros

---

## 🆘 Ainda não funciona?

Se após seguir todos os passos ainda não funcionar:

1. **Execute o diagnóstico completo:**
```sql
\i scripts/diagnostico-whatsapp-completo.sql
```

2. **Capture os logs:**
```bash
# Envie um orçamento de teste via WhatsApp
# Copie os logs completos do servidor
```

3. **Verifique a resposta da API:**
```bash
# A resposta deve incluir hotsitesNotificados > 0
```

4. **Compartilhe:**
- Output do script de diagnóstico
- Logs do servidor
- Payload JSON enviado pelo webhook
- Resposta da API

---

## 📚 Arquivos Relacionados

- [app/api/orcamentos/route.ts](../app/api/orcamentos/route.ts) - API do WhatsApp
- [lib/db/queries/orcamentos.ts](../lib/db/queries/orcamentos.ts) - Função TypeScript
- [scripts/SISTEMA_ORCAMENTOS_COMPLETO.sql](../scripts/SISTEMA_ORCAMENTOS_COMPLETO.sql) - Funções SQL
- [scripts/diagnostico-whatsapp-completo.sql](../scripts/diagnostico-whatsapp-completo.sql) - Diagnóstico
- [scripts/comparar-orcamentos-web-vs-whatsapp.sql](../scripts/comparar-orcamentos-web-vs-whatsapp.sql) - Comparação
