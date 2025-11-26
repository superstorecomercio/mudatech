/**
 * Validador e formatador de números de telefone para WhatsApp
 */

/**
 * Valida e formata número de telefone para formato WhatsApp
 * Formato esperado: 5511999999999 (código do país + DDD + número)
 * 
 * @param {string} telefone - Número de telefone em qualquer formato
 * @returns {string|null} - Número formatado ou null se inválido
 */
function validarEFormatarTelefone(telefone) {
  if (!telefone || typeof telefone !== 'string') {
    return null;
  }

  // Remover todos os caracteres não numéricos
  const apenasNumeros = telefone.replace(/\D/g, '');

  // Se estiver vazio após limpar, retornar null
  if (!apenasNumeros || apenasNumeros.length === 0) {
    return null;
  }

  // Casos comuns de números brasileiros:
  // - 11999999999 (11 dígitos - DDD + número sem código do país)
  // - 5511999999999 (13 dígitos - código do país + DDD + número)
  // - 1199999999 (10 dígitos - DDD + número antigo sem 9)
  
  let numeroFormatado = apenasNumeros;

  // Se começar com 0, remover (ex: 011999999999)
  if (numeroFormatado.startsWith('0')) {
    numeroFormatado = numeroFormatado.substring(1);
  }

  // Se tiver 10 ou 11 dígitos (DDD + número), adicionar código do Brasil (55)
  if (numeroFormatado.length === 10 || numeroFormatado.length === 11) {
    // Verificar se o DDD é válido (11-99)
    const ddd = numeroFormatado.substring(0, 2);
    const dddNum = parseInt(ddd, 10);
    
    if (dddNum >= 11 && dddNum <= 99) {
      numeroFormatado = '55' + numeroFormatado;
    } else {
      // DDD inválido
      console.warn(`DDD inválido: ${ddd}`);
      return null;
    }
  }

  // Se já tiver código do país, verificar se é do Brasil (55)
  if (numeroFormatado.length >= 13) {
    if (!numeroFormatado.startsWith('55')) {
      // Não é número brasileiro, mas aceitar mesmo assim
      console.warn(`Número não brasileiro detectado: ${numeroFormatado}`);
    }
  }

  // Validar tamanho final (deve ter pelo menos 12 dígitos: código país + DDD + número)
  // Máximo de 15 dígitos (padrão internacional)
  if (numeroFormatado.length < 12 || numeroFormatado.length > 15) {
    console.warn(`Número com tamanho inválido: ${numeroFormatado} (${numeroFormatado.length} dígitos)`);
    return null;
  }

  // Validar DDD brasileiro (se começar com 55)
  if (numeroFormatado.startsWith('55') && numeroFormatado.length >= 13) {
    const ddd = numeroFormatado.substring(2, 4);
    const dddNum = parseInt(ddd, 10);
    
    if (dddNum < 11 || dddNum > 99) {
      console.warn(`DDD brasileiro inválido: ${ddd}`);
      return null;
    }
  }

  return numeroFormatado;
}

/**
 * Valida se o número está no formato correto para WhatsApp
 * @param {string} telefone - Número de telefone
 * @returns {boolean} - true se válido, false caso contrário
 */
function validarTelefone(telefone) {
  const formatado = validarEFormatarTelefone(telefone);
  return formatado !== null;
}

module.exports = {
  validarEFormatarTelefone,
  validarTelefone
};

