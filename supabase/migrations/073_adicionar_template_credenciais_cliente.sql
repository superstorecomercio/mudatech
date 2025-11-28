-- ============================================
-- MIGRATION 073: Adicionar Template de Credenciais de Cliente
-- ============================================
-- Template para envio de credenciais quando cliente se cadastra
-- ============================================

-- Inserir template de credenciais de cliente (se não existir)
INSERT INTO email_templates (tipo, nome, assunto, corpo_html, variaveis, ativo) VALUES (
  'cliente_credenciais',
  'Credenciais de Cliente',
  'Bem-vindo ao MudaTech - Suas credenciais de acesso',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #667eea;">Bem-vindo ao MudaTech!</h2>
    <p>Seu cadastro foi realizado com sucesso. Abaixo estão suas credenciais de acesso:</p>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 10px 0;"><strong>Email:</strong> {{email}}</p>
      <p style="margin: 10px 0;"><strong>Senha:</strong> {{senha}}</p>
    </div>
    
    <p><strong>⚠️ Importante:</strong> Guarde estas credenciais com segurança. Você precisará delas para acessar o painel administrativo.</p>
    
    <p>Para acessar o painel, visite: <a href="{{url_painel}}">{{url_painel}}</a></p>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
      Este é um email automático. Por favor, não responda.
    </p>
  </div>',
  '["email", "senha", "url_painel"]'::jsonb,
  true
)
ON CONFLICT (tipo) DO UPDATE SET
  nome = EXCLUDED.nome,
  assunto = EXCLUDED.assunto,
  corpo_html = EXCLUDED.corpo_html,
  variaveis = EXCLUDED.variaveis,
  ativo = EXCLUDED.ativo,
  updated_at = NOW();

-- Comentário
COMMENT ON COLUMN email_templates.tipo IS 'Tipo do template: orcamento_empresa, orcamento_cliente, campanha_vencendo_1dia, campanha_vencendo_hoje, campanha_ativada, campanha_desativada, cliente_credenciais';

DO $$
BEGIN
  RAISE NOTICE '✅ Template de credenciais de cliente adicionado!';
END $$;

