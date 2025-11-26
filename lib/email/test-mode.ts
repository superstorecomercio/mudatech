// Modo de teste para emails - intercepta envios e não envia para clientes reais

interface TestEmailLog {
  to: string | string[]
  subject: string
  html: string
  from: string
  fromName?: string
  timestamp: string
  provider: string
}

// Armazena emails enviados em modo de teste (em memória)
const testEmailLogs: TestEmailLog[] = []

// Cache da configuração do modo de teste (atualizado via API)
let testModeConfig: { enabled: boolean } | null = null
let configLoaded = false

/**
 * Define a configuração do modo de teste (chamado pela API)
 */
export function setTestModeConfig(enabled: boolean) {
  testModeConfig = { enabled }
  configLoaded = true
}

/**
 * Carrega a configuração do banco de dados (chamado na inicialização)
 */
export async function loadTestModeConfig() {
  if (configLoaded) return // Já carregado

  try {
    // Tentar carregar do banco via import dinâmico para evitar dependência circular
    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = createAdminClient()

    const { data } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'email_test_mode')
      .single()

    if (data?.valor?.enabled !== undefined) {
      testModeConfig = { enabled: data.valor.enabled }
      configLoaded = true
    }
  } catch (error) {
    // Se não conseguir carregar, usar lógica padrão
    console.log('Não foi possível carregar configuração do modo de teste do banco, usando padrão')
  }
}

/**
 * Verifica se está em modo de teste
 * Prioridade:
 * 1. Configuração do banco de dados (se disponível e carregada)
 * 2. Variável de ambiente EMAIL_TEST_MODE
 * 3. NODE_ENV === 'development' (apenas se não houver configuração explícita)
 */
export function isTestMode(): boolean {
  // 1. Verificar configuração do banco (se disponível)
  if (testModeConfig !== null) {
    return testModeConfig.enabled
  }
  
  // 2. Verificar variável de ambiente (sobrescreve desenvolvimento)
  if (process.env.EMAIL_TEST_MODE === 'true' || process.env.EMAIL_TEST_MODE === '1') {
    return true
  }
  
  if (process.env.EMAIL_TEST_MODE === 'false' || process.env.EMAIL_TEST_MODE === '0') {
    return false
  }
  
  // 3. Verificar se está em desenvolvimento (apenas se não houver configuração explícita)
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  return false
}

/**
 * Obtém o email de teste (redireciona todos os emails para este)
 */
export function getTestEmail(): string {
  return process.env.EMAIL_TEST_TO || process.env.ADMIN_EMAIL || 'test@mudatech.com.br'
}

/**
 * Intercepta o envio de email em modo de teste
 */
export async function interceptTestEmail(
  options: {
    to: string | string[]
    subject: string
    html: string
    from: string
    fromName?: string
  },
  provider: string
): Promise<{ success: boolean; messageId?: string; error?: string; testMode?: boolean }> {
  const testEmail = getTestEmail()
  const originalTo = Array.isArray(options.to) ? options.to : [options.to]
  
  // Log do email original
  const log: TestEmailLog = {
    to: originalTo,
    subject: options.subject,
    html: options.html,
    from: options.from,
    fromName: options.fromName,
    timestamp: new Date().toISOString(),
    provider
  }
  
  testEmailLogs.push(log)
  
  // Limitar logs a 100 emails (evitar consumo excessivo de memória)
  if (testEmailLogs.length > 100) {
    testEmailLogs.shift()
  }
  
  // Adicionar aviso no HTML do email
  const testModeWarning = `
    <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
      <strong style="color: #92400e;">⚠️ MODO DE TESTE</strong>
      <p style="color: #78350f; margin: 5px 0 0 0; font-size: 14px;">
        Este email foi interceptado em modo de teste.<br>
        <strong>Destinatário original:</strong> ${originalTo.join(', ')}<br>
        <strong>Enviado para:</strong> ${testEmail}
      </p>
    </div>
  `
  
  const modifiedHtml = testModeWarning + options.html
  
  // Retornar sucesso simulado (não envia realmente)
  console.log('📧 [TEST MODE] Email interceptado:')
  console.log('   Para:', originalTo.join(', '))
  console.log('   Assunto:', options.subject)
  console.log('   Redirecionado para:', testEmail)
  console.log('   Provider:', provider)
  
  return {
    success: true,
    messageId: `test-${Date.now()}`,
    testMode: true
  }
}

/**
 * Obtém logs de emails em modo de teste
 */
export function getTestEmailLogs(): TestEmailLog[] {
  return [...testEmailLogs]
}

/**
 * Limpa logs de emails de teste
 */
export function clearTestEmailLogs(): void {
  testEmailLogs.length = 0
}

/**
 * Obtém estatísticas de emails de teste
 */
export function getTestEmailStats() {
  const logs = getTestEmailLogs()
  const uniqueRecipients = new Set<string>()
  
  logs.forEach(log => {
    const recipients = Array.isArray(log.to) ? log.to : [log.to]
    recipients.forEach(email => uniqueRecipients.add(email))
  })
  
  return {
    total: logs.length,
    uniqueRecipients: uniqueRecipients.size,
    providers: [...new Set(logs.map(log => log.provider))],
    lastEmail: logs[logs.length - 1] || null
  }
}

