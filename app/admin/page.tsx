'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Mail, 
  Calendar,
  RefreshCw,
  ArrowRight
} from 'lucide-react'
import { formatDateOnlyBR, formatDateTimeBR } from '@/lib/utils/date'

interface DashboardData {
  status_geral: {
    emails_orcamentos_ok: boolean
    emails_vencimento_ok: boolean
    tem_erros_recentes: boolean
    campanhas_vencidas_hoje: number
    campanhas_vencidas_ontem: number
    campanhas_vencendo_amanha: number
  }
  emails_orcamentos: {
    total: number
    enviados: number
    na_fila: number
    erro: number
    enviando: number
  }
  emails_vencimento: {
    total: number
    enviados: number
    na_fila: number
    erro: number
  }
  erros_recentes: Array<{
    id: string
    tipo_email: string
    created_at: string
    erro: string
  }>
  campanhas_vencendo: Array<{
    id: string
    data_fim_formatada: string
    hotsite_nome: string
    hotsite_email: string | null
    vence_hoje: boolean
    vence_ontem: boolean
    vence_amanha: boolean
    status: string
    email_criado: boolean
    email_status: string | null
    email_enviado: boolean
  }>
  data_atual: string
  data_ontem: string
  data_amanha: string
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/dashboard')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do dashboard')
      }
      
      const data = await response.json()
      setDashboardData(data)
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido')
      console.error('Erro ao buscar dados do dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Erro ao carregar dashboard</h3>
            <p className="text-red-700">{error || 'Erro desconhecido'}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { status_geral, emails_orcamentos, emails_vencimento, erros_recentes, campanhas_vencendo } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Status Geral do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Emails de Orçamentos */}
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
          status_geral.emails_orcamentos_ok ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Emails de Orçamentos</h3>
              <p className="text-sm text-gray-600">Status dos envios (últimas 24h)</p>
            </div>
            {status_geral.emails_orcamentos_ok ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{emails_orcamentos.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Enviados:</span>
              <span className="font-medium text-green-600">{emails_orcamentos.enviados}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Na Fila:</span>
              <span className="font-medium text-orange-600">{emails_orcamentos.na_fila}</span>
            </div>
            {emails_orcamentos.erro > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Erros:</span>
                <span className="font-medium text-red-600">{emails_orcamentos.erro}</span>
              </div>
            )}
          </div>
          <Link
            href="/admin/emails"
            className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Ver detalhes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Status Emails de Vencimento */}
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
          status_geral.emails_vencimento_ok ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Emails de Vencimento</h3>
              <p className="text-sm text-gray-600">Status dos envios (últimas 24h)</p>
            </div>
            {status_geral.emails_vencimento_ok ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{emails_vencimento.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Enviados:</span>
              <span className="font-medium text-green-600">{emails_vencimento.enviados}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Na Fila:</span>
              <span className="font-medium text-orange-600">{emails_vencimento.na_fila}</span>
            </div>
            {emails_vencimento.erro > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Erros:</span>
                <span className="font-medium text-red-600">{emails_vencimento.erro}</span>
              </div>
            )}
          </div>
          <Link
            href="/admin/emails/campanhas-vencendo-hoje"
            className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Ver detalhes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Erros Recentes */}
      {status_geral.tem_erros_recentes && erros_recentes.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Erros Recentes (últimas 2 horas)</h3>
          </div>
          <div className="space-y-2">
            {erros_recentes.slice(0, 5).map((erro) => (
              <div key={erro.id} className="bg-white rounded p-3 border border-red-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{erro.tipo_email}</p>
                    <p className="text-xs text-gray-600 mt-1">{erro.erro}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDateTimeBR(erro.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {erros_recentes.length > 5 && (
            <p className="text-sm text-red-700 mt-2">
              +{erros_recentes.length - 5} erros adicionais
            </p>
          )}
        </div>
      )}

      {/* Campanhas Vencendo */}
      {campanhas_vencendo.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Campanhas Vencendo</h3>
            <Link
              href="/admin/campanhas"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Campanhas que vencem hoje */}
          {campanhas_vencendo.filter(c => c.vence_hoje).length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Vencem Hoje ({campanhas_vencendo.filter(c => c.vence_hoje).length})
              </h4>
              <div className="space-y-2">
                {campanhas_vencendo.filter(c => c.vence_hoje).map((campanha) => (
                  <div key={campanha.id} className="bg-red-50 border border-red-200 rounded p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{campanha.hotsite_nome}</p>
                        <p className="text-sm text-gray-600">Vence: {campanha.data_fim_formatada}</p>
                        {campanha.email_criado ? (
                          <div className="mt-1 flex items-center gap-2">
                            {campanha.email_enviado ? (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Email enviado
                              </span>
                            ) : (
                              <span className="text-xs text-orange-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Email na fila
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            Email não criado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campanhas que venceram ontem */}
          {campanhas_vencendo.filter(c => c.vence_ontem).length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Venceram Ontem ({campanhas_vencendo.filter(c => c.vence_ontem).length})
              </h4>
              <div className="space-y-2">
                {campanhas_vencendo.filter(c => c.vence_ontem).map((campanha) => (
                  <div key={campanha.id} className="bg-orange-50 border border-orange-200 rounded p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{campanha.hotsite_nome}</p>
                        <p className="text-sm text-gray-600">Venceu: {campanha.data_fim_formatada}</p>
                        {campanha.email_criado ? (
                          <div className="mt-1 flex items-center gap-2">
                            {campanha.email_enviado ? (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Email enviado
                              </span>
                            ) : (
                              <span className="text-xs text-orange-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Email na fila
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            Email não criado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campanhas que vencem amanhã */}
          {campanhas_vencendo.filter(c => c.vence_amanha).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Vencem Amanhã ({campanhas_vencendo.filter(c => c.vence_amanha).length})
              </h4>
              <div className="space-y-2">
                {campanhas_vencendo.filter(c => c.vence_amanha).map((campanha) => (
                  <div key={campanha.id} className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{campanha.hotsite_nome}</p>
                        <p className="text-sm text-gray-600">Vence: {campanha.data_fim_formatada}</p>
                        {campanha.email_criado ? (
                          <div className="mt-1 flex items-center gap-2">
                            {campanha.email_enviado ? (
                              <span className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Email enviado
                              </span>
                            ) : (
                              <span className="text-xs text-orange-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Email na fila
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            Aguardando processamento
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mensagem se não houver campanhas vencendo */}
      {campanhas_vencendo.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Tudo em ordem!</h3>
              <p className="text-green-700">Não há campanhas vencendo hoje ou ontem.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
