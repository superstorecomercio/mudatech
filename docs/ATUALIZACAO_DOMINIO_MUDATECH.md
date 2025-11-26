# 🔄 Atualização de Domínio para mudatech.com.br

## ✅ Alterações Realizadas

### 1. Código Principal

#### Emails de Contato
- ✅ `app/components/new/Footer.tsx` - Atualizado email de `contato@guiademudancas.com.br` para `contato@mudatech.com.br`
- ✅ `app/contato/page.tsx` - Atualizado email de `contato@guiademudancas.com.br` para `contato@mudatech.com.br`

#### VPS (Código do WhatsApp Bot)
- ✅ `vps-code/codigo/server.js` - Atualizado console.log do webhook URL (informativo)

### 2. Documentação

- ✅ `docs/SOLUCAO_URL_CURTA_PROPRIO.md` - Atualizado todas as referências de `novoguia.vercel.app` para `mudatech.com.br`
- ✅ `docs/MUDANCA_DOMINIO_VERCEL.md` - Atualizado para refletir mudança para `mudatech.com.br`
- ✅ `docs/INTEGRACAO_VPS_NEXTJS_COMPLETA.md` - Atualizado URL de produção

## ⚙️ Configurações Necessárias

### 1. Variáveis de Ambiente (Opcional)

Se você usa a rota `/api/w` para encurtar URLs, pode configurar na VPS:

```bash
# No arquivo .env da VPS
API_BASE_URL=https://mudatech.com.br
```

**Nota:** Se não configurar, o código usa `is.gd`/`v.gd`/`0x0.st` para encurtar URLs diretamente do WhatsApp, então não precisa dessa variável.

### 2. Variável NEXT_PUBLIC_BASE_URL (Opcional)

Se você usa a variável `NEXT_PUBLIC_BASE_URL` em algum lugar (ex: `app/admin/cidades/page.tsx`), configure no `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=https://mudatech.com.br
```

**Nota:** O código tem fallback para `http://localhost:3000` em desenvolvimento, então não é obrigatório.

### 3. Vercel - Configuração de Domínio

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto
3. Vá em **Settings** → **Domains**
4. Adicione o domínio customizado: `mudatech.com.br`
5. Configure o DNS conforme instruções da Vercel

### 4. Facebook/Meta - Webhook URL (Se necessário)

Se o webhook do WhatsApp estiver configurado para usar o domínio principal:

1. Acesse: https://developers.facebook.com/
2. Vá em **WhatsApp** → **Configuration**
3. Atualize a **Webhook URL** para: `https://mudatech.com.br/webhook`
4. Ou mantenha usando DuckDNS se preferir: `https://mudancas.duckdns.org/webhook`

**Nota:** O código da VPS está configurado para receber webhooks em qualquer domínio, então não precisa alterar nada no código.

## 📋 Checklist de Verificação

- [x] Emails de contato atualizados no código
- [x] Documentação atualizada
- [x] Console.log do VPS atualizado (informativo)
- [ ] Domínio configurado na Vercel
- [ ] DNS configurado corretamente
- [ ] Webhook do Facebook atualizado (se necessário)
- [ ] Testar site em `https://mudatech.com.br`
- [ ] Testar API em `https://mudatech.com.br/api/orcamentos`
- [ ] Testar rota de encurtamento em `https://mudatech.com.br/api/w`

## 🔍 URLs Importantes

- **Site Principal:** https://mudatech.com.br
- **API Orçamentos:** https://mudatech.com.br/api/orcamentos
- **API Calculadora:** https://mudatech.com.br/api/calcular-orcamento
- **API Encurtamento:** https://mudatech.com.br/api/w
- **Webhook VPS:** https://mudancas.duckdns.org/webhook (ou mudatech.com.br/webhook se configurado)

## 📝 Notas

- As variáveis de ambiente do Supabase (`NEXT_PUBLIC_SUPABASE_URL`, etc.) **não precisam** ser alteradas
- O código da VPS não faz chamadas HTTP para a API do Next.js - ele usa Supabase diretamente
- A rota `/api/w` é usada apenas se você implementar encurtamento próprio (atualmente usa is.gd/v.gd/0x0.st)

