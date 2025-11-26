# Configurar TinyURL API

## 📋 Resumo

O TinyURL descontinuou a API antiga (sem autenticação) e agora requer autenticação com Bearer token. Este guia explica como configurar.

## 🔑 Passo 1: Obter Token de API

1. **Criar conta no TinyURL:**
   - Acesse: https://tinyurl.com/
   - Clique em "Sign Up" e crie uma conta

2. **Gerar Token de API:**
   - Faça login na sua conta
   - Acesse: https://tinyurl.com/app/dev
   - Vá em "API Tokens" ou "Profile" → "API"
   - Clique em "Create New Token"
   - Dê um nome (ex: "WhatsApp Bot")
   - Selecione a permissão: **"Create TinyURL"**
   - Clique em "Create"
   - **Copie o token gerado** (você só verá ele uma vez!)

## ⚙️ Passo 2: Configurar na VPS

Adicione o token no arquivo `.env` da VPS:

```bash
# Conectar na VPS
ssh root@38.242.148.169

# Editar arquivo .env
cd /home/whatsapp-webhook
nano .env

# Adicionar linha:
TINYURL_API_TOKEN=seu_token_aqui

# Salvar (Ctrl+X, depois Y, depois Enter)

# Reiniciar aplicação
pm2 restart whatsapp-webhook
```

## 🧪 Passo 3: Testar

Após configurar, teste criando um orçamento via WhatsApp. Os logs devem mostrar:

```
✅ URL encurtada com sucesso: https://tinyurl.com/xxxxx
```

## ⚠️ Limitações

- **30 requisições por minuto** (limite da API gratuita)
- Se exceder, a API retornará erro 429 (Too Many Requests)
- O código tem fallback: se falhar, usa URL original

## 🔍 Verificar se está funcionando

```bash
# Ver logs em tempo real
ssh root@38.242.148.169 'pm2 logs whatsapp-webhook --lines 50'

# Procurar por:
# ✅ URL encurtada com sucesso
# ❌ Erro ao encurtar URL
```

## 🐛 Troubleshooting

### Erro 401/403 (Unauthorized)
- Token inválido ou expirado
- Verifique se copiou o token corretamente
- Gere um novo token se necessário

### Erro 429 (Too Many Requests)
- Limite de 30 requisições/minuto excedido
- Aguarde 1 minuto e tente novamente
- Considere implementar cache de URLs

### Token não configurado
- Verifique se adicionou `TINYURL_API_TOKEN` no `.env`
- Verifique se reiniciou o PM2 após adicionar
- Verifique se o arquivo `.env` está no diretório correto

## 📝 Notas

- O token é sensível, não compartilhe publicamente
- Se o token for comprometido, revogue e gere um novo
- A API gratuita tem limite de 30 req/min, mas é suficiente para uso normal

