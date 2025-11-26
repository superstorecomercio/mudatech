-- Migration: Adicionar coluna metragem na tabela orcamentos
-- Data: 2025-11-26
-- Descrição: Adiciona campo metragem para armazenar metragem aproximada do imóvel

-- Adicionar coluna metragem
ALTER TABLE orcamentos 
ADD COLUMN IF NOT EXISTS metragem VARCHAR(50);

-- Comentário na coluna
COMMENT ON COLUMN orcamentos.metragem IS 'Metragem aproximada do imóvel: ate_50, 50_150, 150_300, acima_300';

-- Atualizar função criar_orcamento_e_notificar para incluir metragem
-- Primeiro, remover a função existente (se houver)
DROP FUNCTION IF EXISTS criar_orcamento_e_notificar(JSONB);

-- Criar função novamente com metragem, mantendo a mesma assinatura RETURNS TABLE
CREATE FUNCTION criar_orcamento_e_notificar(p_orcamento_data JSONB)
RETURNS TABLE (
  orcamento_id UUID,
  hotsites_notificados INTEGER,
  campanhas_ids UUID[],
  codigo_orcamento VARCHAR(12)
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
#variable_conflict use_variable
DECLARE
  v_orcamento_id UUID;
  v_cidade_id UUID;
  v_campanhas RECORD;
  v_hotsites_count INTEGER := 0;
  v_campanhas_array UUID[] := '{}';
  v_codigo_orcamento VARCHAR(12);
BEGIN
  -- Validações obrigatórias
  IF p_orcamento_data->>'nome_cliente' IS NULL OR (p_orcamento_data->>'nome_cliente')::TEXT = '' THEN
    RAISE EXCEPTION 'Nome do cliente é obrigatório';
  END IF;
  
  IF p_orcamento_data->>'email_cliente' IS NULL OR (p_orcamento_data->>'email_cliente')::TEXT = '' THEN
    RAISE EXCEPTION 'Email do cliente é obrigatório';
  END IF;

  IF p_orcamento_data->>'telefone_cliente' IS NULL OR (p_orcamento_data->>'telefone_cliente')::TEXT = '' THEN
    RAISE EXCEPTION 'Telefone do cliente é obrigatório';
  END IF;

  -- Validar destino
  IF p_orcamento_data->>'estado_destino' IS NULL OR (p_orcamento_data->>'estado_destino')::TEXT = '' THEN
    RAISE EXCEPTION 'Estado de destino é obrigatório';
  END IF;

  -- 1. Tentar buscar cidade_id pelo nome e estado de destino
  -- (mantido para salvar no orçamento, mas não usado para filtrar campanhas)
  SELECT id INTO v_cidade_id
  FROM cidades
  WHERE LOWER(TRIM(nome)) = LOWER(TRIM(p_orcamento_data->>'cidade_destino'))
    AND LOWER(TRIM(estado)) = LOWER(TRIM(p_orcamento_data->>'estado_destino'))
  LIMIT 1;

  -- 2. Inserir o orçamento (incluindo metragem)
  INSERT INTO orcamentos (
    tipo,
    nome_cliente,
    email_cliente,
    telefone_cliente,
    whatsapp,
    origem_completo,
    destino_completo,
    estado_origem,
    cidade_origem,
    estado_destino,
    cidade_destino,
    cidade_id,
    tipo_imovel,
    metragem,
    tem_elevador,
    andar,
    precisa_embalagem,
    distancia_km,
    preco_min,
    preco_max,
    mensagem_ia,
    lista_objetos,
    arquivo_lista_url,
    arquivo_lista_nome,
    data_estimada,
    origem_formulario,
    user_agent,
    ip_cliente,
    hotsites_notificados
  ) VALUES (
    COALESCE((p_orcamento_data->>'tipo')::TEXT, 'mudanca'),
    (p_orcamento_data->>'nome_cliente')::TEXT,
    (p_orcamento_data->>'email_cliente')::TEXT,
    (p_orcamento_data->>'telefone_cliente')::TEXT,
    (p_orcamento_data->>'whatsapp')::TEXT,
    (p_orcamento_data->>'origem_completo')::TEXT,
    (p_orcamento_data->>'destino_completo')::TEXT,
    (p_orcamento_data->>'estado_origem')::TEXT,
    (p_orcamento_data->>'cidade_origem')::TEXT,
    (p_orcamento_data->>'estado_destino')::TEXT,
    (p_orcamento_data->>'cidade_destino')::TEXT,
    v_cidade_id,
    (p_orcamento_data->>'tipo_imovel')::TEXT,
    (p_orcamento_data->>'metragem')::TEXT,
    COALESCE((p_orcamento_data->>'tem_elevador')::BOOLEAN, false),
    COALESCE((p_orcamento_data->>'andar')::INTEGER, 1),
    COALESCE((p_orcamento_data->>'precisa_embalagem')::BOOLEAN, false),
    (p_orcamento_data->>'distancia_km')::NUMERIC,
    (p_orcamento_data->>'preco_min')::NUMERIC,
    (p_orcamento_data->>'preco_max')::NUMERIC,
    (p_orcamento_data->>'mensagem_ia')::TEXT,
    (p_orcamento_data->>'lista_objetos')::TEXT,
    (p_orcamento_data->>'arquivo_lista_url')::TEXT,
    (p_orcamento_data->>'arquivo_lista_nome')::TEXT,
    CASE 
      WHEN (p_orcamento_data->>'data_estimada')::TEXT IS NULL OR (p_orcamento_data->>'data_estimada')::TEXT = '' 
      THEN NULL 
      ELSE (p_orcamento_data->>'data_estimada')::DATE 
    END,
    COALESCE((p_orcamento_data->>'origem_formulario')::TEXT, 'calculadora'),
    (p_orcamento_data->>'user_agent')::TEXT,
    (p_orcamento_data->>'ip_cliente')::INET,
    0
  )
  RETURNING id INTO v_orcamento_id;

  -- 3. Buscar campanhas ativas SEMPRE por ESTADO
  -- Mudança: Removido IF/ELSE, sempre busca por estado independente de ter encontrado a cidade
  FOR v_campanhas IN
    SELECT * FROM buscar_hotsites_ativos_por_estado(
      (p_orcamento_data->>'estado_destino')::TEXT, 
      COALESCE((p_orcamento_data->>'tipo')::TEXT, 'mudanca')::TEXT
    )
  LOOP
    INSERT INTO orcamentos_campanhas (orcamento_id, campanha_id, hotsite_id)
    VALUES (v_orcamento_id, v_campanhas.campanha_id, v_campanhas.hotsite_id)
    ON CONFLICT ON CONSTRAINT orcamentos_campanhas_orcamento_campanha_unique DO NOTHING;
    
    -- Contar apenas se inseriu com sucesso
    IF FOUND THEN
      v_hotsites_count := v_hotsites_count + 1;
      v_campanhas_array := array_append(v_campanhas_array, v_campanhas.campanha_id);
    END IF;
  END LOOP;

  -- 4. Atualizar contador de hotsites notificados
  UPDATE orcamentos
  SET hotsites_notificados = v_hotsites_count
  WHERE id = v_orcamento_id;

  -- 5. Buscar código do orçamento gerado
  SELECT codigo_orcamento INTO v_codigo_orcamento
  FROM orcamentos
  WHERE id = v_orcamento_id;
  
  -- Se não tiver código, gerar (caso o trigger não tenha funcionado)
  IF v_codigo_orcamento IS NULL OR v_codigo_orcamento = '' THEN
    -- Usar função gerar_codigo_orcamento se existir, senão usar substring do UUID
    BEGIN
      v_codigo_orcamento := gerar_codigo_orcamento(v_orcamento_id);
      UPDATE orcamentos SET codigo_orcamento = v_codigo_orcamento WHERE id = v_orcamento_id;
    EXCEPTION WHEN OTHERS THEN
      -- Fallback: gerar código manualmente
      v_codigo_orcamento := 'MD-' || UPPER(SUBSTRING(REPLACE(v_orcamento_id::TEXT, '-', ''), 1, 4)) || '-' ||
                            UPPER(SUBSTRING(REPLACE(v_orcamento_id::TEXT, '-', ''), 5, 4));
      UPDATE orcamentos SET codigo_orcamento = v_codigo_orcamento WHERE id = v_orcamento_id;
    END;
  END IF;
  
  -- 6. Retornar resultado incluindo código
  RETURN QUERY
  SELECT 
    v_orcamento_id,
    v_hotsites_count,
    v_campanhas_array,
    COALESCE(v_codigo_orcamento, 'MD-' || UPPER(SUBSTRING(REPLACE(v_orcamento_id::TEXT, '-', ''), 1, 4)) || '-' ||
              UPPER(SUBSTRING(REPLACE(v_orcamento_id::TEXT, '-', ''), 5, 4)));
END;
$$;

COMMENT ON FUNCTION criar_orcamento_e_notificar(JSONB) IS 
'Cria orçamento e vincula com campanhas ativas. SEMPRE filtra campanhas pelo estado de destino, independente de ter encontrado a cidade no banco. Inclui campo metragem.';
