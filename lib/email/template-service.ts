// Serviço para buscar e processar templates de email

import { createAdminClient } from '@/lib/supabase/server'
import { processTemplate, generateTrackingCode, TemplateVariables } from './template-engine'

export interface EmailTemplate {
  id: string
  tipo: string
  nome: string
  assunto: string
  corpo_html: string
  variaveis: string[]
  ativo: boolean
}

/**
 * Busca um template por tipo
 */
export async function getTemplate(tipo: string): Promise<EmailTemplate | null> {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('tipo', tipo)
      .eq('ativo', true)
      .single()

    if (error || !data) {
      console.error(`Template ${tipo} não encontrado:`, error)
      return null
    }

    return data as EmailTemplate
  } catch (error) {
    console.error('Erro ao buscar template:', error)
    return null
  }
}

/**
 * Processa um template com variáveis e retorna assunto e corpo HTML
 */
export async function processEmailTemplate(
  tipo: string,
  variables: TemplateVariables
): Promise<{ assunto: string; html: string; codigoRastreamento: string } | null> {
  const template = await getTemplate(tipo)
  
  if (!template) {
    return null
  }

  // Gerar código de rastreamento único
  const codigoRastreamento = generateTrackingCode()
  
  // Adicionar código de rastreamento às variáveis
  const varsComRastreamento = {
    ...variables,
    codigo_rastreamento: codigoRastreamento
  }

  // Processar template
  const assunto = processTemplate(template.assunto, varsComRastreamento)
  const html = processTemplate(template.corpo_html, varsComRastreamento)

  return {
    assunto,
    html,
    codigoRastreamento
  }
}

/**
 * Salva registro de tracking do email enviado
 */
export async function saveEmailTracking(data: {
  codigo_rastreamento: string
  orcamento_id?: string
  campanha_id?: string
  hotsite_id: string
  tipo_email: string
  email_destinatario: string
  assunto: string
  metadata?: any
}): Promise<void> {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('email_tracking')
      .insert({
        codigo_rastreamento: data.codigo_rastreamento,
        orcamento_id: data.orcamento_id || null,
        campanha_id: data.campanha_id || null,
        hotsite_id: data.hotsite_id,
        tipo_email: data.tipo_email,
        email_destinatario: data.email_destinatario,
        assunto: data.assunto,
        metadata: data.metadata || null
      })

    if (error) {
      console.error('Erro ao salvar tracking:', error)
    }
  } catch (error) {
    console.error('Erro ao salvar tracking:', error)
  }
}

/**
 * Busca tracking por código de rastreamento
 */
export async function getTrackingByCode(codigo: string) {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('email_tracking')
      .select(`
        *,
        orcamentos(*),
        campanhas(*),
        hotsites(*)
      `)
      .eq('codigo_rastreamento', codigo)
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao buscar tracking:', error)
    return null
  }
}

