-- ============================================
-- DIAGNÓSTICO COMPLETO: WhatsApp vs Calculadora Web
-- ============================================
-- Este script compara os dados enviados pelo WhatsApp
-- vs Calculadora Web para identificar o problema

-- ============================================
-- 1. ÚLTIMOS 5 ORÇAMENTOS DE CADA FONTE
-- ============================================

-- Calculadora Web
SELECT
  'CALCULADORA WEB' as origem,
  id,
  created_at,
  nome_cliente,
  estado_origem,
  cidade_origem,
  estado_destino,
  cidade_destino,
  origem_completo,
  destino_completo,
  cidade_id,
  hotsites_notificados,
  CASE
    WHEN estado_destino IS NULL THEN '❌ estado_destino NULL'
    WHEN estado_destino = '' THEN '❌ estado_destino VAZIO'
    WHEN cidade_id IS NOT NULL THEN '✅ Buscou por CIDADE'
    ELSE '✅ Buscou por ESTADO'
  END as status_busca
FROM orcamentos
WHERE origem_formulario = 'calculadora'
ORDER BY created_at DESC
LIMIT 5;

-- WhatsApp
SELECT
  'WHATSAPP' as origem,
  id,
  created_at,
  nome_cliente,
  estado_origem,
  cidade_origem,
  estado_destino,
  cidade_destino,
  origem_completo,
  destino_completo,
  cidade_id,
  hotsites_notificados,
  CASE
    WHEN estado_destino IS NULL THEN '❌ estado_destino NULL'
    WHEN estado_destino = '' THEN '❌ estado_destino VAZIO'
    WHEN cidade_id IS NOT NULL THEN '✅ Buscou por CIDADE'
    ELSE '✅ Buscou por ESTADO'
  END as status_busca
FROM orcamentos
WHERE origem_formulario = 'formulario_simples'
ORDER BY created_at DESC
LIMIT 5;

-- ============================================
-- 2. COMPARAR FORMATO DOS CAMPOS
-- ============================================

SELECT
  origem_formulario,
  COUNT(*) as total,
  COUNT(CASE WHEN estado_destino IS NULL THEN 1 END) as estado_null,
  COUNT(CASE WHEN estado_destino = '' THEN 1 END) as estado_vazio,
  COUNT(CASE WHEN cidade_id IS NULL THEN 1 END) as cidade_id_null,
  COUNT(CASE WHEN hotsites_notificados = 0 THEN 1 END) as sem_notificacoes,
  ROUND(AVG(hotsites_notificados), 2) as media_notificacoes
FROM orcamentos
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY origem_formulario
ORDER BY origem_formulario;

-- ============================================
-- 3. DETALHES DO ÚLTIMO ORÇAMENTO WHATSAPP COM PROBLEMA
-- ============================================

WITH ultimo_whatsapp AS (
  SELECT * FROM orcamentos
  WHERE origem_formulario = 'formulario_simples'
    AND hotsites_notificados = 0
  ORDER BY created_at DESC
  LIMIT 1
)
SELECT
  'ÚLTIMO ORÇAMENTO WHATSAPP COM PROBLEMA' as diagnostico,
  id,
  created_at,
  estado_destino as "Estado Destino Salvo",
  LENGTH(estado_destino) as "Tamanho do Estado",
  cidade_destino as "Cidade Destino Salva",
  cidade_id as "Cidade ID (UUID)",
  destino_completo as "Destino Completo",
  (SELECT COUNT(*)
   FROM buscar_hotsites_ativos_por_estado(estado_destino)
  ) as "Campanhas que DEVERIAM ser encontradas"
FROM ultimo_whatsapp;

-- ============================================
-- 4. TESTAR FUNÇÃO MANUALMENTE COM DADOS DO WHATSAPP
-- ============================================

-- Teste 1: Buscar por estado do último orçamento WhatsApp
SELECT
  'TESTE 1: Buscar por estado do último WhatsApp' as teste,
  COUNT(*) as campanhas_encontradas
FROM buscar_hotsites_ativos_por_estado(
  (SELECT estado_destino FROM orcamentos
   WHERE origem_formulario = 'formulario_simples'
   ORDER BY created_at DESC LIMIT 1)
);

-- Teste 2: Listar campanhas que deveriam ser encontradas
SELECT
  'TESTE 2: Campanhas disponíveis para o estado' as teste,
  hotsite_id,
  campanha_id,
  nome,
  email,
  cidade,
  estado,
  plano_ordem
FROM buscar_hotsites_ativos_por_estado(
  (SELECT estado_destino FROM orcamentos
   WHERE origem_formulario = 'formulario_simples'
   ORDER BY created_at DESC LIMIT 1)
);

-- ============================================
-- 5. VERIFICAR SE CIDADE_ID ESTÁ SENDO ENCONTRADO
-- ============================================

