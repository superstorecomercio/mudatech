/**
 * Converte HTML para texto puro, removendo tags e preservando estrutura básica
 */
export function htmlToText(html: string): string {
  if (!html) return ''

  // Criar um elemento temporário para parsear o HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Função recursiva para extrair texto
  function extractText(node: Node): string {
    let text = ''

    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || ''
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element
      const tagName = element.tagName.toLowerCase()

      // Adicionar quebras de linha para elementos de bloco
      const blockElements = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr', 'br']
      if (blockElements.includes(tagName)) {
        text += '\n'
      }

      // Processar filhos
      for (let i = 0; i < node.childNodes.length; i++) {
        text += extractText(node.childNodes[i])
      }

      // Adicionar quebra de linha após elementos de bloco
      if (blockElements.includes(tagName)) {
        text += '\n'
      }

      // Tratamento especial para links
      if (tagName === 'a') {
        const href = element.getAttribute('href')
        if (href) {
          text += ` (${href})`
        }
      }

      // Tratamento especial para tabelas
      if (tagName === 'td' || tagName === 'th') {
        text += ' | '
      }
    }

    return text
  }

  let text = extractText(tempDiv)

  // Limpar espaços em branco excessivos
  text = text
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Múltiplas quebras de linha
    .replace(/[ \t]+/g, ' ') // Múltiplos espaços
    .replace(/\s*\|\s*/g, ' | ') // Espaços ao redor de |
    .trim()

  return text
}

/**
 * Versão server-side usando regex (para uso em API routes)
 */
export function htmlToTextServer(html: string): string {
  if (!html) return ''

  let text = html

  // Remover scripts e styles primeiro
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

  // Converter quebras de linha HTML ANTES de remover outras tags
  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<br\s*\/?>/gi, '\n') // Duplo para garantir
  
  // Converter parágrafos e divs
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<p[^>]*>/gi, '')
  text = text.replace(/<\/div>/gi, '\n')
  text = text.replace(/<div[^>]*>/gi, '')
  
  // Converter cabeçalhos
  text = text.replace(/<\/h[1-6]>/gi, '\n\n')
  text = text.replace(/<h[1-6][^>]*>/gi, '')

  // Converter links - capturar texto e URL
  text = text.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (match, href, linkText) => {
    const cleanText = linkText.replace(/<[^>]+>/g, '').trim()
    return cleanText ? `${cleanText} (${href})` : href
  })

  // Converter listas
  text = text.replace(/<li[^>]*>/gi, '• ')
  text = text.replace(/<\/li>/gi, '\n')
  text = text.replace(/<\/ul>|<\/ol>/gi, '\n\n')
  text = text.replace(/<ul[^>]*>|<ol[^>]*>/gi, '')

  // Converter tabelas
  text = text.replace(/<tr[^>]*>/gi, '\n')
  text = text.replace(/<td[^>]*>/gi, ' | ')
  text = text.replace(/<th[^>]*>/gi, ' | ')
  text = text.replace(/<\/td>|<\/th>/gi, '')
  text = text.replace(/<\/tr>/gi, '\n')
  text = text.replace(/<table[^>]*>|<\/table>/gi, '\n')
  text = text.replace(/<tbody[^>]*>|<\/tbody>/gi, '')

  // Remover todas as tags HTML restantes
  text = text.replace(/<[^>]+>/g, '')

  // Decodificar entidades HTML (fazer antes de limpar espaços)
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/&mdash;/g, '--')
    .replace(/&ndash;/g, '-')

  // Limpar espaços em branco excessivos
  text = text
    .replace(/\n\s*\n\s*\n+/g, '\n\n') // Múltiplas quebras de linha
    .replace(/[ \t]+/g, ' ') // Múltiplos espaços
    .replace(/\s*\|\s*/g, ' | ') // Espaços ao redor de |
    .replace(/^\s+|\s+$/gm, '') // Espaços no início/fim de cada linha
    .trim()

  // Se ainda estiver vazio após processamento, retornar mensagem
  if (!text || text.trim().length === 0) {
    return 'Erro: Não foi possível converter o HTML para texto. O email pode estar vazio ou mal formatado.'
  }

  return text
}

