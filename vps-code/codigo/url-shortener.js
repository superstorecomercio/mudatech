/**
 * URL Shortener - Encurta URLs usando solução própria ou serviços externos
 * Prioriza solução própria (/api/w), com fallback para is.gd/v.gd
 */

const axios = require('axios');
const { validarEFormatarTelefone } = require('./telefone-validator');
const { validarEFormatarData } = require('./date-validator');

/**
 * Encurta URL usando is.gd (gratuito, sem autenticação, sem limites)
 * @param {string} url - URL completa para encurtar
 * @returns {Promise<string|null>} - URL encurtada ou null se falhar
 */
async function encurtarComIsGd(url) {
  try {
    const response = await axios.get('https://is.gd/create.php', {
      params: {
        format: 'json',
        url: url
      },
      timeout: 10000, // Aumentar timeout para 10 segundos
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Aceitar 2xx, 3xx, 4xx (mas não 5xx)
      }
    });

    // Verificar resposta
    if (response.data) {
      // Se retornar erro, verificar mensagem
      if (response.data.errorcode) {
        console.error('Erro do is.gd:', response.data.errormessage);
        return null;
      }
      
      if (response.data.shorturl) {
        return response.data.shorturl;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao encurtar com is.gd:', error.message);
    if (error.response) {
      console.error('Resposta do erro:', error.response.data);
    }
    return null;
  }
}

/**
 * Encurta URL usando v.gd (gratuito, sem autenticação, sem limites)
 * @param {string} url - URL completa para encurtar
 * @returns {Promise<string|null>} - URL encurtada ou null se falhar
 */
async function encurtarComVGd(url) {
  try {
    const response = await axios.get('https://v.gd/create.php', {
      params: {
        format: 'json',
        url: url
      },
      timeout: 10000, // Aumentar timeout para 10 segundos
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Aceitar 2xx, 3xx, 4xx (mas não 5xx)
      }
    });

    // Verificar resposta
    if (response.data) {
      // Se retornar erro, verificar mensagem
      if (response.data.errorcode) {
        console.error('Erro do v.gd:', response.data.errormessage);
        return null;
      }
      
      if (response.data.shorturl) {
        return response.data.shorturl;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao encurtar com v.gd:', error.message);
    if (error.response) {
      console.error('Resposta do erro:', error.response.data);
    }
    return null;
  }
}

/**
 * Encurta URL usando 0x0.st (gratuito, sem autenticação)
 * @param {string} url - URL completa para encurtar
 * @returns {Promise<string|null>} - URL encurtada ou null se falhar
 */
async function encurtarCom0x0(url) {
  try {
    // 0x0.st usa POST com form-data (URL encoded)
    const params = new URLSearchParams();
    params.append('shorten', url);
    
    const response = await axios.post('https://0x0.st', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000,
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Aceitar 2xx e 3xx
      }
    });

    // 0x0.st retorna a URL encurtada diretamente no body (texto simples)
    if (response.data && typeof response.data === 'string') {
      const urlEncurtada = response.data.trim();
      // Verificar se é uma URL válida
      if (urlEncurtada.startsWith('http://') || urlEncurtada.startsWith('https://')) {
        return urlEncurtada;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao encurtar com 0x0.st:', error.message);
    if (error.response) {
      console.error('Resposta do erro:', error.response.data);
    }
    return null;
  }
}

/**
 * Encurta URL tentando múltiplos serviços gratuitos
 * @param {string} url - URL completa para encurtar
 * @returns {Promise<string>} - URL encurtada ou lança erro se todos falharem
 */
async function encurtarURL(url) {
  // Validar URL antes de tentar encurtar
  if (!url || typeof url !== 'string' || url.length === 0) {
    console.error('❌ URL inválida para encurtar:', url);
    throw new Error('URL inválida');
  }

  // Se a URL já for muito curta (menos de 50 caracteres), não precisa encurtar
  if (url.length < 50) {
    console.log('ℹ️ URL já é curta, não precisa encurtar:', url);
    return url;
  }

  console.log(`🔄 Tentando encurtar URL (${url.length} caracteres)...`);

  // Tentar is.gd primeiro (mais confiável)
  let urlEncurtada = await encurtarComIsGd(url);
  if (urlEncurtada && urlEncurtada.length < url.length) {
    console.log('✅ URL encurtada com is.gd:', urlEncurtada, `(${urlEncurtada.length} caracteres)`);
    return urlEncurtada;
  }

  // Se is.gd falhar, tentar v.gd
  urlEncurtada = await encurtarComVGd(url);
  if (urlEncurtada && urlEncurtada.length < url.length) {
    console.log('✅ URL encurtada com v.gd:', urlEncurtada, `(${urlEncurtada.length} caracteres)`);
    return urlEncurtada;
  }

  // Se v.gd falhar, tentar 0x0.st (terceira opção)
  urlEncurtada = await encurtarCom0x0(url);
  if (urlEncurtada && urlEncurtada.length < url.length) {
    console.log('✅ URL encurtada com 0x0.st:', urlEncurtada, `(${urlEncurtada.length} caracteres)`);
    return urlEncurtada;
  }

  // Se todos falharem, lançar erro (não retornar URL original, não enviar link)
  console.error('❌ Todos os serviços de encurtamento falharam para:', url.substring(0, 100) + '...');
  throw new Error('Falha ao encurtar URL: todos os serviços retornaram erro');
}

/**
 * Cria URL do WhatsApp com mensagem pré-formatada e encurta usando serviços gratuitos
 * @param {string} telefone - Telefone no formato: 5511999999999 (sem caracteres especiais)
 * @param {object} dados - Dados do orçamento
 * @returns {Promise<string>} - URL encurtada do WhatsApp
 */
async function criarLinkWhatsApp(telefone, dados) {
  // Validar e formatar telefone para formato WhatsApp
  const telefoneFormatado = validarEFormatarTelefone(telefone);
  
  if (!telefoneFormatado) {
    console.error(`❌ Telefone inválido: ${telefone}`);
    throw new Error(`Telefone inválido: ${telefone}`);
  }
  
  // Criar mensagem simplificada
  const mensagem = criarMensagemSimplificada(dados);
  
  console.log(`📝 Mensagem para WhatsApp (${mensagem.length} caracteres):`, mensagem.substring(0, 100) + '...');

  // Criar URL do WhatsApp com telefone formatado
  const urlWhatsApp = `https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`;
  
  console.log(`🔗 URL do WhatsApp criada (${urlWhatsApp.length} caracteres):`, urlWhatsApp.substring(0, 150) + '...');

  // Sempre encurtar URL - se falhar, não enviar URL (não usar fallback de URL grande)
  try {
    const urlEncurtada = await encurtarURL(urlWhatsApp);
    console.log(`✅ URL encurtada com sucesso (${urlEncurtada.length} caracteres):`, urlEncurtada);
    return urlEncurtada;
  } catch (error) {
    console.error(`❌ Erro ao encurtar URL para telefone ${telefoneFormatado}:`, error.message);
    // Se falhar ao encurtar, lançar erro (não retornar URL grande)
    console.warn(`⚠️ Todos os serviços de encurtamento falharam. URL não será enviada.`);
    throw error; // Re-lançar erro para que o código que chama possa tratar
  }
}

/**
 * Cria mensagem simplificada para WhatsApp
 */
function criarMensagemSimplificada(dados) {
  const tipoImovelLabels = {
    casa: 'Casa',
    apartamento: 'Apto',
    empresa: 'Empresa'
  };
  
  const metragemLabels = {
    ate_50: 'Até 50m²',
    '50_150': '50-150m²',
    '150_300': '150-300m²',
    acima_300: '300m²+'
  };
  
  const tipoImovel = tipoImovelLabels[dados.tipo_imovel] || dados.tipo_imovel || 'Não informado';
  const metragem = metragemLabels[dados.metragem] || dados.metragem || 'Não informado';
  
  // Mensagem para empresas - versão otimizada para reduzir tamanho da URL
  let msg = `Vou mudar e preciso desse orçamento:\n\n`;
  msg += `*Orçamento enviado por MudaTech*\n`;
  
  // Adicionar código do orçamento se disponível
  if (dados.codigo_orcamento) {
    msg += `🔖 *Código:* ${dados.codigo_orcamento}\n`;
  }
  msg += `👤 ${dados.nome || 'Cliente'}\n`;
  msg += `📧 ${dados.email || 'Não informado'}\n`;
  msg += `📍 ${dados.cidadeOrigem || ''}, ${dados.estadoOrigem || ''} → ${dados.cidadeDestino || ''}, ${dados.estadoDestino || ''}\n`;
  msg += `🏠 Tipo: ${tipoImovel}\n`;
  msg += `📏 Metragem: ${metragem}\n`;
  msg += `🚪 Elevador: ${dados.tem_elevador ? 'Sim' : 'Não'}\n`;
  msg += `📦 Embalagem: ${dados.precisa_embalagem ? 'Sim' : 'Não'}\n`;
  msg += `📏 Distância: ${dados.distanciaKm || 0}km\n`;
  msg += `💰 Faixa: R$ ${dados.precoMin || 0} - R$ ${dados.precoMax || 0}\n`;
  
  // Adicionar data estimada se houver (com validação)
  if (dados.data_estimada) {
    const dataFormatada = validarEFormatarData(dados.data_estimada);
    if (dataFormatada) {
      msg += `📅 Data: ${dataFormatada}\n`;
    }
  }
  
  msg += `\nGostaria de uma cotação personalizada.`;
  
  return msg;
}

module.exports = {
  encurtarURL,
  criarLinkWhatsApp
};

