# Documentação Completa da Calculadora de Mudanças

## Visão Geral

A calculadora de mudanças é um componente conversacional (chatbot) que simula uma conversa com a assistente virtual "Julia". O objetivo é coletar informações sobre a mudança do usuário e fornecer uma estimativa de preço baseada em IA.

**Componente Principal:** `app/components/InstantCalculatorHybridTeste.tsx`
**Página:** `app/calculadorateste/page.tsx`
**API de Cálculo:** `app/api/calcular-orcamento/route.ts`

---

## Fluxo Completo do Usuário

### Estados do Componente

O componente possui 4 estados principais controlados por `useState`:

```typescript
type Estado = "formularioInicial" | "preview" | "capturaContato" | "resultadoFinal"
```

1. **formularioInicial** - Coleta dados da mudança (origem, destino, tipo de imóvel, etc.)
2. **preview** - Exibe mensagens de transição antes de pedir contato
3. **capturaContato** - Coleta dados de contato (nome, email, whatsapp, data)
4. **resultadoFinal** - Exibe o resultado do cálculo

---

## Etapas do Formulário Inicial

Definidas em `getEtapas()`:

| # | Campo | Tipo | Validação |
|---|-------|------|-----------|
| 0 | Origem | texto | Obrigatório |
| 1 | Destino | texto | Obrigatório |
| 2 | Tipo de Imóvel | select | Opções predefinidas |
| 3 | Tem Elevador | select | sim/nao |
| 4 | Andar | texto | Número válido |
| 5 | Precisa Embalagem | select | sim/nao |

### Opções de Tipo de Imóvel

```typescript
type TipoImovel = 'kitnet' | '1_quarto' | '2_quartos' | '3_mais' | 'comercial'

const tiposImovelLabels = {
  kitnet: "Kitnet/Studio",
  "1_quarto": "1 Quarto",
  "2_quartos": "2 Quartos",
  "3_mais": "3+ Quartos ou Casa",
  comercial: "Comercial"
}

const tiposImovelPorte = {
  kitnet: "pequeno",
  "1_quarto": "pequeno a médio",
  "2_quartos": "médio",
  "3_mais": "grande",
  comercial: "variável"
}
```

---

## Etapas de Captura de Contato

Definidas em `getEtapasContato()`:

| # | Campo | Tipo | Validação | Máscara |
|---|-------|------|-----------|---------|
| 0 | Nome | texto | Obrigatório | - |
| 1 | Email | email | Formato válido | - |
| 2 | WhatsApp | tel | 10-11 dígitos | (XX) XXXXX-XXXX |
| 3 | Data Estimada | date | Opcional | DD/MM/YYYY |

### Validações

```typescript
// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// WhatsApp (remove máscara e valida)
const whatsappLimpo = valor.replace(/\D/g, "")
if (whatsappLimpo.length < 10 || whatsappLimpo.length > 11) {
  // Erro
}

// Máscara de WhatsApp
const formatarWhatsApp = (valor: string): string => {
  const numeros = valor.replace(/\D/g, "").slice(0, 11)
  if (numeros.length <= 2) return numeros
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
}
```

---

## Sistema de Mensagens

### Estrutura de Mensagem

```typescript
interface Message {
  id: number
  type: "bot" | "user"
  text: string
  timestamp: Date
  read?: boolean
}
```

### Funções de Mensagem

```typescript
// Adiciona mensagem do bot (Julia)
const addBotMessage = (text: string) => {
  setMessages(prev => [...prev, {
    id: Date.now(),
    type: "bot",
    text,
    timestamp: new Date()
  }])
}

// Adiciona mensagem do usuário
const addUserMessage = (text: string) => {
  setMessages(prev => [...prev, {
    id: Date.now(),
    type: "user",
    text,
    timestamp: new Date()
  }])
}
```

---

## Comportamento de Scroll

### Refs Utilizadas

