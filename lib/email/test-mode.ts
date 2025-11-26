// Modo de teste para emails - intercepta envios e não envia para clientes reais

interface TestEmailLog {
  to: string | string[]
  subject: string
  html: string
  from: string
  fromName?: string
  replyTo?: string
  timestamp: string
  provider: string
}

// Armazena emails enviados em modo de teste (em memória - cache)
const testEmailLogs: TestEmailLog[] = []

// Cache da configuração do modo de teste (atualizado via API)
let testModeConfig: { enabled: boolean; testEmail?: string } | null = null
let configLoaded = false

/**
 * Define a configuração do modo de teste (chamado pela API)
 * Também marca como carregado para evitar recarregamento desnecessário
 */
export function setTestModeConfig(enabled: boolean, testEmail?: string) {
  testModeConfig = { enabled, testEmail }
  configLoaded = true
  // Log apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ [Test Mode] Cache atualizado: ${enabled ? 'ATIVO' : 'INATIVO'}`)
  }
}

/**
 * Força recarregamento da configuração (invalida cache)
 */
export function resetTestModeConfig() {
  configLoaded = false
  testModeConfig = null
  // Log apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 [Test Mode] Cache invalidado')
  }
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

    // Buscar configuração do modo de teste
    const { data: testModeData, error: testModeError } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'email_test_mode')
      .single()

    // Buscar configuração de email para obter test_email
    const { data: emailConfigData } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'email_config')
      .single()

    // Marcar como carregado mesmo se não encontrar configuração
    configLoaded = true

    if (testModeData?.valor?.enabled !== undefined) {
      const emailConfig = emailConfigData?.valor
      const testEmail = emailConfig?.test_email || process.env.EMAIL_TEST_TO || process.env.ADMIN_EMAIL
      
      const enabledValue = testModeData.valor.enabled === true
      testModeConfig = { 
        enabled: enabledValue,
        testEmail: testEmail || undefined
      }
      // Log apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ [Test Mode] Configuração carregada: ${enabledValue ? 'ATIVO' : 'INATIVO'}`)
      }
    } else {
      // Se não encontrou configuração no banco, marcar como null (não usar NODE_ENV como padrão)
      testModeConfig = null
    }
  } catch (error) {
    // Se não conseguir carregar, marcar como carregado mas sem configuração
    configLoaded = true
    testModeConfig = null
    console.error('⚠️ [Test Mode] Erro ao carregar configuração do banco:', error)
  }
}

/**
 * Verifica se está em modo de teste
 * Prioridade:
 * 1. Configuração do banco de dados (se disponível e carregada)
 * 2. Variável de ambiente EMAIL_TEST_MODE
 * 3. NODE_ENV === 'development' (apenas se não houver configuração explícita)
 */
export async function isTestMode(): Promise<boolean> {
  // Tentar carregar configuração do banco se ainda não foi carregada
  if (!configLoaded) {
    await loadTestModeConfig()
  }
  
  // 1. Verificar configuração do banco (se disponível)
  if (testModeConfig !== null) {
    const isEnabled = testModeConfig.enabled === true
    console.log('📧 [Test Mode] Usando configuração do banco:', {
      enabled: isEnabled,
      rawValue: testModeConfig.enabled,
      type: typeof testModeConfig.enabled
    })
    return isEnabled
  }
  
  // 2. Verificar variável de ambiente (sobrescreve desenvolvimento)
  if (process.env.EMAIL_TEST_MODE === 'true' || process.env.EMAIL_TEST_MODE === '1') {
    console.log('📧 [Test Mode] Usando variável de ambiente: true')
    return true
  }
  
  if (process.env.EMAIL_TEST_MODE === 'false' || process.env.EMAIL_TEST_MODE === '0') {
    console.log('📧 [Test Mode] Usando variável de ambiente: false')
    return false
  }
  
  // 3. Se já carregou do banco e não encontrou configuração, não usar NODE_ENV como padrão
  // Isso garante que se o usuário desativou no painel, não será ativado automaticamente
  if (configLoaded) {
    console.log('📧 [Test Mode] Configuração carregada mas não encontrada, retornando false')
    return false
  }
  
  // 4. Apenas usar NODE_ENV se ainda não carregou do banco (fallback temporário)
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 [Test Mode] Usando NODE_ENV como fallback: development = true')
    return true
  }
  
  console.log('📧 [Test Mode] Nenhuma configuração encontrada, retornando false')
  return false
}

/**
 * Versão síncrona (para compatibilidade) - tenta usar cache
 * ATENÇÃO: Pode retornar resultado incorreto se a configuração não foi carregada
 * Use isTestMode() assíncrona sempre que possível
 */
export function isTestModeSync(): boolean {
  // Se já foi carregado e há configuração, usar ela
  if (configLoaded && testModeConfig !== null) {
    return testModeConfig.enabled
  }
  
  // Se já foi carregado mas não há configuração, retornar false (não usar NODE_ENV)
  if (configLoaded && testModeConfig === null) {
    return false
  }
  
  // Se não foi carregado ainda, verificar variável de ambiente
  if (process.env.EMAIL_TEST_MODE === 'true' || process.env.EMAIL_TEST_MODE === '1') {
    return true
  }
  
  if (process.env.EMAIL_TEST_MODE === 'false' || process.env.EMAIL_TEST_MODE === '0') {
    return false
  }
  
  // Se não foi carregado e não há variável de ambiente, usar NODE_ENV como fallback
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  
  return false
}

