# Documentação: Rotas de Envio de Emails e Cron Jobs

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Rotas Disponíveis](#rotas-disponíveis)
3. [Configuração de Cron Jobs na Vercel](#configuração-de-cron-jobs-na-vercel)
4. [Modo de Teste](#modo-de-teste)
5. [Sistema de Retry](#sistema-de-retry)
6. [Tracking de Emails](#tracking-de-emails)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema de envio de emails possui 5 rotas principais que podem ser executadas manualmente ou automaticamente via cron jobs. Todas as rotas respeitam o modo de teste configurado no painel admin.

### Características Principais

- ✅ **Modo de Teste**: Emails interceptados quando ativo
- ✅ **Retry Automático**: Até 3 tentativas para emails com erro
- ✅ **Tracking Completo**: Todos os emails são rastreados
- ✅ **Limite de Processamento**: Proteção contra sobrecarga
- ✅ **Tratamento de Erros**: Logs detalhados de falhas

---

## 📧 Rotas Disponíveis

### 1. Enviar Emails Pendentes

**Endpoint:** `POST /api/admin/emails/enviar-pendentes`

**Descrição:**  
Envia emails de orçamentos para empresas que estão na fila de envio ou com erro (menos de 3 tentativas). Esta é a rota principal que será executada automaticamente a cada 10 minutos.

**Parâmetros:**  
Nenhum (busca automaticamente na base de dados)

**Processamento:**
- Busca até 50 vínculos `orcamentos_campanhas` com status `'na_fila'` ou `'erro'` (com `tentativas_envio < 3`)
- Para cada vínculo:
  1. Atualiza status para `'enviando'`
  2. Incrementa `tentativas_envio`
  3. Processa template `'orcamento_empresa'`
  4. Envia email via provedor configurado
  5. Atualiza status para `'enviado'` ou `'erro'`
  6. Salva tracking no banco

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Processados 10 emails: 8 enviados, 2 erros",
  "enviados": 8,
  "erros": 2,
  "detalhes": [
    {
      "empresa": "Empresa ABC",
      "status": "enviado"
    },
    {
      "empresa": "Empresa XYZ",
      "status": "erro",
      "erro": "Email inválido"
    }
  ]
}
```

**Resposta de Erro:**
```json
{
  "error": "Configuração de email não encontrada ou inativa"
}
```

**Frequência Recomendada:** A cada 10 minutos

---

### 2. Enviar Email para Cliente

**Endpoint:** `POST /api/admin/emails/enviar-para-cliente`

**Descrição:**  
Envia email de confirmação de recebimento do orçamento para o cliente que preencheu o formulário.

**Parâmetros:**
```json
{
  "orcamentoId": "uuid-do-orcamento"
}
```

**Processamento:**
- Busca orçamento pelo ID
- Valida se possui email do cliente
- Processa template `'confirmacao_cliente'`
- Envia email para o cliente
- Salva tracking

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Email enviado com sucesso para o cliente",
  "codigo_rastreamento": "TRACK-1234567890-ABC123"
}
```

**Quando Usar:**  
- Após criação de novo orçamento (evento)
- Manualmente pelo admin quando necessário

**Frequência:** Evento (não precisa de cron)

---

### 3. Enviar Prospecção de Clientes

**Endpoint:** `POST /api/admin/emails/enviar-prospeccao-clientes`

**Descrição:**  
Envia emails de ofertas e promoções para potenciais clientes (prospecção para vender anúncios).

**Parâmetros:**
```json
{
  "emails": [
    "cliente1@example.com",
    "cliente2@example.com"
  ]
}
```

**Processamento:**
- Valida cada email
- Processa template `'prospeccao_clientes'`
- Envia email para cada destinatário
- Salva tracking individual

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Processados 5 emails: 4 enviados, 1 erros",
  "enviados": 4,
  "erros": 1,
  "detalhes": [
    {
      "email": "cliente1@example.com",
      "status": "enviado"
    },
    {
      "email": "cliente2@example.com",
      "status": "erro",
      "erro": "Email inválido"
    }
  ]
}
```

**Quando Usar:**  
- Campanhas de marketing
- Prospecção de novos clientes
- Ofertas especiais

**Frequência:** Manual ou conforme estratégia de marketing (ex: semanal)

---

### 4. Enviar Ativação de Campanha

**Endpoint:** `POST /api/admin/emails/enviar-ativacao-campanha`

**Descrição:**  
Envia email de notificação quando uma campanha é ativada para a empresa dona da campanha.

**Parâmetros:**
```json
{
  "campanhaId": "uuid-da-campanha"
}
```

**Processamento:**
- Busca campanha e hotsite relacionado
- Valida email da empresa
- Processa template `'ativacao_campanha'`
- Envia email para a empresa
- Salva tracking

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Email de ativação enviado com sucesso",
  "codigo_rastreamento": "TRACK-1234567890-ABC123"
}
```

**Quando Usar:**  
- Quando uma campanha é ativada (evento)
- Pode ser chamado automaticamente no código de ativação de campanha

**Frequência:** Evento (não precisa de cron)

---

### 5. Enviar Vencimento de Campanha

**Endpoint:** `POST /api/admin/emails/enviar-vencimento-campanha`

**Descrição:**  
Envia emails de aviso para empresas cujas campanhas estão próximas do vencimento.

**Parâmetros:**
```json
{
  "diasAntecedencia": 7  // Opcional, padrão: 7 dias
}
```

**Processamento:**
- Busca campanhas ativas que vencem em até `diasAntecedencia` dias
- Para cada campanha:
  1. Calcula dias restantes
  2. Processa template `'vencimento_campanha'`
  3. Envia email para a empresa
  4. Salva tracking

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Processadas 3 campanhas: 3 emails enviados, 0 erros",
  "enviados": 3,
  "erros": 0,
  "detalhes": [
    {
      "empresa": "Empresa ABC",
      "campanha": "Campanha SP 2025",
      "status": "enviado"
    }
  ]
}
```

**Quando Usar:**  
- Verificação diária de campanhas próximas do vencimento
- Avisos preventivos para renovação

**Frequência Recomendada:** Diário (1x por dia)

---

## ⚙️ Configuração de Cron Jobs na Vercel

### Arquivo `vercel.json`

Crie ou edite o arquivo `vercel.json` na raiz do projeto:

```json
{
  "crons": [
    {
      "path": "/api/admin/emails/enviar-pendentes",
      "schedule": "*/10 * * * *"
    },
    {
      "path": "/api/admin/emails/enviar-vencimento-campanha",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Explicação dos Schedules

#### Formato Cron: `minuto hora dia mês dia-da-semana`

- `*/10 * * * *` - A cada 10 minutos
  - Executa: 00:00, 00:10, 00:20, 00:30, etc.

- `0 9 * * *` - Diariamente às 9:00
  - Executa: Todos os dias às 09:00

- `0 */6 * * *` - A cada 6 horas
  - Executa: 00:00, 06:00, 12:00, 18:00

- `0 0 * * 1` - Toda segunda-feira à meia-noite
  - Executa: Segundas-feiras às 00:00

### Recomendações de Configuração

| Rota | Frequência | Schedule | Motivo |
|------|-----------|----------|--------|
| `enviar-pendentes` | A cada 10 min | `*/10 * * * *` | Processar emails pendentes rapidamente |
| `enviar-vencimento-campanha` | Diário | `0 9 * * *` | Verificar vencimentos uma vez por dia |
| `enviar-prospeccao-clientes` | Manual | - | Executar conforme estratégia de marketing |
| `enviar-para-cliente` | Evento | - | Chamado automaticamente no código |
| `enviar-ativacao-campanha` | Evento | - | Chamado automaticamente no código |

### Autenticação de Cron Jobs

**⚠️ IMPORTANTE:** As rotas de cron devem ser protegidas para evitar execução não autorizada.

#### Opção 1: Header de Autenticação (Recomendado)

Adicione verificação de header nas rotas:

```typescript
// No início de cada rota
const authHeader = request.headers.get('authorization')
const cronSecret = process.env.CRON_SECRET

if (authHeader !== `Bearer ${cronSecret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

Configure no `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/admin/emails/enviar-pendentes",
      "schedule": "*/10 * * * *",
      "headers": {
        "Authorization": "Bearer YOUR_CRON_SECRET"
      }
    }
  ]
}
```

E adicione `CRON_SECRET` nas variáveis de ambiente da Vercel.

#### Opção 2: Verificação de User-Agent

A Vercel envia um User-Agent específico nos cron jobs:

```typescript
const userAgent = request.headers.get('user-agent')
if (!userAgent?.includes('vercel-cron')) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Limites da Vercel

- **Plano Hobby**: 2 cron jobs simultâneos
- **Plano Pro**: 10 cron jobs simultâneos
- **Timeout**: Máximo de 10 segundos por execução (Hobby) ou 60 segundos (Pro)

**Nota:** Se o processamento demorar mais que o timeout, considere processar em lotes menores ou usar um serviço externo.

---

## 🧪 Modo de Teste

### Como Funciona

Quando o modo de teste está ativo (configurado em `/admin/emails/test-mode`):

1. ✅ Emails são interceptados antes do envio real
2. ✅ Conteúdo é salvo na tabela `email_tracking`
3. ✅ Email é redirecionado para o endereço de teste configurado
4. ✅ Aviso visual é adicionado no HTML do email
5. ✅ Status retorna como `success: true` (simulado)

### Verificar Status do Modo de Teste

```bash
GET /api/admin/emails/test-mode/status
```

Resposta:
```json
{
  "enabled": true,
  "testEmail": "test@mudatech.com.br"
}
```

### Logs de Teste

Todos os emails interceptados podem ser visualizados em:
- `/admin/emails/test-mode` - Página de logs de teste
- `/admin/emails/logs` - Logs completos (inclui testes)

---

## 🔄 Sistema de Retry

### Fluxo de Retry Automático

```
1. Email na fila (status: 'na_fila')
   ↓
2. Rota executa → Status: 'enviando' → Tentativa: 1
   ↓
3a. Sucesso → Status: 'enviado' ✅
3b. Erro → Status: 'erro' → Tentativa: 1
   ↓
4. Próxima execução (10 min) → Status: 'na_fila' → Tentativa: 2
   ↓
5a. Sucesso → Status: 'enviado' ✅
5b. Erro → Status: 'erro' → Tentativa: 2
   ↓
6. Próxima execução (10 min) → Status: 'na_fila' → Tentativa: 3
   ↓
7a. Sucesso → Status: 'enviado' ✅
7b. Erro → Status: 'erro' → Tentativa: 3 → NÃO TENTA MAIS
```

### Regras de Retry

- ✅ Máximo de **3 tentativas** por email
- ✅ Retry automático apenas para status `'erro'` com `tentativas_envio < 3`
- ✅ Após 3 tentativas, email permanece com status `'erro'` e requer intervenção manual
- ✅ Intervalo entre tentativas: **10 minutos** (frequência do cron)

### Recolocar na Fila Manualmente

Via painel admin (`/admin/emails`):
- Botão "Recolocar na Fila" disponível para emails com erro
- Reseta `tentativas_envio` para 0
- Permite novas tentativas automáticas

---

## 📊 Tracking de Emails

### Tabela `email_tracking`

Todos os emails enviados são registrados na tabela `email_tracking`:

```sql
CREATE TABLE email_tracking (
  id UUID PRIMARY KEY,
  codigo_rastreamento VARCHAR(50) UNIQUE,
  orcamento_id UUID,
  campanha_id UUID,
  hotsite_id UUID,
  tipo_email VARCHAR(100),
  email_destinatario VARCHAR(255),
  assunto VARCHAR(500),
  enviado_em TIMESTAMPTZ,
  visualizado BOOLEAN,
  visualizado_em TIMESTAMPTZ,
  clicado BOOLEAN,
  clicado_em TIMESTAMPTZ,
  metadata JSONB
);
```

### Código de Rastreamento

Cada email recebe um código único no formato:
```
TRACK-{timestamp}-{random}
Exemplo: TRACK-1701234567890-ABC123
```

**Uso:** Identificar se um email foi repassado/encaminhado pelo destinatário.

### Tipos de Email (`tipo_email`)

- `orcamento_empresa` - Orçamento enviado para empresa
- `confirmacao_cliente` - Confirmação enviada para cliente
- `prospeccao_clientes` - Email de prospecção
- `ativacao_campanha` - Notificação de ativação de campanha
- `vencimento_campanha` - Aviso de vencimento de campanha
- `teste_configuracao` - Email de teste de configuração

### Visualizar Logs

- **Página Admin:** `/admin/emails/logs`
- **API:** `GET /api/admin/emails/logs/[codigo]`

---

## 🔍 Troubleshooting

### Problema: Emails não estão sendo enviados

**Verificações:**
1. ✅ Modo de teste está desativado?
2. ✅ Configuração de email está ativa e testada?
3. ✅ Provedor de email está configurado corretamente?
4. ✅ Cron job está configurado no `vercel.json`?
5. ✅ Logs mostram algum erro específico?

**Solução:**
- Verificar logs em `/admin/emails/logs`
- Testar configuração em `/admin/emails/configuracao`
- Verificar status do modo de teste

### Problema: Cron job não está executando

**Verificações:**
1. ✅ Arquivo `vercel.json` está na raiz do projeto?
2. ✅ Schedule está no formato correto?
3. ✅ Rota está acessível (sem erros 404)?
4. ✅ Deploy foi feito após adicionar o cron?

**Solução:**
- Verificar logs da Vercel (Dashboard → Deployments → Functions)
- Testar rota manualmente via POST
- Verificar se cron está ativo no dashboard da Vercel

### Problema: Timeout na execução

**Causa:** Processamento de muitos emails excede o limite de tempo.

**Solução:**
- Reduzir limite de processamento (atualmente 50 por execução)
- Processar em lotes menores
- Considerar upgrade para plano Pro (60s timeout)

### Problema: Emails ficam em "erro" após 3 tentativas

**Causa:** Erro persistente (ex: email inválido, provedor indisponível).

**Solução:**
- Verificar `ultimo_erro_envio` no banco de dados
- Recolocar manualmente na fila após corrigir o problema
- Verificar se email do destinatário está correto

---

## 📝 Checklist de Implementação

### Antes de Configurar os Crons

- [ ] Todas as rotas foram testadas manualmente
- [ ] Modo de teste foi desativado (se necessário)
- [ ] Configuração de email está funcionando
- [ ] Templates de email estão criados e ativos
- [ ] Autenticação de cron está implementada
- [ ] Variáveis de ambiente estão configuradas na Vercel

### Configuração do Cron

- [ ] Arquivo `vercel.json` criado/atualizado
- [ ] Schedules configurados corretamente
- [ ] Headers de autenticação configurados (se aplicável)
- [ ] Deploy realizado na Vercel
- [ ] Cron jobs aparecem no dashboard da Vercel

### Após Configuração

- [ ] Monitorar logs das primeiras execuções
- [ ] Verificar se emails estão sendo enviados
- [ ] Confirmar que tracking está funcionando
- [ ] Ajustar frequências se necessário

---

## 🔗 Links Úteis

- **Painel de Gerenciamento:** `/admin/emails/rotas`
- **Configuração de Email:** `/admin/emails/configuracao`
- **Modo de Teste:** `/admin/emails/test-mode`
- **Logs de Emails:** `/admin/emails/logs`
- **Controle de Envio:** `/admin/emails`

---

## 📚 Referências

- [Documentação Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Formato Cron Expression](https://crontab.guru/)
- [Documentação Email Templates](./TEMPLATES_EMAIL.md)
- [Documentação Integração Email](./INTEGRACAO_EMAIL.md)

---

**Última atualização:** 2025-01-XX  
**Versão:** 1.0.0