SELECT
  'VERIFICAÇÃO DE CIDADE_ID' as diagnostico,
  o.id as orcamento_id,
  o.cidade_destino as "Cidade Enviada",
  o.estado_destino as "Estado Enviado",
  o.cidade_id as "Cidade ID Encontrado",
  c.nome as "Nome da Cidade no Banco",
  c.estado as "Estado da Cidade no Banco",
  CASE
    WHEN o.cidade_id IS NULL THEN '❌ Cidade não encontrada na tabela cidades'
    ELSE '✅ Cidade encontrada'
  END as status
FROM orcamentos o
LEFT JOIN cidades c ON o.cidade_id = c.id
WHERE o.origem_formulario = 'formulario_simples'
  AND o.hotsites_notificados = 0
ORDER BY o.created_at DESC
LIMIT 5;

-- ============================================
-- 6. COMPARAR NOMES DE CIDADES (case-insensitive)
-- ============================================

WITH ultimo_whatsapp AS (
  SELECT cidade_destino, estado_destino
  FROM orcamentos
  WHERE origem_formulario = 'formulario_simples'
  ORDER BY created_at DESC
  LIMIT 1
)
SELECT
  'COMPARAÇÃO DE CIDADES' as diagnostico,
  c.nome as "Cidade no Banco",
  c.estado as "Estado no Banco",
  u.cidade_destino as "Cidade do WhatsApp",
  u.estado_destino as "Estado do WhatsApp",
  LOWER(TRIM(c.nome)) = LOWER(TRIM(u.cidade_destino)) as "Nome Match",
  LOWER(TRIM(c.estado)) = LOWER(TRIM(u.estado_destino)) as "Estado Match",
  CASE
    WHEN LOWER(TRIM(c.nome)) = LOWER(TRIM(u.cidade_destino))
     AND LOWER(TRIM(c.estado)) = LOWER(TRIM(u.estado_destino))
    THEN '✅ DEVERIA ENCONTRAR'
    ELSE '❌ NÃO VAI ENCONTRAR'
  END as resultado
FROM cidades c
CROSS JOIN ultimo_whatsapp u
WHERE LOWER(TRIM(c.nome)) LIKE '%' || LOWER(TRIM(u.cidade_destino)) || '%'
   OR LOWER(TRIM(c.estado)) = LOWER(TRIM(u.estado_destino))
ORDER BY
  LOWER(TRIM(c.nome)) = LOWER(TRIM(u.cidade_destino)) DESC,
  c.estado;

-- ============================================
-- 7. VERIFICAR CAMPANHAS ATIVAS NO ESTADO DO WHATSAPP
-- ============================================

SELECT
  'CAMPANHAS ATIVAS NO ESTADO' as diagnostico,
  h.nome_exibicao,
  ci.nome as cidade,
  ci.estado,
  c.ativo,
  c.participa_cotacao,
  c.data_inicio,
  c.data_fim,
  p.nome as plano
FROM hotsites h
INNER JOIN campanhas c ON c.hotsite_id = h.id
INNER JOIN cidades ci ON h.cidade_id = ci.id
LEFT JOIN planos p ON c.plano_id = p.id
WHERE ci.estado = (
  SELECT estado_destino
  FROM orcamentos
  WHERE origem_formulario = 'formulario_simples'
  ORDER BY created_at DESC
  LIMIT 1
)
ORDER BY c.ativo DESC, c.participa_cotacao DESC, p.ordem ASC;

-- ============================================
-- 8. RESUMO FINAL: O QUE ESTÁ ERRADO?
-- ============================================

SELECT
  'RESUMO FINAL' as diagnostico,
  CASE
    WHEN (SELECT COUNT(*) FROM orcamentos WHERE origem_formulario = 'formulario_simples' AND estado_destino IS NULL) > 0
    THEN '❌ PROBLEMA: estado_destino está NULL no banco'

    WHEN (SELECT COUNT(*) FROM orcamentos WHERE origem_formulario = 'formulario_simples' AND estado_destino = '') > 0
    THEN '❌ PROBLEMA: estado_destino está VAZIO no banco'

    WHEN (SELECT COUNT(*) FROM buscar_hotsites_ativos_por_estado(
      (SELECT estado_destino FROM orcamentos WHERE origem_formulario = 'formulario_simples' ORDER BY created_at DESC LIMIT 1)
    )) = 0
    THEN '❌ PROBLEMA: Não há campanhas ativas no estado'

    WHEN (SELECT COUNT(*) FROM orcamentos WHERE origem_formulario = 'formulario_simples' AND cidade_id IS NULL) > 0
    THEN '⚠️ AVISO: cidade_id está NULL (busca por estado ao invés de cidade)'

    ELSE '✅ Tudo parece OK - verificar logs do servidor'
  END as conclusao;
