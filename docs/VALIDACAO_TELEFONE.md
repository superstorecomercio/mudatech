# Validação e Formatação de Telefone

## 📋 Resumo

Implementada validação e formatação automática de números de telefone para garantir que estejam no formato correto do WhatsApp antes de criar as URLs.

## ✅ Funcionalidades

### Validação
- Remove caracteres não numéricos
- Valida DDD brasileiro (11-99)
- Valida tamanho do número (12-15 dígitos)
- Adiciona código do país (55) se necessário

### Formatação
- Converte para formato WhatsApp: `5511999999999`
- Remove zeros iniciais (ex: 011 → 11)
- Adiciona código do Brasil automaticamente se faltar

## 📱 Formatos Aceitos

O validador aceita números em vários formatos:

### Formatos Válidos:
- `(11) 99999-9999` → `5511999999999`
- `11 99999-9999` → `5511999999999`
- `11999999999` → `5511999999999`
- `5511999999999` → `5511999999999` (já formatado)
- `011999999999` → `5511999999999` (remove zero inicial)
- `+55 11 99999-9999` → `5511999999999`

### Formatos Inválidos:
- Números com menos de 10 dígitos
- DDD inválido (menor que 11 ou maior que 99)
- Números com mais de 15 dígitos
- Números vazios ou apenas caracteres especiais

## 🔧 Uso

```javascript
const { validarEFormatarTelefone } = require('./telefone-validator');

// Exemplo 1: Número com formatação
const telefone1 = '(11) 99999-9999';
const formatado1 = validarEFormatarTelefone(telefone1);
// Retorna: '5511999999999'

// Exemplo 2: Número sem código do país
const telefone2 = '11999999999';
const formatado2 = validarEFormatarTelefone(telefone2);
// Retorna: '5511999999999'

// Exemplo 3: Número inválido
const telefone3 = '123';
const formatado3 = validarEFormatarTelefone(telefone3);
// Retorna: null
```

## 📁 Arquivos

### `vps-code/codigo/telefone-validator.js` (NOVO)
Módulo com funções de validação e formatação.

**Funções:**
- `validarEFormatarTelefone(telefone)`: Valida e formata número
- `validarTelefone(telefone)`: Apenas valida (retorna true/false)

### Arquivos Modificados:
- `vps-code/codigo/url-shortener.js`: Usa validação antes de criar URL
- `vps-code/codigo/supabase-service.js`: Usa validação nos fallbacks

## ⚠️ Tratamento de Erros

Se o telefone for inválido:
- Log de aviso é registrado
- Link do WhatsApp não é criado para aquela empresa
- Empresa ainda é exibida na lista, mas sem link
- Não quebra o fluxo do orçamento

## 🧪 Exemplos de Validação

| Entrada | Saída | Status |
|---------|-------|--------|
| `(11) 99999-9999` | `5511999999999` | ✅ Válido |
| `11999999999` | `5511999999999` | ✅ Válido |
| `5511999999999` | `5511999999999` | ✅ Válido |
| `011999999999` | `5511999999999` | ✅ Válido |
| `123` | `null` | ❌ Inválido |
| `999999999` | `null` | ❌ Inválido (sem DDD) |
| `(00) 99999-9999` | `null` | ❌ Inválido (DDD inválido) |

## 📝 Logs

O validador registra logs para debug:
- `⚠️ DDD inválido: XX` - DDD fora do range 11-99
- `⚠️ Número com tamanho inválido: ...` - Número muito curto ou longo
- `⚠️ Número não brasileiro detectado: ...` - Número de outro país (aceito, mas com aviso)

