import { createServerClient } from '@/lib/supabase/server'

export interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'nodemailer' | 'socketlabs' | null
  api_key: string
  server_id?: string // Para SocketLabs
  from_email: string
  from_name: string
  reply_to: string
  ativo: boolean
  testado: boolean
  ultimo_teste?: string
  erro_teste?: string
}

export async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'email_config')
      .single()

    if (error || !data) {
      // Fallback para variáveis de ambiente
      return {
        provider: (process.env.EMAIL_PROVIDER as any) || null,
        api_key: process.env.SOCKETLABS_API_KEY || process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || '',
        server_id: process.env.SOCKETLABS_SERVER_ID,
        from_email: process.env.EMAIL_FROM || '',
        from_name: process.env.EMAIL_FROM_NAME || 'MudaTech',
        reply_to: process.env.EMAIL_REPLY_TO || '',
        ativo: !!(process.env.SOCKETLABS_API_KEY || process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY),
        testado: false
      }
    }

    return data.valor as EmailConfig
  } catch (error) {
    console.error('Erro ao buscar configuração de email:', error)
    return null
  }
}

