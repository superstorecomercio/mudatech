# URL Shortener Gratuito - is.gd e v.gd

## 🎯 Solução Implementada

Implementada solução usando serviços **100% gratuitos** e **sem autenticação**:
- **is.gd**: Serviço principal (mais confiável)
- **v.gd**: Serviço de fallback (mesma empresa, domínio alternativo)

## ✅ Vantagens

1. **100% Gratuito**: Sem custos, sem limites
2. **Sem Autenticação**: Não precisa de token ou API key
3. **URLs Curtas**: `https://is.gd/xxxxx` ou `https://v.gd/xxxxx`
4. **Sem Limites**: Pode usar quantas URLs quiser
5. **Fallback Automático**: Se um serviço falhar, tenta o outro

## 🔧 Como Funciona

1. Tenta encurtar com **is.gd** primeiro
2. Se falhar, tenta com **v.gd**
3. Se ambos falharem, retorna URL original (não quebra o fluxo)

## 📊 Exemplo de URLs

**Antes:**
```
https://wa.me/5511999999999?text=Olá!%20Recebi%20um%20orçamento...
```
~500-800 caracteres

**Depois:**
```
https://is.gd/xxxxx
```
~20 caracteres

**Redução: ~95%**

## 🚀 Uso

Não precisa configurar nada! O código já está pronto para usar.

## ⚠️ Notas

- Ambos os serviços são gratuitos e sem limites
- Não há necessidade de criar conta
- URLs não expiram
- Serviços são confiáveis e usados há anos

## 🔍 Verificar se está funcionando

```bash
ssh root@38.242.148.169 'pm2 logs whatsapp-webhook --lines 50'
```

Procure por:
- `✅ URL encurtada com is.gd: https://is.gd/xxxxx`
- `✅ URL encurtada com v.gd: https://v.gd/xxxxx`
- `⚠️ Todos os serviços de encurtamento falharam` (raro)

## 📝 API dos Serviços

### is.gd
```
GET https://is.gd/create.php?format=json&url=URL_AQUI
```

### v.gd
```
GET https://v.gd/create.php?format=json&url=URL_AQUI
```

Ambos retornam JSON:
```json
{
  "shorturl": "https://is.gd/xxxxx"
}
```

