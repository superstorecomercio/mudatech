// Helper para importar apenas o provedor de email necessário
// Isso evita que o Next.js tente analisar todos os módulos durante a compilação

export type EmailProvider = 'socketlabs' | 'resend' | 'sendgrid' | 'nodemailer'

export async function getEmailService(provider: EmailProvider) {
  // Importar apenas o provedor selecionado
  switch (provider) {
    case 'socketlabs':
      return await import('./socketlabs')
    case 'resend':
      return await import('./resend')
    case 'sendgrid':
      return await import('./sendgrid')
    case 'nodemailer':
      return await import('./nodemailer')
    default:
      throw new Error(`Provedor não suportado: ${provider}`)
  }
}

