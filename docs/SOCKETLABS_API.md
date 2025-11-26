# Integração SocketLabs API

## Visão Geral

O SocketLabs é integrado via **API REST** (não SMTP). Usamos o pacote oficial `@socketlabs/email` para Node.js.

## Campos Obrigatórios

### 1. Server ID
- **Tipo**: Número inteiro
- **Onde encontrar**: Painel do SocketLabs → Settings → Server Settings
- **Exemplo**: `12345`
- **Validação**: Deve ser um número válido

### 2. API Key
- **Tipo**: String (chave de API)
- **Onde encontrar**: Painel do SocketLabs → Settings → API Keys
- **Exemplo**: `SK-1234567890abcdef1234567890abcdef`
- **Validação**: Deve ter pelo menos 20 caracteres
- **Importante**: Use a chave de API, não a senha SMTP

### 3. From Email (Remetente)
- **Tipo**: Email válido
- **Requisito**: Deve ser um email verificado no SocketLabs
- **Validação**: Formato de email válido (ex: `noreply@seudominio.com`)

### 4. From Name (Opcional)
- **Tipo**: String
- **Exemplo**: `MudaTech - Sistema de Orçamentos`

## Como Obter as Credenciais

1. **Acesse o painel do SocketLabs**: https://cp.socketlabs.com
2. **Server ID**: 
   - Vá em Settings → Server Settings
   - O Server ID está no topo da página
3. **API Key**:
   - Vá em Settings → API Keys
   - Clique em "Create API Key"
   - Escolha permissões: "Send Email" (pelo menos)
   - Copie a chave gerada (ela só aparece uma vez!)

## Verificação de Email Remetente

⚠️ **IMPORTANTE**: O email remetente (`from_email`) deve estar verificado no SocketLabs:

1. Vá em Settings → Sender Authentication
2. Adicione e verifique seu domínio ou email
3. Aguarde a verificação (pode levar alguns minutos)

## Códigos de Erro Comuns

| Código | Significado | Solução |
|--------|------------|---------|
| `401` | Não autorizado | Verifique se a API Key está correta |
| `403` | Acesso negado | Verifique as permissões da API Key |
| `400` | Requisição inválida | Verifique os campos obrigatórios |
| `404` | Endpoint não encontrado | Verifique o Server ID |
| `429` | Limite de taxa excedido | Aguarde alguns minutos |
| `500` | Erro interno do SocketLabs | Tente novamente mais tarde |

## Diferença entre API e SMTP

### API (Recomendado - O que usamos)
- ✅ Mais rápido
- ✅ Melhor rastreamento
- ✅ Melhor tratamento de erros
- ✅ Suporte a templates
- ✅ Métricas detalhadas

### SMTP (Não usado)
- ❌ Mais lento
- ❌ Menos informações de erro
- ❌ Requer configuração de servidor SMTP

## Testando a Configuração

1. Acesse `/admin/emails/configuracao`
2. Preencha:
   - **Provedor**: SocketLabs
   - **Server ID**: Seu número do servidor
   - **API Key**: Sua chave de API
   - **From Email**: Email verificado
   - **From Name**: Nome do remetente (opcional)
3. Clique em "Testar Configuração"
4. Verifique os logs em `/admin/emails/logs` se houver erro

## Troubleshooting

### Erro: "Erro desconhecido ao enviar email"
1. Verifique os logs em `/admin/emails/logs`
2. Procure pelo código de rastreamento do erro
3. Verifique:
   - Server ID está correto?
   - API Key está correta e ativa?
   - Email remetente está verificado?
   - Todos os campos obrigatórios estão preenchidos?

### Erro: "Server ID deve ser um número válido"
- O Server ID deve ser apenas números (ex: `12345`)
- Não inclua espaços ou caracteres especiais

### Erro: "API Key inválida"
- A API Key deve ter pelo menos 20 caracteres
- Use a chave de API, não a senha SMTP
- Verifique se a chave está ativa no painel

### Erro: "Email do remetente inválido"
- Verifique o formato do email
- Certifique-se de que o email está verificado no SocketLabs

## Documentação Oficial

- [SocketLabs API Documentation](https://help.socketlabs.com/docs/introduction-to-our-apis)
- [Node.js SDK](https://github.com/socketlabs/socketlabs-node)

## Suporte

Se o problema persistir:
1. Verifique os logs detalhados em `/admin/emails/logs`
2. Entre em contato com o suporte do SocketLabs
3. Forneça o código de rastreamento do erro

