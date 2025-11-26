# Changelog - VPS WhatsApp Bot

## [1.0.4] - 2025-11-26
### Alterações
- ✅ Adicionada validação para evitar processamento de mensagens muito rápidas
- ✅ Sistema de bloqueio durante processamento para evitar respostas duplicadas
- ✅ Validação de tempo mínimo (2 segundos) entre mensagens após última pergunta
- ✅ Mensagens de feedback quando usuário tenta responder muito rápido
- ✅ Flag `processando` para evitar processamento simultâneo
- ✅ Timestamp `ultima_pergunta_enviada_em` para rastrear tempo entre perguntas

### Arquivos Modificados
- `sessions.js` - Adicionados campos `ultima_pergunta_enviada_em` e `processando`, funções `marcarPerguntaEnviada()` e `setProcessando()`
- `message-handler.js` - Validação de mensagens rápidas, controle de processamento em todas as etapas

## [1.0.3] - 2025-11-26
### Alterações
- ✅ Modificada pergunta de tipo de imóvel: agora apenas "Casa", "Apartamento" ou "Empresa"
- ✅ Adicionada nova pergunta de metragem aproximada (Até 50m², 50-150m², 150-300m², Acima de 300m²)
- ✅ Atualizado cálculo da IA para considerar metragem no preço
- ✅ Metragem incluída nas mensagens enviadas para empresas

### Arquivos Modificados
- `sessions.js` - Adicionada etapa METRAGEM na ordem de perguntas
- `message-handler.js` - Modificada pergunta de tipo de imóvel e adicionada pergunta de metragem
- `supabase-service.js` - Atualizado mapeamento de tipo de imóvel e adicionado campo metragem
- `url-shortener.js` - Atualizado labels e adicionada metragem nas mensagens
- `openai-service.js` - Atualizado prompt para considerar metragem no cálculo de preço

## [1.0.2] - 2025-11-26
### Alterações
- ✅ Adicionado código único de orçamento (MD-XXXX-XXXX)
- ✅ Melhorias na validação de data (aceita múltiplos formatos: DD/MM, DD.MM, DD MM, DD/MM/YYYY)
- ✅ Separação de mensagens (dados do orçamento + lista de empresas)
- ✅ Marca MudaTech nas mensagens
- ✅ Lista de empresas com links WhatsApp encurtados
- ✅ URL shortener com múltiplos serviços (is.gd → v.gd → 0x0.st)
- ✅ Validação de telefone robusta (telefone-validator.js)
- ✅ Prevenção de números clicáveis (nomes entre aspas)
- ✅ Ativação melhorada ("calcular mudança", "olá" com/sem acento)
- ✅ Normalização de texto (remove acentos para melhor detecção)

### Arquivos Modificados
- `message-handler.js` - Ativação melhorada, separação de mensagens, código do orçamento
- `supabase-service.js` - Busca código do orçamento, geração de links WhatsApp
- `url-shortener.js` - Múltiplos serviços de encurtamento
- `date-validator.js` - Validação de múltiplos formatos de data
- `telefone-validator.js` - Validação robusta de telefones brasileiros

## [1.0.1] - 2025-11-25
### Alterações
- ✅ Adicionada exibição de lista de empresas notificadas
- ✅ Busca de nomes e telefones das empresas
- ✅ Criação de links WhatsApp para empresas

## [1.0.0] - 2025-01-23
### Inicial
- ✅ Versão inicial do sistema
- ✅ Bot conversacional completo (10 perguntas)
- ✅ Integração OpenAI (cálculo de distância e preço)
- ✅ Integração Supabase (salvamento e notificação)
- ✅ Webhook Facebook configurado
- ✅ SSL e domínio ativos
- ✅ PM2 para gerenciamento de processos
