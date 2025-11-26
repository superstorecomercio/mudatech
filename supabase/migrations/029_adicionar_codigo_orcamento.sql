-- ============================================
-- MIGRATION 029: Adicionar código único ao orçamento
-- ============================================
-- Adiciona campo codigo_orcamento na tabela orcamentos
-- Gera código único baseado no ID do orçamento
-- Formato: MD-XXXX-XXXX (8 caracteres alfanuméricos)
-- ============================================

-- Adicionar coluna codigo_orcamento
-- Formato: MD-XXXX-XXXX = 12 caracteres
ALTER TABLE orcamentos 
ADD COLUMN IF NOT EXISTS codigo_orcamento VARCHAR(12) UNIQUE;

-- Criar função para gerar código único
CREATE OR REPLACE FUNCTION gerar_codigo_orcamento(p_id UUID)
RETURNS VARCHAR(12)
LANGUAGE plpgsql
AS $$
DECLARE
  v_codigo VARCHAR(12);
  v_tentativas INTEGER := 0;
BEGIN
  LOOP
    -- Gerar código baseado nos primeiros 8 caracteres do UUID (sem hífens)
    -- Formato: MD-XXXX-XXXX
    v_codigo := 'MD-' || 
                UPPER(SUBSTRING(REPLACE(p_id::TEXT, '-', ''), 1, 4)) || '-' ||
                UPPER(SUBSTRING(REPLACE(p_id::TEXT, '-', ''), 5, 4));
    
    -- Verificar se código já existe (muito improvável, mas verificar mesmo assim)
    IF NOT EXISTS (SELECT 1 FROM orcamentos WHERE codigo_orcamento = v_codigo) THEN
      RETURN v_codigo;
    END IF;
    
    -- Se existir, tentar com próximo caractere (muito raro)
    v_tentativas := v_tentativas + 1;
    IF v_tentativas > 10 THEN
      -- Fallback: usar timestamp
      v_codigo := 'MD-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 4)) || '-' ||
                  UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 4));
      RETURN v_codigo;
    END IF;
  END LOOP;
END;
$$;

-- Criar trigger para gerar código automaticamente ao inserir
CREATE OR REPLACE FUNCTION trigger_gerar_codigo_orcamento()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Se código não foi fornecido, gerar automaticamente
  IF NEW.codigo_orcamento IS NULL OR NEW.codigo_orcamento = '' THEN
    NEW.codigo_orcamento := gerar_codigo_orcamento(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS trg_gerar_codigo_orcamento ON orcamentos;
CREATE TRIGGER trg_gerar_codigo_orcamento
  BEFORE INSERT ON orcamentos
  FOR EACH ROW
  EXECUTE FUNCTION trigger_gerar_codigo_orcamento();

-- Atualizar orçamentos existentes que não têm código
UPDATE orcamentos
SET codigo_orcamento = gerar_codigo_orcamento(id)
WHERE codigo_orcamento IS NULL OR codigo_orcamento = '';

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_orcamentos_codigo ON orcamentos(codigo_orcamento);

