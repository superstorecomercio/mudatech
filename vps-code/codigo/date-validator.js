/**
 * Validador e formatador de datas
 */

/**
 * Valida e formata data para formato brasileiro
 * Aceita vários formatos: DD/MM/YYYY, DD/MM, DD-MM-YYYY, YYYY-MM-DD, etc.
 * 
 * @param {string|Date} data - Data em qualquer formato
 * @returns {string|null} - Data formatada (DD/MM/YYYY) ou null se inválida
 */
function validarEFormatarData(data) {
  if (!data) {
    return null;
  }

  // Se já for um objeto Date válido
  if (data instanceof Date && !isNaN(data.getTime())) {
    return formatarDataBrasileira(data);
  }

  // Se for string, tentar parsear
  if (typeof data === 'string') {
    const dataLimpa = data.trim();
    
    // Se estiver vazia, retornar null
    if (!dataLimpa) {
      return null;
    }

    // Tentar diferentes formatos
    let dataFormatada = null;

    // Formato DDMMYYYY (sem separadores) - PRIORIDADE
    const regexDDMMYYYY = /^(\d{2})(\d{2})(\d{4})$/;
    const matchDDMMYYYY = dataLimpa.match(regexDDMMYYYY);
    
    if (matchDDMMYYYY) {
      const dia = parseInt(matchDDMMYYYY[1], 10);
      const mes = parseInt(matchDDMMYYYY[2], 10);
      const ano = parseInt(matchDDMMYYYY[3], 10);
      
      // Validar dia e mês
      if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12) {
        // Criar data e validar
        const dataObj = new Date(ano, mes - 1, dia);
        
        // Verificar se a data é válida (ex: 31/02 não existe)
        if (dataObj.getDate() === dia && dataObj.getMonth() === mes - 1) {
          dataFormatada = formatarDataBrasileira(dataObj);
        }
      }
    }

    // Formato brasileiro: DD/MM/YYYY, DD/MM, DD.MM.YYYY, DD.MM, DD MM YYYY, DD MM
    // Aceita: /, -, ., ou espaço como separador (mantido para compatibilidade)
    if (!dataFormatada) {
      const regexBR = /^(\d{1,2})[\/\-\s\.](\d{1,2})([\/\-\s\.](\d{2,4}))?$/;
      const matchBR = dataLimpa.match(regexBR);
      
      if (matchBR) {
        const dia = parseInt(matchBR[1], 10);
        const mes = parseInt(matchBR[2], 10);
        const ano = matchBR[4] ? parseInt(matchBR[4], 10) : null;
        
        // Validar dia e mês
        if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12) {
          // Se não tiver ano, usar ano atual
          const anoFinal = ano || new Date().getFullYear();
          
          // Se ano tiver 2 dígitos, assumir 20XX
          const anoCompleto = anoFinal < 100 ? 2000 + anoFinal : anoFinal;
          
          // Criar data e validar
          const dataObj = new Date(anoCompleto, mes - 1, dia);
          
          // Verificar se a data é válida (ex: 31/02 não existe)
          if (dataObj.getDate() === dia && dataObj.getMonth() === mes - 1) {
            dataFormatada = formatarDataBrasileira(dataObj);
          }
        }
      }
    }

    // Se não funcionou, tentar formato ISO: YYYY-MM-DD
    if (!dataFormatada) {
      const regexISO = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
      const matchISO = dataLimpa.match(regexISO);
      
      if (matchISO) {
        const ano = parseInt(matchISO[1], 10);
        const mes = parseInt(matchISO[2], 10);
        const dia = parseInt(matchISO[3], 10);
        
        if (dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12) {
          const dataObj = new Date(ano, mes - 1, dia);
          
          if (dataObj.getDate() === dia && dataObj.getMonth() === mes - 1) {
            dataFormatada = formatarDataBrasileira(dataObj);
          }
        }
      }
    }

    // Se ainda não funcionou, tentar parse direto
    if (!dataFormatada) {
      const dataObj = new Date(dataLimpa);
      if (!isNaN(dataObj.getTime())) {
        dataFormatada = formatarDataBrasileira(dataObj);
      }
    }

    return dataFormatada;
  }

  return null;
}

/**
 * Formata data para formato brasileiro (DD/MM/YYYY)
 * @param {Date} data - Objeto Date
 * @returns {string} - Data formatada
 */
function formatarDataBrasileira(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

module.exports = {
  validarEFormatarData,
  formatarDataBrasileira
};

