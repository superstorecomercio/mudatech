'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Building2, MapPin, Phone, Mail, Edit, Plus, ToggleLeft, ToggleRight } from 'lucide-react'

interface Empresa {
  id: string
  nome: string
  slug: string
  cnpj?: string
  razao_social?: string
  nome_fantasia?: string
  nome_responsavel?: string
  email_responsavel?: string
  telefone_responsavel?: string
  endereco_completo?: string
  estado?: string
  cep?: string
  email?: string
  telefones?: string[]
  ativo: boolean
  cidade_id?: string
  cidade?: {
    id: string
    nome: string
    slug: string
    estado: string
  } | string
  hotsites?: Array<{
    id: string
    nome_exibicao: string
    slug: string
    ativo: boolean
  }>
  created_at: string
  updated_at: string
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('') // Input do usuário
  const [search, setSearch] = useState('') // Valor usado na busca (com debounce)
  const [total, setTotal] = useState(0)

  const loadEmpresas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      params.set('limit', '100')

      const response = await fetch(`/api/admin/empresas?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar empresas')
      }

      const data = await response.json()
      setEmpresas(data.empresas || [])
      setTotal(data.total || 0)
    } catch (error: any) {
      console.error('Erro ao carregar empresas:', error)
      alert(`Erro ao carregar empresas: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Debounce: atualiza o search apenas após 500ms sem digitação
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Carrega empresas quando search muda (após debounce)
  useEffect(() => {
    loadEmpresas()
  }, [search])

  const toggleEmpresaStatus = async (empresaId: string, novoStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/empresas/${empresaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ativo: novoStatus }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status da empresa')
      }

      // Atualizar estado local
      setEmpresas((prev) =>
        prev.map((emp) => (emp.id === empresaId ? { ...emp, ativo: novoStatus } : emp))
      )
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      alert(`Erro ao atualizar status: ${error.message}`)
    }
  }

  const formatarCNPJ = (cnpj?: string) => {
    if (!cnpj) return '-'
    const cleaned = cnpj.replace(/\D/g, '')
    if (cleaned.length !== 14) return cnpj
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  const formatarTelefone = (telefone?: string) => {
    if (!telefone) return '-'
    const cleaned = telefone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    }
    return telefone
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600">Carregando empresas...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Empresas</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Gerencie os dados cadastrais das empresas
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Total de Empresas</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{total}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Empresas Ativas</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">
                {empresas.filter((e) => e.ativo).length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mb-1">Com CNPJ</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                {empresas.filter((e) => e.cnpj).length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
              📄
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, CNPJ, razão social ou nome fantasia..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 A busca é realizada automaticamente após 500ms sem digitação
        </p>
      </div>

      {/* Info sobre Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Sobre o Status:</strong> O status da empresa é independente das campanhas. 
          Uma empresa pode estar <strong>Ativa</strong> no sistema mas sem campanhas ativas, 
          ou <strong>Inativa</strong> (oculta do sistema) independentemente das campanhas. 
          Clique no status para ativar/desativar.
        </p>
      </div>

      {/* Tabela de Empresas - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotsites
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {empresas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma empresa encontrada
                  </td>
                </tr>
              ) : (
                empresas.map((empresa) => (
                  <tr key={empresa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {empresa.nome_fantasia || empresa.nome}
                      </div>
                      {empresa.razao_social && empresa.razao_social !== empresa.nome_fantasia && (
                        <div className="text-xs text-gray-500">{empresa.razao_social}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatarCNPJ(empresa.cnpj)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {typeof empresa.cidade === 'object' && empresa.cidade?.nome
                          ? empresa.cidade.nome
                          : typeof empresa.cidade === 'string'
                          ? empresa.cidade
                          : '-'}
                        {empresa.estado && `, ${empresa.estado}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {empresa.email_responsavel || empresa.email ? (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1 text-gray-400" />
                            {empresa.email_responsavel || empresa.email}
                          </div>
                        ) : (
                          '-'
                        )}
                        {empresa.telefone_responsavel && (
                          <div className="flex items-center mt-1">
                            <Phone className="w-4 h-4 mr-1 text-gray-400" />
                            {formatarTelefone(empresa.telefone_responsavel)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {empresa.hotsites?.length || 0} hotsite(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleEmpresaStatus(empresa.id, !empresa.ativo)}
                        className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                          empresa.ativo
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        title={empresa.ativo ? 'Clique para desativar' : 'Clique para ativar'}
                      >
                        {empresa.ativo ? (
                          <ToggleRight className="w-3 h-3 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-3 h-3 text-gray-600" />
                        )}
                        {empresa.ativo ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {empresa.hotsites && empresa.hotsites.length > 0 ? (
                        <Link
                          href={`/admin/hotsites/${empresa.hotsites[0].id}`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Link>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards de Empresas - Mobile */}
      <div className="md:hidden space-y-4">
        {empresas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            Nenhuma empresa encontrada
          </div>
        ) : (
          empresas.map((empresa) => (
            <div key={empresa.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {empresa.nome_fantasia || empresa.nome}
                  </h3>
                  {empresa.razao_social && empresa.razao_social !== empresa.nome_fantasia && (
                    <p className="text-sm text-gray-500 mt-1">{empresa.razao_social}</p>
                  )}
                </div>
                <button
                  onClick={() => toggleEmpresaStatus(empresa.id, !empresa.ativo)}
                  className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                    empresa.ativo
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  title={empresa.ativo ? 'Clique para desativar' : 'Clique para ativar'}
                >
                  {empresa.ativo ? (
                    <ToggleRight className="w-3 h-3 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-3 h-3 text-gray-600" />
                  )}
                  {empresa.ativo ? 'Ativo' : 'Inativo'}
                </button>
              </div>

              <div className="space-y-2 text-sm">
                {empresa.cnpj && (
                  <div>
                    <span className="text-gray-500">CNPJ: </span>
                    <span className="text-gray-900">{formatarCNPJ(empresa.cnpj)}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-900">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {typeof empresa.cidade === 'object' && empresa.cidade?.nome
                    ? empresa.cidade.nome
                    : typeof empresa.cidade === 'string'
                    ? empresa.cidade
                    : '-'}
                  {empresa.estado && `, ${empresa.estado}`}
                </div>
                {empresa.email_responsavel || empresa.email ? (
                  <div className="flex items-center text-gray-900">
                    <Mail className="w-4 h-4 mr-1 text-gray-400" />
                    {empresa.email_responsavel || empresa.email}
                  </div>
                ) : null}
                {empresa.telefone_responsavel && (
                  <div className="flex items-center text-gray-900">
                    <Phone className="w-4 h-4 mr-1 text-gray-400" />
                    {formatarTelefone(empresa.telefone_responsavel)}
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Hotsites: </span>
                  <span className="text-gray-900">{empresa.hotsites?.length || 0}</span>
                </div>
              </div>

              {empresa.hotsites && empresa.hotsites.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/admin/hotsites/${empresa.hotsites[0].id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Hotsite
                  </Link>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