```typescript
const messagesEndRef = useRef<HTMLDivElement>(null)
const inputAreaRef = useRef<HTMLDivElement>(null)
const messagesContainerRef = useRef<HTMLDivElement>(null)
const lastMessageCountRef = useRef(0)
```

### Lógica de Scroll

```typescript
const scrollToBottom = () => {
  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth"
    })
  }
}

// Scroll apenas quando novas mensagens são adicionadas
useEffect(() => {
  if (messages.length > lastMessageCountRef.current) {
    lastMessageCountRef.current = messages.length
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }
}, [messages.length])
```

**Importante:** O scroll NÃO é disparado quando `isTyping` ou `loading` mudam, apenas quando novas mensagens são adicionadas. Isso evita o bug de scroll pulando.

---

## Timings das Mensagens

### Preview (Estado de Transição)

```typescript
// Tempos aumentados para dar tempo de leitura no celular
setTimeout(() => {
  addBotMessage(`Sua mudança parece ser de porte ${porte}...`)
}, 1000)

setTimeout(() => {
  addBotMessage("Normalmente, mudanças desse tipo ficam...")
}, 4000)

setTimeout(() => {
  addBotMessage("Para te mostrar a faixa real de preço...")
}, 8000)

setTimeout(() => {
  handleContinuarParaContato()
}, 11000)
```

### Pergunta sobre Lista de Objetos

```typescript
// Primeiro adiciona a mensagem, depois mostra os botões
addBotMessage("Antes de calcular, você gostaria de enviar uma lista...")
setTimeout(() => {
  setMostrarPerguntaLista(true)
}, 800)
```

---

## Lista de Objetos (Opcional)

O usuário pode opcionalmente enviar uma lista de objetos para um orçamento mais preciso.

### Estados

```typescript
const [listaObjetos, setListaObjetos] = useState<string>("")
const [arquivoLista, setArquivoLista] = useState<File | null>(null)
const [listaEnviada, setListaEnviada] = useState(false)
const [mostrarPerguntaLista, setMostrarPerguntaLista] = useState(false)
const [coletandoListaObjetos, setColetandoListaObjetos] = useState(false)
```

### Fluxo

1. Após preencher contato, pergunta se quer enviar lista
2. Se "Sim": mostra textarea para digitar objetos
3. Se "Não": vai direto para cálculo
4. Lista é enviada junto com o orçamento para o banco

---

## API de Cálculo

### Endpoint

`POST /api/calcular-orcamento`

### Request Body

```typescript
interface CalculoRequest {
  origem: string
  destino: string
  tipoImovel: TipoImovel
  temElevador: 'sim' | 'nao'
  andar: number
  precisaEmbalagem: 'sim' | 'nao'
  nome: string
  email: string
  whatsapp: string
  dataEstimada?: string
  listaObjetos?: string
  arquivoListaUrl?: string
  arquivoListaNome?: string
}
```

### Response

```typescript
interface CalculoResponse {
  precoMin: number
  precoMax: number
  faixaTexto: string
  distanciaKm?: number
  mensagemIA?: string
  cidadeOrigem?: string
  estadoOrigem?: string
  cidadeDestino?: string
  estadoDestino?: string
}
```

### Cálculo com IA (OpenAI GPT-4o-mini)

A API usa GPT-4o-mini para:
1. Interpretar origem/destino (corrige erros de digitação)
2. Calcular distância aproximada
3. Estimar faixa de preço baseada em:
   - Tipo de imóvel
   - Distância
   - Elevador/andar
   - Necessidade de embalagem

### Fallback (sem OpenAI)

Se a chave da OpenAI não estiver configurada, usa estimativa básica:
- Preço mínimo: R$ 800
- Preço máximo: R$ 3.500

---

## Rate Limiting

### Configuração

```typescript
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,           // Máx requisições por janela
  windowMs: 15 * 60 * 1000, // 15 minutos
  blockDurationMs: 30 * 60 * 1000, // Bloqueio de 30 min
}
```

### Verificações

1. **Rate Limit por IP/Email**: Máximo 5 requisições em 15 minutos
2. **Duplicatas**: Bloqueia orçamentos idênticos em 5 minutos

