# Verificação Pós-Deploy

## ✅ Checklist de Verificação

### 1. Verificar Logs da Aplicação

```bash
ssh root@38.242.148.169 'pm2 logs whatsapp-webhook --lines 50'
```

**O que procurar:**
- ✅ `✅ Módulo url-shortener carregado com sucesso`
- ✅ `✅ URL encurtada com is.gd: https://is.gd/xxxxx`
- ✅ `Link WhatsApp encurtado criado para [Nome da Empresa]`
- ❌ Se aparecer `⚠️ TINYURL_API_TOKEN não configurado` - IGNORAR (não estamos usando mais)
- ❌ Se aparecer `⚠️ Telefone inválido` - Verificar telefone no banco

### 2. Testar Criando um Orçamento

1. Enviar "oi" no WhatsApp do bot
2. Seguir o fluxo completo do orçamento
3. Verificar mensagem final

**O que verificar na mensagem final:**
- ✅ Todas as empresas aparecem (não apenas 5)
- ✅ Links aparecem embaixo de cada empresa
- ✅ Links são curtos (is.gd/xxxxx ou v.gd/xxxxx)
- ✅ Mensagem não excede limite do WhatsApp

### 3. Testar Links do WhatsApp

1. Clicar em um link de empresa
2. Verificar se abre WhatsApp
3. Verificar se mensagem pré-formatada aparece corretamente

**O que verificar:**
- ✅ WhatsApp abre corretamente
- ✅ Mensagem tem dados do orçamento
- ✅ Telefone está correto

### 4. Verificar Validação de Telefone

Se houver empresas com telefones inválidos nos logs:
- Verificar formato no banco de dados
- Corrigir telefones inválidos se necessário

## 🔍 Comandos Úteis

### Ver logs em tempo real:
```bash
ssh root@38.242.148.169 'pm2 logs whatsapp-webhook --lines 100'
```

### Ver apenas erros:
```bash
ssh root@38.242.148.169 'pm2 logs whatsapp-webhook --err --lines 50'
```

### Ver status do PM2:
```bash
ssh root@38.242.148.169 'pm2 status'
```

### Reiniciar aplicação (se necessário):
```bash
ssh root@38.242.148.169 'pm2 restart whatsapp-webhook'
```

## 🐛 Problemas Comuns

### Links não estão sendo encurtados
- Verificar logs para erros do is.gd/v.gd
- Pode ser problema temporário de rede
- Se persistir, verificar se axios está instalado

### Telefones inválidos
- Verificar formato no banco de dados
- Telefones devem ter pelo menos 10 dígitos (DDD + número)
- DDD deve estar entre 11-99

### Mensagem muito longa
- Verificar se URLs estão realmente encurtadas
- Se não estiverem, verificar logs de erro do encurtamento

## 📝 Próximos Passos

Após verificar que está tudo funcionando:
1. ✅ Testar com vários orçamentos
2. ✅ Verificar se links funcionam corretamente
3. ✅ Monitorar logs por alguns dias
4. ✅ Atualizar versão na VPS (se tudo estiver OK)

