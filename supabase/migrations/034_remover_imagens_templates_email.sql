-- Migration: Remover imagens dos templates de email
-- Data: 2025-11-26
-- Descrição: Garante que os templates de email não contenham imagens

-- ============================================
-- REMOVER IMAGENS DO TEMPLATE ORÇAMENTO_EMPRESA
-- ============================================

-- Atualizar template orcamento_empresa removendo qualquer tag de imagem
UPDATE email_templates
SET corpo_html = REGEXP_REPLACE(
  corpo_html,
  '<img[^>]*>',
  '',
  'gi'
)
WHERE tipo = 'orcamento_empresa';

-- ============================================
-- REMOVER IMAGENS DOS OUTROS TEMPLATES
-- ============================================

-- Atualizar todos os templates removendo tags de imagem
UPDATE email_templates
SET corpo_html = REGEXP_REPLACE(
  corpo_html,
  '<img[^>]*>',
  '',
  'gi'
);

-- Comentário
COMMENT ON TABLE email_templates IS 'Templates de email para diferentes tipos de notificações (sem imagens)';

