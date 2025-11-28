-- ============================================
-- MIGRATION 072: Criar Tabela de Usuários (Clientes)
-- ============================================
-- Tabela para autenticação de clientes (empresas)
-- 1 usuário = 1 empresa
-- ============================================

-- Tabela de usuários (clientes)
CREATE TABLE IF NOT EXISTS usuarios_clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  nome VARCHAR(255),
  telefone VARCHAR(20),
  email_verificado BOOLEAN DEFAULT false,
  codigo_verificacao VARCHAR(6),
  codigo_verificacao_expira_em TIMESTAMP WITH TIME ZONE,
  ativo BOOLEAN DEFAULT true,
  ultimo_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_usuarios_clientes_email ON usuarios_clientes(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_clientes_empresa_id ON usuarios_clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_clientes_ativo ON usuarios_clientes(ativo);

-- Tabela de sessões de clientes
CREATE TABLE IF NOT EXISTS usuario_cliente_sessoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios_clientes(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para sessões
CREATE INDEX IF NOT EXISTS idx_usuario_cliente_sessoes_usuario_id ON usuario_cliente_sessoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_cliente_sessoes_token ON usuario_cliente_sessoes(token);
CREATE INDEX IF NOT EXISTS idx_usuario_cliente_sessoes_expires_at ON usuario_cliente_sessoes(expires_at);

-- Comentários
COMMENT ON TABLE usuarios_clientes IS 'Usuários clientes (empresas) do sistema';
COMMENT ON COLUMN usuarios_clientes.empresa_id IS 'ID da empresa vinculada (1 usuário = 1 empresa)';
COMMENT ON COLUMN usuarios_clientes.email_verificado IS 'Se o email foi verificado';
COMMENT ON COLUMN usuarios_clientes.codigo_verificacao IS 'Código de verificação de email (6 dígitos)';
COMMENT ON TABLE usuario_cliente_sessoes IS 'Sessões de autenticação dos clientes';

