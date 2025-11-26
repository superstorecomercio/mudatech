// Serviço de email usando Resend
// Para usar: npm install resend

import { isTestMode, interceptTestEmail } from './test-mode'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from: string
  fromName?: string
  replyTo?: string
}

interface ConfigOptions {
  apiKey: string
}

export async function sendEmail(
  options: EmailOptions,
  config: ConfigOptions
): Promise<{ success: boolean; messageId?: string; error?: string; testMode?: boolean }> {
  // Interceptar em modo de teste
  if (isTestMode()) {
    return interceptTestEmail(options, 'resend')
  }

  try {
    // Dynamic import com tratamento de erro silencioso
    let Resend: any
    try {
      const resendModule = await import('resend')
      Resend = resendModule.Resend || (resendModule as any).default?.Resend || (resendModule as any).default
      if (!Resend) {
        throw new Error('Resend não encontrado no módulo')
      }
    } catch (importError: any) {
      if (importError.code === 'MODULE_NOT_FOUND' || importError.message?.includes('Cannot find module')) {
        return {
          success: false,
          error: 'Pacote "resend" não instalado. Execute: npm install resend'
        }
      }
      throw importError
    }
    
    const resend = new Resend(config.apiKey)

    const { data, error } = await resend.emails.send({
      from: options.fromName 
        ? `${options.fromName} <${options.from}>`
        : options.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      reply_to: options.replyTo
    })

    if (error) {
      throw new Error(error.message || 'Erro ao enviar email')
    }

    return {
      success: true,
      messageId: data?.id
    }
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return {
        success: false,
        error: 'Pacote "resend" não instalado. Execute: npm install resend'
      }
    }
    
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao enviar email'
    }
  }
}

