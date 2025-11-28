import { config } from 'dotenv'
import { resolve } from 'path'

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

import { createAdminClient } from '../lib/supabase/server'
import { hashPassword } from '../lib/auth/cliente-auth'

/**
 * Script para criar um usuário cliente de teste
 * 
 * Uso: npx tsx scripts/create-test-cliente.ts
 */

async function createTestCliente() {
  const supabase = createAdminClient()

  const email = 'teste@empresa.com'
  const senha = 'senha123'
  const nome = 'Empresa Teste'
  const telefone = '(11) 99999-9999'

  try {
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('usuarios_clientes')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      console.log('❌ Usuário já existe:', email)
      console.log('   ID:', existing.id)
      return
    }

    // Verificar se empresa já existe
    const { data: empresaExistente } = await supabase
      .from('empresas')
      .select('id')
      .eq('email', email)
      .single()

    let empresaId: string

    if (empresaExistente) {
      empresaId = empresaExistente.id
      console.log('✅ Empresa já existe:', empresaId)
    } else {
      // Criar empresa de teste com slug único
      const timestamp = Date.now()
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .insert({
          nome: nome,
          slug: `empresa-teste-${timestamp}`,
          razao_social: 'Empresa Teste LTDA',
        nome_fantasia: nome,
        nome_responsavel: 'Responsável Teste',
        email_responsavel: email,
        telefone_responsavel: telefone,
        endereco_completo: 'Rua Teste, 123',
        cep: '01234-567',
        cidade: 'São Paulo',
        estado: 'SP',
        email: email,
        telefones: [telefone],
        endereco: 'Rua Teste, 123',
          ativo: true,
        })
        .select()
        .single()

      if (empresaError) {
        console.error('❌ Erro ao criar empresa:', empresaError)
        return
      }

      empresaId = empresa.id
      console.log('✅ Empresa criada:', empresaId)
    }

    // Criar hash da senha
    const senhaHash = await hashPassword(senha)

    // Criar código de verificação
    const codigoVerificacao = Math.floor(100000 + Math.random() * 900000).toString()
    const codigoExpiraEm = new Date()
    codigoExpiraEm.setMinutes(codigoExpiraEm.getMinutes() + 15)

    // Criar usuário
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios_clientes')
      .insert({
        email: email.toLowerCase(),
        senha_hash: senhaHash,
        nome: nome,
        telefone: telefone,
        empresa_id: empresaId,
        email_verificado: true, // Já verificado para facilitar testes
        codigo_verificacao: codigoVerificacao,
        codigo_verificacao_expira_em: codigoExpiraEm.toISOString(),
        ativo: true,
      })
      .select()
      .single()

    if (usuarioError) {
      console.error('❌ Erro ao criar usuário:', usuarioError)
      return
    }

    console.log('\n✅ Usuário cliente de teste criado com sucesso!')
    console.log('\n📋 Credenciais:')
    console.log('   Email:', email)
    console.log('   Senha:', senha)
    console.log('   Código de verificação:', codigoVerificacao)
    console.log('\n🔗 URLs:')
    console.log('   Login: http://localhost:3000/painel/login')
    console.log('   Dashboard: http://localhost:3000/painel/dashboard')
    console.log('\n⚠️  Nota: O email já está verificado para facilitar testes.')
  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

createTestCliente()