/**
 * Obtém o email de teste (redireciona todos os emails para este)
 * Prioridade:
 * 1. Email configurado no banco de dados (via email_config.test_email)
 * 2. Variável de ambiente EMAIL_TEST_TO
 * 3. Variável de ambiente ADMIN_EMAIL
 * 4. Email padrão
 */
export function getTestEmail(): string {
  // 1. Verificar se há email configurado no cache
  if (testModeConfig?.testEmail) {
    return testModeConfig.testEmail
  }
  
  // 2. Verificar variáveis de ambiente
  if (process.env.EMAIL_TEST_TO) {
    return process.env.EMAIL_TEST_TO
  }
  
  if (process.env.ADMIN_EMAIL) {
    return process.env.ADMIN_EMAIL
  }
  
  // 3. Email padrão
  return 'test@mudatech.com.br'
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
    replyTo?: string
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
  
  // Adicionar ao cache em memória
  testEmailLogs.push(log)
  
  // Limitar logs em memória a 100 emails (evitar consumo excessivo de memória)
  if (testEmailLogs.length > 100) {
    testEmailLogs.shift()
  }
  
  // Salvar no banco de dados (email_tracking)
  try {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = createAdminClient()
    
    // Gerar código de rastreamento único
    const codigoRastreamento = `TEST-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    
    const { data, error } = await supabase.from('email_tracking').insert({
      codigo_rastreamento: codigoRastreamento,
      tipo_email: 'teste_configuracao', // Usar tipo_email ao invés de template_tipo
      email_destinatario: Array.isArray(originalTo) ? originalTo.join(', ') : originalTo, // Usar email_destinatario
      assunto: options.subject,
      metadata: {
        modo_teste: true,
        destinatario_original: originalTo,
        destinatario_redirecionado: testEmail,
        provider,
        from: options.from,
        fromName: options.fromName,
        replyTo: options.replyTo || options.from,
        to: Array.isArray(originalTo) ? originalTo.join(', ') : originalTo,
        subject: options.subject,
        html_completo: options.html, // Salvar HTML completo
        html_preview: options.html.substring(0, 500) // Salvar preview do HTML
      }
    }).select()
    
    if (error) {
      console.error('❌ Erro ao salvar log de teste no banco:', error)
      console.error('Detalhes:', JSON.stringify(error, null, 2))
    } else {
      console.log('✅ Log de teste salvo no banco:', codigoRastreamento)
    }
  } catch (error) {
    // Se falhar ao salvar no banco, apenas logar (não quebrar o fluxo)
    console.error('❌ Erro ao salvar log de teste no banco:', error)
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
  // Log apenas em desenvolvimento para não poluir o terminal
  if (process.env.NODE_ENV === 'development') {
    console.log(`📧 [TEST MODE] Email interceptado: ${originalTo.join(', ')} -> ${testEmail} (${provider})`)
  }
  
  return {
    success: true,
    messageId: `test-${Date.now()}`,
    testMode: true
  }
}

/**
 * Obtém logs de emails em modo de teste (do banco de dados)
 */
export async function getTestEmailLogs(): Promise<TestEmailLog[]> {
  try {
    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = createAdminClient()
    
    // Buscar logs de teste do banco - usar tipo_email ao invés de template_tipo
    const { data, error } = await supabase
      .from('email_tracking')
      .select('*')
      .or('tipo_email.eq.teste_configuracao,and(tipo_email.neq.null,metadata->modo_teste.eq.true)')
      .order('enviado_em', { ascending: false })
      .limit(100)
    
    if (error) {
      console.error('❌ [TEST MODE] Erro ao buscar logs de teste:', error)
      // Fallback para cache em memória
      return [...testEmailLogs]
    }
    
    // Converter para formato TestEmailLog
    const logs = (data || []).map(item => {
      // A tabela usa email_destinatario, não destinatario_email
      const emailDestinatario = item.email_destinatario || item.destinatario_email || ''
      const destinatarios = item.metadata?.destinatario_original || 
                           (emailDestinatario.includes(',') ? emailDestinatario.split(',').map((e: string) => e.trim()) : [emailDestinatario])
      
      return {
        to: Array.isArray(destinatarios) ? destinatarios : [destinatarios],
        subject: item.assunto || '',
        html: item.metadata?.html_preview || '', // Usar preview se disponível
        from: item.metadata?.from || '',
        fromName: item.metadata?.fromName,
        timestamp: item.enviado_em || new Date().toISOString(),
        provider: item.metadata?.provider || 'unknown'
      }
    })
    
    return logs
  } catch (error) {
    console.error('Erro ao buscar logs de teste:', error)
    // Fallback para cache em memória
    return [...testEmailLogs]
  }
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
export async function getTestEmailStats() {
  const logs = await getTestEmailLogs()
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

