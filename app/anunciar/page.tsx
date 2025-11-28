'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, ArrowRight, Star, TrendingUp, Users, Zap } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'

interface Plano {
  id: string
  nome: string
  descricao: string | null
  ordem: number
  preco: number
  periodicidade: 'mensal' | 'trimestral' | 'anual'
}

export default function AnunciarPage() {
  const router = useRouter()
  const [planos, setPlanos] = useState<Plano[]>([])
  const [loading, setLoading] = useState(true)
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null)

  useEffect(() => {
    carregarPlanos()
  }, [])

  async function carregarPlanos() {
    try {
      const response = await fetch('/api/admin/planos')
      const data = await response.json()

      if (response.ok) {
        setPlanos(data.planos || [])
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatarPreco(preco: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco)
  }

  function formatarPeriodicidade(periodicidade: string) {
    const map: Record<string, string> = {
      mensal: 'mês',
      trimestral: 'trimestre',
      anual: 'ano',
    }
    return map[periodicidade] || periodicidade
  }

  function handleSelecionarPlano(planoId: string) {
    setPlanoSelecionado(planoId)
    router.push(`/anunciar/cadastro?plano=${planoId}`)
  }

  const beneficios = [
    'Orçamentos qualificados mensalmente',
    'Perfil completo no MudaTech',
    'Listagem destacada em páginas de cidades',
    'Suporte prioritário',
    'Atualização de dados quando necessário',
    'Relatórios de performance',
    'Badge "Verificado"',
    'Campanhas promocionais',
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#667eea] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando planos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#667eea]/10 via-[#4facfe]/10 to-[#667eea]/5 py-20 lg:py-28">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Anuncie sua empresa de mudanças
            </h1>
            <p className="text-xl text-gray-600 mb-4 leading-relaxed">
              Receba orçamentos qualificados através do MudaTech
            </p>
            <p className="text-lg text-gray-500 mb-8">
              Escolha o plano ideal para sua empresa e comece a crescer hoje mesmo
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <Users className="w-8 h-8 text-[#667eea] mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                <div className="text-sm text-gray-600">Empresas cadastradas</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-[#4facfe] mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">10k+</div>
                <div className="text-sm text-gray-600">Orçamentos/mês</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">4.8/5</div>
                <div className="text-sm text-gray-600">Avaliação média</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Escolha seu plano
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Planos flexíveis para empresas de todos os tamanhos
            </p>
          </div>

          {planos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Nenhum plano disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {planos.map((plano, index) => (
                <Card
                  key={plano.id}
                  className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl ${
                    index === 1
                      ? 'border-[#667eea] shadow-xl scale-105 bg-gradient-to-br from-[#667eea]/5 to-[#4facfe]/5'
                      : 'border-gray-200 hover:border-[#667eea]/50'
                  }`}
                >
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#667eea] text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Mais Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plano.nome}</h3>
                    {plano.descricao && (
                      <p className="text-sm text-gray-600 mb-6">{plano.descricao}</p>
                    )}
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-5xl font-bold text-gray-900">
                        {formatarPreco(plano.preco)}
                      </span>
                      <span className="text-lg text-gray-600">
                        /{formatarPeriodicidade(plano.periodicidade)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Pagamento {plano.periodicidade === 'mensal' ? 'mensal' : plano.periodicidade === 'trimestral' ? 'trimestral' : 'anual'} recorrente
                    </p>
                  </div>

                  <div className="border-t border-b border-gray-200 py-6 my-6">
                    <ul className="space-y-3">
                      {beneficios.map((beneficio, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#667eea] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{beneficio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleSelecionarPlano(plano.id)}
                    className={`w-full rounded-xl h-12 text-base font-semibold ${
                      index === 1
                        ? 'bg-[#667eea] text-white hover:bg-[#5568d3]'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                    size="lg"
                  >
                    Escolher este plano
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Por que escolher o MudaTech?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Zap className="w-10 h-10 text-[#667eea] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Orçamentos em tempo real</h3>
                <p className="text-gray-600">
                  Receba orçamentos qualificados diretamente no seu email e painel administrativo.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Users className="w-10 h-10 text-[#4facfe] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Alcance mais clientes</h3>
                <p className="text-gray-600">
                  Sua empresa aparece em páginas de cidades e resultados de busca do MudaTech.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <TrendingUp className="w-10 h-10 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aumente suas vendas</h3>
                <p className="text-gray-600">
                  Conecte-se com clientes que realmente precisam do seu serviço.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Star className="w-10 h-10 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Badge verificado</h3>
                <p className="text-gray-600">
                  Ganhe a confiança dos clientes com nosso selo de empresa verificada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Card className="p-12 bg-gradient-to-br from-[#667eea]/10 to-[#4facfe]/10 border-[#667eea]/20">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Pronto para começar?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Escolha seu plano e comece a receber orçamentos qualificados hoje mesmo.
              </p>
              {planos.length > 0 && (
                <Button
                  onClick={() => handleSelecionarPlano(planos[0].id)}
                  size="lg"
                  className="rounded-full px-8 font-semibold bg-[#667eea] text-white hover:bg-[#5568d3]"
                >
                  Começar agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

