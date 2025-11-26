// Helper para importar serviços de email dinamicamente
// Isso evita que o Turbopack tente analisar todos os módulos durante a compilação

export async function importEmailService(provider: 'socketlabs' | 'resend' | 'sendgrid' | 'nodemailer') {
  // Construir caminho dinamicamente usando switch para evitar análise estática
  let modulePath: string
  switch (provider) {
    case 'socketlabs':
      modulePath = '@/lib/email/socketlabs'
      break
    case 'resend':
      modulePath = '@/lib/email/resend'
      break
    case 'sendgrid':
      modulePath = '@/lib/email/sendgrid'
      break
    case 'nodemailer':
      modulePath = '@/lib/email/nodemailer'
      break
    default:
      throw new Error(`Provedor não suportado: ${provider}`)
  }
  
  try {
    // Import dinâmico - o Turbopack pode mostrar warnings, mas não quebra a aplicação
    const module = await import(modulePath)
    return module
  } catch (error: any) {
    // Se o módulo não existe, retornar erro informativo
    if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot find module')) {
      const packageMap: Record<string, string> = {
        resend: 'resend',
        sendgrid: '@sendgrid/mail',
        nodemailer: 'nodemailer',
        socketlabs: '@socketlabs/email'
      }
      
      throw new Error(`Pacote "${packageMap[provider]}" não instalado. Execute: npm install ${packageMap[provider]}`)
    }
    throw error
  }
}
