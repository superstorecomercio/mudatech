// Templates de email para envio de orçamentos
// DEPRECATED: Use lib/email/template-service.ts e os templates do banco de dados

interface OrcamentoData {
  codigo_orcamento?: string
  nome_cliente: string
  email_cliente: string
  telefone_cliente: string
  origem_completo: string
  destino_completo: string
  tipo_imovel: string
  metragem?: string
  distancia_km: number
  preco_min: number
  preco_max: number
  data_estimada?: string
  lista_objetos?: string
}

interface HotsiteData {
  nome_exibicao: string
  email: string
}

/**
 * @deprecated Use processEmailTemplate('orcamento_empresa', variables) do template-service.ts
 */
export function criarTemplateEmailOrcamento(
  orcamento: OrcamentoData,
  hotsite: HotsiteData
): string {
  const tipoImovelLabels: Record<string, string> = {
    casa: 'Casa',
    apartamento: 'Apartamento',
    empresa: 'Empresa'
  }

  const metragemLabels: Record<string, string> = {
    ate_50: 'Até 50 m²',
    '50_150': '50 a 150 m²',
    '150_300': '150 a 300 m²',
    acima_300: 'Acima de 300 m²'
  }

  const tipoImovel = tipoImovelLabels[orcamento.tipo_imovel] || orcamento.tipo_imovel
  const metragem = orcamento.metragem ? metragemLabels[orcamento.metragem] || orcamento.metragem : 'Não informado'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Orçamento de Mudança</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🚚 Novo Orçamento de Mudança</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    ${orcamento.codigo_orcamento ? `
    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
      <strong style="color: #1e40af; font-size: 18px;">Código: ${orcamento.codigo_orcamento}</strong>
    </div>
    ` : ''}
    
    <h2 style="color: #1f2937; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Dados do Cliente</h2>
    <table style="width: 100%; margin-bottom: 25px;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 150px;">Nome:</td>
        <td style="padding: 8px 0;">${orcamento.nome_cliente}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Email:</td>
        <td style="padding: 8px 0;"><a href="mailto:${orcamento.email_cliente}" style="color: #667eea;">${orcamento.email_cliente}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Telefone:</td>
        <td style="padding: 8px 0;"><a href="tel:${orcamento.telefone_cliente}" style="color: #667eea;">${orcamento.telefone_cliente}</a></td>
      </tr>
    </table>

    <h2 style="color: #1f2937; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Detalhes da Mudança</h2>
    <table style="width: 100%; margin-bottom: 25px;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 150px;">Origem:</td>
        <td style="padding: 8px 0;">${orcamento.origem_completo}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Destino:</td>
        <td style="padding: 8px 0;">${orcamento.destino_completo}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Distância:</td>
        <td style="padding: 8px 0;">${orcamento.distancia_km} km</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Tipo:</td>
        <td style="padding: 8px 0;">${tipoImovel}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Metragem:</td>
        <td style="padding: 8px 0;">${metragem}</td>
      </tr>
      ${orcamento.data_estimada ? `
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Data Estimada:</td>
        <td style="padding: 8px 0;">${new Date(orcamento.data_estimada).toLocaleDateString('pt-BR')}</td>
      </tr>
      ` : ''}
    </table>

    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
      <h3 style="color: white; margin: 0 0 10px 0; font-size: 20px;">💰 Faixa de Preço Estimada</h3>
      <p style="color: white; margin: 0; font-size: 24px; font-weight: bold;">
        R$ ${orcamento.preco_min.toLocaleString('pt-BR')} - R$ ${orcamento.preco_max.toLocaleString('pt-BR')}
      </p>
    </div>

    ${orcamento.lista_objetos ? `
    <h2 style="color: #1f2937; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Lista de Objetos</h2>
    <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: monospace; font-size: 14px;">
${orcamento.lista_objetos}
    </div>
    ` : ''}

    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        Este orçamento foi gerado automaticamente pelo sistema MudaTech.<br>
        Entre em contato com o cliente para fornecer uma cotação personalizada.
      </p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
    <p>MudaTech - Plataforma de Orçamentos de Mudança</p>
  </div>
</body>
</html>
  `.trim()
}