---

## Salvamento no Banco (Supabase)

### Função RPC

```typescript
const { data, error } = await supabase
  .rpc('criar_orcamento_e_notificar', {
    p_orcamento_data: orcamentoData
  })
```

Esta função SQL:
1. Cria o orçamento na tabela `orcamentos`
2. Busca campanhas/hotsites que atendem a região
3. Cria relacionamentos em `orcamento_campanhas`
4. Retorna IDs das campanhas notificadas

### Dados Salvos

```typescript
{
  tipo: 'mudanca',
  nome_cliente: dados.nome,
  email_cliente: dados.email,
  telefone_cliente: dados.whatsapp,
  whatsapp: dados.whatsapp,
  origem_completo: origemFormatado,
  destino_completo: destinoFormatado,
  estado_origem: estadoOrigem,
  cidade_origem: dados.cidadeOrigem,
  estado_destino: estadoDestino,
  cidade_destino: dados.cidadeDestino,
  tipo_imovel: dados.tipoImovel,
  tem_elevador: dados.temElevador,
  andar: dados.andar,
  precisa_embalagem: dados.precisaEmbalagem,
  distancia_km: dados.distanciaKm,
  preco_min: dados.precoMin,
  preco_max: dados.precoMax,
  mensagem_ia: dados.mensagemIA,
  lista_objetos: dados.listaObjetos,
  data_estimada: dados.dataEstimada,
  origem_formulario: 'calculadora',
  user_agent: dados.userAgent,
  ip_cliente: dados.ipCliente,
}
```

---

## Tratamento de Erros

### Frontend

```typescript
if (!response.ok) {
  let errorMessage = `Erro ${response.status}: ${response.statusText}`
  try {
    const errorData = await response.json()
    errorMessage = errorData.error || errorMessage
  } catch {
    // Se não conseguir parsear JSON, usa mensagem padrão
  }
  throw new Error(errorMessage)
}
```

### Backend (API)

```typescript
// Erro ao salvar no banco
return NextResponse.json(
  { error: `Erro ao salvar orçamento: ${errorMessage}` },
  { status: 500 }
)

// Erro geral
return NextResponse.json(
  { error: `Erro ao processar sua solicitação: ${errorMessage}` },
  { status: 500 }
)
```

---

## Estado Resultado Final

Após o cálculo bem-sucedido:

```typescript
setResultado(data)
setEstado("resultadoFinal")
setMessages([])

// Scroll para o topo no mobile
window.scrollTo({ top: 0, behavior: "smooth" })
```

### Informações Exibidas

1. Faixa de preço (R$ min - R$ max)
2. Distância calculada
3. Análise da IA (se disponível)
4. Confirmação de lista de objetos (se enviada)
5. Resumo completo da mudança
6. Botões: "Fazer nova cotação" e "Voltar para Home"

---

## Reset/Nova Cotação

```typescript
const handleNovoCalculo = () => {
  setEstado("formularioInicial")
  setEtapaAtual(-1)
  setEtapaContatoAtual(-1)
  setFormData({
    origem: "",
    destino: "",
    tipoImovel: "",
    temElevador: "",
    andar: "",
    precisaEmbalagem: ""
  })
  setContatoData({
    nome: "",
    email: "",
    whatsapp: "",
    dataEstimada: ""
  })
  setResultado(null)
  setErro(null)
  setListaObjetos("")
  setArquivoLista(null)
  setListaEnviada(false)
  setErroLista(null)
  setMostrarPerguntaLista(false)
  setColetandoListaObjetos(false)
  setMessages([])
  setShowIntro(true)
  setInputValue("")
  setIsTyping(false)
  setLoading(false)
  introExecutadoRef.current = false
  previewExecutadoRef.current = false
  lastMessageCountRef.current = 0
}
```

---

## Estilização

### Container Principal

```tsx
<Card className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm border-2 shadow-2xl font-[family-name:var(--font-montserrat)]">
  <div className="flex flex-col max-h-[80vh] lg:max-h-[600px]">
```

