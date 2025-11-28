-- ============================================
-- MIGRATION 071: Criar Tabela de Empresas (Dados Cadastrais)
-- ============================================
-- Tabela complementar para armazenar dados cadastrais das empresas
-- Mantém hotsites como tabela principal do sistema
-- ============================================

-- Adicionar campos de dados cadastrais à tabela empresas existente
-- A tabela empresas já existe no schema, vamos apenas adicionar os campos necessários

ALTER TABLE empresas ADD COLUMN IF NOT EXISTS razao_social VARCHAR(255);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS nome_fantasia VARCHAR(255);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS nome_responsavel VARCHAR(255);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS email_responsavel VARCHAR(255);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS telefone_responsavel VARCHAR(20);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS endereco_completo TEXT;
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS cep VARCHAR(10);
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS cidade VARCHAR(255); -- Adicionar coluna cidade

-- Se CNPJ não existir, adicionar
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS cnpj VARCHAR(18);

-- Limpar CNPJs duplicados antes de criar índice único
-- Manter apenas o primeiro registro de cada CNPJ (mais antigo)
DO $$
BEGIN
  -- Atualizar CNPJs duplicados para NULL (exceto o primeiro de cada)
  UPDATE empresas e1
  SET cnpj = NULL
  WHERE e1.cnpj IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM empresas e2
      WHERE e2.cnpj = e1.cnpj
        AND e2.id < e1.id
    );
  
  RAISE NOTICE '✅ CNPJs duplicados limpos';
END $$;

-- Criar índice único parcial (apenas para CNPJs não nulos)
-- Se já existir, não criar novamente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'empresas_cnpj_key'
  ) THEN
    CREATE UNIQUE INDEX empresas_cnpj_key ON empresas(cnpj) WHERE cnpj IS NOT NULL;
    RAISE NOTICE '✅ Índice único criado para CNPJ';
  ELSE
    RAISE NOTICE 'ℹ️ Índice único para CNPJ já existe';
  END IF;
END $$;

-- Adicionar campo empresa_id em hotsites se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hotsites' AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE hotsites ADD COLUMN empresa_id UUID REFERENCES empresas(id) ON DELETE SET NULL;
    RAISE NOTICE '✅ Campo empresa_id adicionado em hotsites';
  ELSE
    RAISE NOTICE 'ℹ️ Campo empresa_id já existe em hotsites';
  END IF;
END $$;

-- Remover constraint UNIQUE de empresa_id em hotsites se existir (uma empresa pode ter múltiplos hotsites)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'hotsites_empresa_id_key' 
    AND conrelid = 'hotsites'::regclass
  ) THEN
    ALTER TABLE hotsites DROP CONSTRAINT hotsites_empresa_id_key;
    RAISE NOTICE '✅ Constraint UNIQUE removida de empresa_id em hotsites';
  END IF;
END $$;

-- Criar índice para empresa_id em hotsites
CREATE INDEX IF NOT EXISTS idx_hotsites_empresa_id ON hotsites(empresa_id);

-- Criar índice para CNPJ em empresas (busca rápida)
CREATE INDEX IF NOT EXISTS idx_empresas_cnpj ON empresas(cnpj) WHERE cnpj IS NOT NULL;

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_empresas_razao_social ON empresas(razao_social);
CREATE INDEX IF NOT EXISTS idx_empresas_nome_fantasia ON empresas(nome_fantasia);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_empresas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_empresas_updated_at ON empresas;
CREATE TRIGGER trigger_update_empresas_updated_at
  BEFORE UPDATE ON empresas
  FOR EACH ROW
  EXECUTE FUNCTION update_empresas_updated_at();

-- ============================================
-- PARTE 2: Criar empresas para hotsites existentes sem empresa
-- ============================================

-- Criar empresas automaticamente para hotsites que não têm empresa vinculada
DO $$
DECLARE
  hotsite_record RECORD;
  empresa_id_var UUID;
  slug_base TEXT;
  slug_final TEXT;
  counter INTEGER;
BEGIN
  -- Loop através de todos os hotsites sem empresa vinculada
  FOR hotsite_record IN 
    SELECT h.id, h.nome_exibicao, h.email, h.telefone1, h.endereco, h.cidade, h.estado, h.cidade_id
    FROM hotsites h
    WHERE h.empresa_id IS NULL
  LOOP
    -- Gerar slug único baseado no nome do hotsite + timestamp + random
    slug_base := LOWER(REGEXP_REPLACE(
      COALESCE(hotsite_record.nome_exibicao, 'hotsite'),
      '[^a-z0-9]+', '-', 'g'
    ));
    slug_base := REGEXP_REPLACE(slug_base, '^-+|-+$', '', 'g');
    slug_base := SUBSTRING(slug_base FROM 1 FOR 200);
    
    counter := 0;
    slug_final := slug_base || '-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || FLOOR(RANDOM() * 1000000)::TEXT;
    
    -- Garantir que o slug seja único
    WHILE EXISTS (SELECT 1 FROM empresas WHERE slug = slug_final) LOOP
      counter := counter + 1;
      slug_final := slug_base || '-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || counter::TEXT || '-' || FLOOR(RANDOM() * 1000000)::TEXT;
    END LOOP;
    
    -- Criar empresa com dados do hotsite
    -- A coluna cidade já foi adicionada no início da migration
    INSERT INTO empresas (
      nome,
      slug,
      cnpj,
      razao_social,
      nome_fantasia,
      nome_responsavel,
      email_responsavel,
      telefone_responsavel,
      endereco_completo,
      cidade,
      estado,
      cidade_id,
      email,
      telefones,
      endereco,
      ativo
    ) VALUES (
      COALESCE(hotsite_record.nome_exibicao, 'Empresa sem nome'),
      slug_final,
      NULL, -- CNPJ será preenchido depois
      'Empresa - ' || COALESCE(hotsite_record.nome_exibicao, 'Sem nome'),
      COALESCE(hotsite_record.nome_exibicao, 'Sem nome'),
      'A preencher',
      hotsite_record.email,
      hotsite_record.telefone1,
      hotsite_record.endereco,
      hotsite_record.cidade,
      hotsite_record.estado,
      hotsite_record.cidade_id,
      hotsite_record.email,
      CASE WHEN hotsite_record.telefone1 IS NOT NULL THEN ARRAY[hotsite_record.telefone1] ELSE NULL END,
      hotsite_record.endereco,
      true
    )
    RETURNING id INTO empresa_id_var;
    
    -- Vincular hotsite à empresa criada
    UPDATE hotsites
    SET empresa_id = empresa_id_var
    WHERE id = hotsite_record.id;
    
    RAISE NOTICE '✅ Empresa criada para hotsite: % (ID: %)', hotsite_record.nome_exibicao, hotsite_record.id;
  END LOOP;
  
  RAISE NOTICE '✅ Migração de hotsites para empresas concluída';
END $$;

-- Comentários
COMMENT ON TABLE empresas IS 'Dados cadastrais das empresas (CNPJ, razão social, etc.)';
COMMENT ON COLUMN empresas.cnpj IS 'CNPJ da empresa (formato: XX.XXX.XXX/XXXX-XX)';
COMMENT ON COLUMN empresas.razao_social IS 'Razão social da empresa';
COMMENT ON COLUMN empresas.nome_fantasia IS 'Nome fantasia da empresa';
COMMENT ON COLUMN empresas.nome_responsavel IS 'Nome do responsável legal';
COMMENT ON COLUMN hotsites.empresa_id IS 'ID da empresa vinculada (opcional - hotsite pode existir sem empresa)';

