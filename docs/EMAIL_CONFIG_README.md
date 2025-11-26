# ⚙️ Configuração de Emails - Guia Rápido

## 🎯 Por que uma página de configuração?

**SIM, é melhor ter uma página de configuração!** Aqui estão os motivos:

### ✅ Vantagens

1. **Facilidade de uso**: Interface visual ao invés de editar arquivos
2. **Teste integrado**: Pode testar a configuração antes de ativar
3. **Segurança**: Credenciais armazenadas no banco (criptografadas em produção)
4. **Flexibilidade**: Pode trocar de provedor sem alterar código
5. **Histórico**: Mantém histórico de testes e erros
6. **Acesso controlado**: Apenas admins podem configurar

### 📍 Onde encontrar

- **Página de Configuração**: `/admin/emails/configuracao`
- **Controle de Envios**: `/admin/emails`
- **Menu Admin**: Link "Config. Emails" no sidebar

---

## 🚀 Como Usar

### 1. Acesse a Página de Configuração

Navegue até `/admin/emails/configuracao` no dashboard admin.

### 2. Escolha um Provedor

- **SocketLabs** (Recomendado): Alta deliverability, ideal para produção
- **Resend**: Mais fácil, 3.000 emails/mês grátis
- **SendGrid**: Popular, 100 emails/dia grátis
- **Nodemailer**: SMTP genérico (Gmail, Outlook, etc.)

### 3. Preencha as Credenciais

- **Server ID** (apenas SocketLabs): Seu Server ID do SocketLabs
- **API Key**: Chave do provedor escolhido
- **Email Remetente**: Email verificado no provedor
- **Nome do Remetente**: Nome que aparecerá (ex: "MudaTech")
- **Email para Resposta**: Onde receber respostas (opcional)

### 4. Teste a Configuração

Clique em "Testar Configuração" para enviar um email de teste.

### 5. Ative o Envio

Marque "Ativar envio automático" e salve.

---

## 📦 O que foi criado

### Páginas
- ✅ `/admin/emails/configuracao` - Página de configuração
- ✅ `/admin/emails` - Controle de envios (atualizada)

### APIs
- ✅ `/api/admin/emails/config` - Salvar/buscar configuração
- ✅ `/api/admin/emails/test` - Testar configuração
- ✅ `/api/admin/emails/enviar` - Enviar email (atualizada)
- ✅ `/api/admin/emails/recolocar-fila` - Recolocar na fila (atualizada)

### Serviços de Email
- ✅ `lib/email/socketlabs.ts` - Serviço SocketLabs (Recomendado)
- ✅ `lib/email/resend.ts` - Serviço Resend
- ✅ `lib/email/sendgrid.ts` - Serviço SendGrid
- ✅ `lib/email/nodemailer.ts` - Serviço Nodemailer
- ✅ `lib/email/config.ts` - Gerenciar configuração
- ✅ `lib/email/templates.ts` - Template HTML de email

### Banco de Dados
- ✅ Migration `032_criar_tabela_configuracoes.sql` - Tabela de configurações
- ✅ Migration `031_controle_envio_por_empresa.sql` - Controle por empresa

### Documentação
- ✅ `docs/INTEGRACAO_EMAIL.md` - Documentação completa
- ✅ `docs/EMAIL_CONFIG_README.md` - Este guia

---

## 🔧 Próximos Passos

1. **Aplicar Migrations**:
   ```bash
   # No Supabase Dashboard ou via CLI
   supabase migration up
   ```

2. **Instalar Dependências** (escolha uma):
   ```bash
   # Para SocketLabs (recomendado)
   npm install @socketlabs/email
   
   # Ou Resend
   npm install resend
   
   # Ou SendGrid
   npm install @sendgrid/mail
   
   # Ou Nodemailer
   npm install nodemailer
   npm install --save-dev @types/nodemailer
   ```

3. **Configurar via Interface**:
   - Acesse `/admin/emails/configuracao`
   - Preencha as credenciais
   - Teste e ative

4. **Integrar Envio Real**:
   - Atualize `app/api/admin/emails/enviar/route.ts`
   - Substitua a simulação pelo envio real
   - Veja exemplo completo em `docs/INTEGRACAO_EMAIL.md`

---

## 💡 Dica

A página de configuração permite:
- ✅ Testar antes de ativar
- ✅ Ver status de teste
- ✅ Trocar de provedor facilmente
- ✅ Desativar temporariamente sem perder configuração

**Muito melhor que editar variáveis de ambiente manualmente!** 🎉

