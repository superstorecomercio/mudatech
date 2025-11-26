# 📧 Integração de Envio de Emails

## Visão Geral

Este documento descreve como integrar um provedor de email (Resend, SendGrid ou Nodemailer) ao sistema MudaTech para envio automático de emails para empresas quando um orçamento é criado.

> **💡 Recomendação:** Use a página de configuração em `/admin/emails/configuracao` para configurar a API de forma visual e testar antes de ativar.

## 📋 Índice

1. [Arquitetura](#arquitetura)
2. [Provedores Suportados](#provedores-suportados)
3. [Configuração](#configuração)
4. [Implementação](#implementação)
5. [Testes](#testes)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura

### Fluxo de Envio

```
Orçamento Criado
    ↓
Sistema identifica empresas (hotsites) relacionadas
    ↓
Para cada empresa:
    ↓
1. Atualiza status_envio_email = 'enviando' em orcamentos_campanhas
2. Chama serviço de email
3. Se sucesso: status_envio_email = 'enviado'
4. Se erro: status_envio_email = 'erro', salva erro
```

### Estrutura de Dados

#### Tabela `orcamentos_campanhas`
Cada linha representa o envio para uma empresa específica:

```sql
- id: UUID
- orcamento_id: UUID → orcamentos(id)
- hotsite_id: UUID → hotsites(id)
- campanha_id: UUID → campanhas(id)
- status_envio_email: 'na_fila' | 'enviando' | 'enviado' | 'erro'
- tentativas_envio: INTEGER
- ultimo_erro_envio: TEXT
- email_enviado_em: TIMESTAMPTZ
- ultima_tentativa_envio: TIMESTAMPTZ
```

---

## 🔌 Provedores Suportados

### 1. SocketLabs ⭐ (Recomendado)

**Vantagens:**
- Alta deliverability
- API robusta e confiável
- Suporte a alto volume
- Dashboard completo com analytics
- Boa para produção

**Como obter credenciais:**
1. Acesse [socketlabs.com](https://www.socketlabs.com)
2. Crie uma conta
3. No dashboard, vá em "Settings" → "API Keys"
4. Anote seu **Server ID** (número, ex: 12345)
5. Crie uma nova API Key ou use uma existente
6. Copie o **Server ID** e a **API Key**
7. Verifique seu domínio em "Settings" → "Domains"

**Instalação:**
```bash
npm install @socketlabs/email
```

### 2. Resend

**Vantagens:**
- Fácil de usar
- Boa deliverability
- API simples
- 3.000 emails/mês grátis

**Como obter credenciais:**
1. Acesse [resend.com](https://resend.com)
2. Crie uma conta
3. Vá em "API Keys" → "Create API Key"
4. Copie a chave (começa com `re_`)
5. Adicione e verifique seu domínio em "Domains"

### 3. SendGrid

**Vantagens:**
- Muito popular
- 100 emails/dia grátis
- Boa documentação

**Como obter credenciais:**
1. Acesse [sendgrid.com](https://sendgrid.com)
2. Crie uma conta
3. Vá em "Settings" → "API Keys"
4. Crie uma API Key com permissão "Mail Send"
5. Copie a chave (começa com `SG.`)

### 4. Nodemailer (SMTP)

**Vantagens:**
- Funciona com qualquer servidor SMTP
- Gmail, Outlook, etc.

**Configuração:**
- Host SMTP
- Porta (587 para TLS, 465 para SSL)
- Usuário e senha

---

## ⚙️ Configuração

### Opção 1: Página de Configuração (Recomendado)

1. Acesse `/admin/emails/configuracao`
2. Preencha os campos:
   - Provedor
   - API Key
   - Email remetente
   - Nome do remetente
3. Clique em "Testar Configuração"
4. Se o teste passar, clique em "Salvar"

### Opção 2: Variáveis de Ambiente

Adicione no `.env.local`:

```env
# SocketLabs (Recomendado)
SOCKETLABS_SERVER_ID=12345
SOCKETLABS_API_KEY=sua-api-key
EMAIL_FROM=noreply@mudatech.com.br
EMAIL_FROM_NAME=MudaTech
EMAIL_REPLY_TO=contato@mudatech.com.br

# Ou Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@mudatech.com.br
EMAIL_FROM_NAME=MudaTech
EMAIL_REPLY_TO=contato@mudatech.com.br

# Ou SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=noreply@mudatech.com.br

# Ou SMTP (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
```

---

## 💻 Implementação

### Passo 1: Criar Serviço de Email

Crie o arquivo `lib/email/resend.ts`:

```typescript
import { Resend } from 'resend'

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
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
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
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    }
  }
}
```

### Passo 2: Criar Serviço SendGrid

Crie o arquivo `lib/email/sendgrid.ts`:

```typescript
import sgMail from '@sendgrid/mail'

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
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    sgMail.setApiKey(config.apiKey)

    const msg = {
      to: Array.isArray(options.to) ? options.to : [options.to],
      from: options.fromName 
        ? `${options.fromName} <${options.from}>`
        : options.from,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo
    }

    const [response] = await sgMail.send(msg)

    return {
      success: true,
      messageId: response.headers['x-message-id'] as string
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.body?.errors?.[0]?.message || error.message || 'Erro ao enviar email'
    }
  }
}
```

### Passo 3: Criar Serviço Nodemailer

Crie o arquivo `lib/email/nodemailer.ts`:

```typescript
import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  from: string
  fromName?: string
  replyTo?: string
}

interface ConfigOptions {
  apiKey?: string
  host: string
  port: number
  user: string
  pass: string
  secure?: boolean
}

export async function sendEmail(
  options: EmailOptions,
  config: ConfigOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure || config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass
      }
    })

    const info = await transporter.sendMail({
      from: options.fromName 
        ? `${options.fromName} <${options.from}>`
        : options.from,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo
    })

    return {
      success: true,
      messageId: info.messageId
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro ao enviar email'
    }
  }
}
```

### Passo 4: Instalar Dependências

```bash
# Para Resend
npm install resend

# Para SendGrid
npm install @sendgrid/mail

# Para Nodemailer
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Passo 5: Atualizar API de Envio

Atualize `app/api/admin/emails/enviar/route.ts` para usar o serviço real:

```typescript
// ... código existente ...

// Importar serviço de email
import { getEmailConfig } from '@/lib/email/config'
import { sendEmail as sendEmailResend } from '@/lib/email/resend'
// ou import { sendEmail as sendEmailSendGrid } from '@/lib/email/sendgrid'

// Dentro da função de envio:
const emailConfig = await getEmailConfig()

if (!emailConfig || !emailConfig.ativo) {
  return NextResponse.json(
    { error: 'Configuração de email não ativa' },
    { status: 400 }
  )
}

// Buscar dados do orçamento e empresa
const { data: orcamento } = await supabase
  .from('orcamentos')
  .select('*')
  .eq('id', orcamentoId)
  .single()

const { data: hotsite } = await supabase
  .from('hotsites')
  .select('*')
  .eq('id', vinculo.hotsite_id)
  .single()

// Importar template
import { criarTemplateEmailOrcamento } from '@/lib/email/templates'

// Criar template do email
const emailHtml = criarTemplateEmailOrcamento(orcamento, hotsite)

// Enviar email (exemplo com SocketLabs)
const result = await sendEmailSocketLabs({
  to: hotsite.email,
  subject: `Novo Orçamento de Mudança - ${orcamento.codigo_orcamento}`,
  html: emailHtml,
  from: emailConfig.from_email,
  fromName: emailConfig.from_name,
  replyTo: emailConfig.reply_to
}, {
  serverId: emailConfig.server_id!,
  apiKey: emailConfig.api_key
})

// Para outros provedores, use:
// Resend: { apiKey: emailConfig.api_key }
// SendGrid: { apiKey: emailConfig.api_key }

if (!result.success) {
  // Atualizar status para erro
  await supabase
    .from('orcamentos_campanhas')
    .update({
      status_envio_email: 'erro',
      ultimo_erro_envio: result.error
    })
    .eq('id', empresaId)
  
  throw new Error(result.error)
}

// Atualizar status para enviado
await supabase
  .from('orcamentos_campanhas')
  .update({
    status_envio_email: 'enviado',
    email_enviado_em: new Date().toISOString()
  })
  .eq('id', empresaId)
```

---

## 🧪 Testes

### Teste Manual

1. Acesse `/admin/emails/configuracao`
2. Preencha as credenciais
3. Clique em "Testar Configuração"
4. Verifique se recebeu o email de teste

### Teste Automático

Crie um script de teste em `scripts/test-email.ts`:

```typescript
import { sendEmail } from '@/lib/email/resend'

async function test() {
  const result = await sendEmail({
    to: 'seu-email@exemplo.com',
    subject: 'Teste',
    html: '<p>Teste</p>',
    from: 'noreply@mudatech.com.br',
    fromName: 'MudaTech'
  }, {
    apiKey: process.env.RESEND_API_KEY!
  })

  console.log(result)
}

test()
```

---

## 🔧 Troubleshooting

### Erro: "API Key inválida"
- Verifique se a chave está correta
- Confirme que não há espaços extras
- Para Resend: verifique se o domínio está verificado

### Erro: "Email não verificado"
- Resend: Adicione e verifique o domínio em "Domains"
- SendGrid: Verifique o remetente em "Settings" → "Sender Authentication"

### Emails não estão sendo enviados
1. Verifique se `ativo = true` na configuração
2. Verifique os logs em `/admin/emails`
3. Confirme que as empresas têm email cadastrado
4. Verifique se o status está como "na_fila"

### Erro de rate limit
- Resend: 3.000 emails/mês no plano gratuito
- SendGrid: 100 emails/dia no plano gratuito
- Considere fazer upgrade do plano

---

## 📊 Monitoramento

### Página de Controle

Acesse `/admin/emails` para:
- Ver status de envio por empresa
- Reenviar emails que falharam
- Recolocar na fila
- Ver erros detalhados

### Logs

Os erros são salvos em:
- `orcamentos_campanhas.ultimo_erro_envio`
- Console do servidor
- Logs do provedor (Resend/SendGrid dashboard)

---

## 🔐 Segurança

### Boas Práticas

1. **Nunca commite credenciais** no código
2. Use variáveis de ambiente em produção
3. Rotacione API Keys periodicamente
4. Use domínios verificados
5. Configure SPF/DKIM/DMARC

### Armazenamento

As credenciais são armazenadas em:
- Tabela `configuracoes` (criptografada em produção)
- Variáveis de ambiente (recomendado)

---

## 📝 Próximos Passos

1. ✅ Criar serviços de email (Resend, SendGrid, Nodemailer)
2. ✅ Implementar template de email
3. ✅ Integrar com sistema de envio automático
4. ✅ Adicionar retry automático para falhas
5. ✅ Implementar webhooks para status de entrega

---

## 📚 Referências

- [Resend Docs](https://resend.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com)
- [Nodemailer Docs](https://nodemailer.com)