### Área de Mensagens

```tsx
<div ref={messagesContainerRef} className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 space-y-3 md:space-y-4 min-h-0">
```

### Mensagem do Bot

```tsx
<div className="flex items-start gap-2 md:gap-3 flex-row">
  <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-primary/20 flex-shrink-0">
    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-bold">
      J
    </AvatarFallback>
  </Avatar>
  <div className="max-w-[85%] rounded-2xl px-4 py-3 shadow-sm bg-muted/50 rounded-tl-sm">
    <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-line">
      {message.text}
    </p>
  </div>
</div>
```

### Mensagem do Usuário

```tsx
<div className="flex items-start gap-2 md:gap-3 flex-row-reverse">
  <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-primary/20 flex-shrink-0">
    <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-800 text-white text-sm font-bold">
      <User className="w-4 h-4" />
    </AvatarFallback>
  </Avatar>
  <div className="max-w-[85%] rounded-2xl px-4 py-3 shadow-sm bg-primary text-primary-foreground rounded-tr-sm">
    <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">
      {message.text}
    </p>
  </div>
</div>
```

---

## Dependências

### Componentes UI (shadcn/ui)

- `Card`
- `Button`
- `Input`
- `Avatar`, `AvatarFallback`, `AvatarImage`

### Ícones (lucide-react)

- `MapPin`, `Home`, `Building2`, `Package`
- `Phone`, `Mail`, `User`, `Calendar`
- `Send`, `ArrowRight`, `CheckCircle2`
- `Loader2` (animação de loading)

### Utilitários

- `cn` (classnames utility)
- `useState`, `useEffect`, `useRef` (React hooks)

---

## Configurações Importantes

### Logger (Vercel-compatible)

O logger foi modificado para não tentar criar arquivos em produção (Vercel é read-only):

```typescript
// lib/utils/logger.ts
class Logger {
  private isProduction: boolean

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  // Usa apenas console.log/warn/error
  // Logs aparecem no Vercel Dashboard > Logs
}
```

### Variáveis de Ambiente Necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
OPENAI_API_KEY=sk-xxx
```

---

## Histórico de Correções

### Novembro 2024

1. **Erro 405 na Vercel**
   - Causa: Logger tentando criar pasta `/var/task/logs`
   - Solução: Reescrito logger para usar apenas console

2. **Botões aparecendo antes da mensagem**
   - Causa: `setMostrarPerguntaLista(true)` antes de `addBotMessage()`
   - Solução: Invertido ordem, botões aparecem 800ms após mensagem

3. **Scroll pulando no mobile**
   - Causa: Scroll disparado em mudanças de `isTyping` e `loading`
   - Solução: Scroll apenas quando `messages.length` aumenta

4. **Mensagens rápidas demais no preview**
   - Causa: Delays muito curtos (3s, 5s, 7s)
   - Solução: Aumentados para (4s, 8s, 11s)

5. **Espaço branco entre header e conteúdo no mobile**
   - Causa: `pt-20` fixo vs header `h-16` no mobile
   - Solução: `pt-16 lg:pt-20`

6. **Resultado não scrollando para topo no mobile**
   - Solução: Adicionado `window.scrollTo({ top: 0, behavior: "smooth" })`

---

## Arquivos Relacionados

```
app/
├── calculadorateste/
│   └── page.tsx                    # Página da calculadora
├── components/
│   ├── InstantCalculatorHybridTeste.tsx  # Componente principal
│   └── ui/                         # Componentes shadcn/ui
├── api/
│   └── calcular-orcamento/
│       └── route.ts                # API de cálculo
lib/
├── db/
│   └── queries/
│       └── orcamentos.ts           # Funções de banco de dados
├── utils/
│   ├── logger.ts                   # Sistema de logs
│   └── rateLimiter.ts              # Rate limiting
└── supabase/
    └── server.ts                   # Cliente Supabase
```

---

*Documentação atualizada em: Novembro 2024*
