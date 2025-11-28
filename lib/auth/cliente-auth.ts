import bcrypt from 'bcryptjs'
import { createAdminClient } from '@/lib/supabase/server'
import crypto from 'crypto'

/**
 * Autenticação de clientes (empresas)
 * 1 usuário = 1 empresa
 */

export interface ClienteUsuario {
  id: string
  email: string
  empresa_id: string | null
  nome: string | null
  telefone: string | null
  email_verificado: boolean
  ativo: boolean
}

/**
 * Criar hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Verificar senha
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Verificar credenciais do cliente
 */
export async function verifyClienteCredentials(
  email: string,
  password: string
): Promise<{ success: boolean; usuario?: ClienteUsuario; error?: string }> {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('usuarios_clientes')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !data) {
      return { success: false, error: 'Email ou senha incorretos' }
    }

    if (!data.ativo) {
      return { success: false, error: 'Conta desativada' }
    }

    const isValid = await verifyPassword(password, data.senha_hash)
    if (!isValid) {
      return { success: false, error: 'Email ou senha incorretos' }
    }

    return {
      success: true,
      usuario: {
        id: data.id,
        email: data.email,
        empresa_id: data.empresa_id,
        nome: data.nome,
        telefone: data.telefone,
        email_verificado: data.email_verificado,
        ativo: data.ativo,
      },
    }
  } catch (error: any) {
    console.error('Erro ao verificar credenciais:', error)
    return { success: false, error: 'Erro ao verificar credenciais' }
  }
}

/**
 * Criar código de verificação de email
 */
export async function createVerificationCode(email: string): Promise<string> {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 15) // 15 minutos

  const supabase = createAdminClient()

  await supabase
    .from('usuarios_clientes')
    .update({
      codigo_verificacao: code,
      codigo_verificacao_expira_em: expiresAt.toISOString(),
    })
    .eq('email', email.toLowerCase())

  return code
}

/**
 * Verificar código de verificação
 */
export async function verifyCode(email: string, code: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('usuarios_clientes')
    .select('codigo_verificacao, codigo_verificacao_expira_em')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !data) {
    return false
  }

  if (!data.codigo_verificacao || data.codigo_verificacao !== code) {
    return false
  }

  const expiresAt = new Date(data.codigo_verificacao_expira_em)
  if (expiresAt < new Date()) {
    return false
  }

  // Marcar email como verificado
  await supabase
    .from('usuarios_clientes')
    .update({
      email_verificado: true,
      codigo_verificacao: null,
      codigo_verificacao_expira_em: null,
    })
    .eq('email', email.toLowerCase())

  return true
}

/**
 * Criar sessão do cliente
 */
export async function createClienteSession(
  usuarioId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 dias

  const supabase = createAdminClient()

  await supabase.from('usuario_cliente_sessoes').insert({
    usuario_id: usuarioId,
    token,
    ip_address: ipAddress,
    user_agent: userAgent,
    expires_at: expiresAt.toISOString(),
  })

  return token
}

/**
 * Validar sessão do cliente
 */
export async function validateClienteSession(token: string): Promise<ClienteUsuario | null> {
  const supabase = createAdminClient()

  const { data: session, error: sessionError } = await supabase
    .from('usuario_cliente_sessoes')
    .select('usuario_id, expires_at')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (sessionError || !session) {
    return null
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios_clientes')
    .select('*')
    .eq('id', session.usuario_id)
    .eq('ativo', true)
    .single()

  if (usuarioError || !usuario) {
    return null
  }

  // Atualizar último login
  await supabase
    .from('usuarios_clientes')
    .update({ ultimo_login: new Date().toISOString() })
    .eq('id', usuario.id)

  return {
    id: usuario.id,
    email: usuario.email,
    empresa_id: usuario.empresa_id,
    nome: usuario.nome,
    telefone: usuario.telefone,
    email_verificado: usuario.email_verificado,
    ativo: usuario.ativo,
  }
}

/**
 * Deletar sessão do cliente
 */
export async function deleteClienteSession(token: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('usuario_cliente_sessoes').delete().eq('token', token)
}

/**
 * Deletar todas as sessões do cliente
 */
export async function deleteAllClienteSessions(usuarioId: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('usuario_cliente_sessoes').delete().eq('usuario_id', usuarioId)
}

