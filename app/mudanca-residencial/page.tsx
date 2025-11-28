'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Package, 
  Users, 
  MapPin,
  ArrowRight,
  Star,
  Truck,
  Check
} from 'lucide-react'
import { WhatsAppCTASection } from '@/app/components/WhatsAppCTASection'

const WHATSAPP_URL = "https://wa.me/15551842523?text=Ol%C3%A1"

const getPessoasSolicitaram = () => {
  const base = 113
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDate()
  const variation = Math.floor((hour * 13 + day * 7) % 100)
  return base + variation
}

export default function MudancaResidencialPage() {
  const [pessoasSolicitaram, setPessoasSolicitaram] = useState(getPessoasSolicitaram())

  useEffect(() => {
    const interval = setInterval(() => {
      setPessoasSolicitaram(getPessoasSolicitaram())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Home className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Mudança Residencial
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Encontre as melhores empresas de mudança residencial do Brasil. Orçamentos gratuitos e empresas verificadas.
            </p>
            
            {/* Rating */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg mb-6">
              <div className="flex gap-0.5 md:gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#FFD700] text-[#FFD700] drop-shadow-[0_2px_4px_rgba(255,215,0,0.5)] stroke-black stroke-[1]" />
                ))}
              </div>
              <span className="text-sm md:text-sm font-bold text-white">4.9/5 - Mais de 10.000 orçamentos</span>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-6 text-white">
              <div className="flex items-center gap-2 text-sm md:text-base font-semibold">
                <Check className="w-5 h-5 text-[#FFD700]" />
                <span>Grátis</span>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base font-semibold">
                <Check className="w-5 h-5 text-[#FFD700]" />
                <span>Rápido</span>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base font-semibold">
                <Check className="w-5 h-5 text-[#FFD700]" />
                <span>Sem Cadastro</span>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-4"
            >
              <button
                className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-lg md:text-2xl px-8 md:px-[60px] py-4 md:py-[25px] rounded-2xl shadow-[0_15px_50px_rgba(37,211,102,0.5)] hover:shadow-[0_20px_60px_rgba(37,211,102,0.7)] hover:scale-110 transition-all duration-300 font-extrabold animate-glow w-full md:w-auto"
              >
                💬 Calcular no WhatsApp Grátis
              </button>
            </a>

            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] via-[#FF4500] to-[#FF1744] text-white px-4 py-2 md:px-8 md:py-4 rounded-full font-extrabold shadow-[0_8px_30px_rgba(255,107,53,0.4)] text-sm md:text-base">
              <span className="animate-fire text-lg md:text-2xl">🔥</span>
              <span>{pessoasSolicitaram} pessoas solicitaram orçamento hoje</span>
            </div>
          </div>
        </div>
      </section>

      {/* O que é Mudança Residencial */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                O que é Mudança Residencial?
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  A <strong className="text-gray-900">mudança residencial</strong> é o serviço de transporte de móveis, eletrodomésticos e pertences pessoais de uma residência para outra. Este tipo de mudança pode ser realizada dentro da mesma cidade (mudança local), entre cidades do mesmo estado (mudança intermunicipal) ou entre estados diferentes (mudança interestadual).
                </p>
                <p>
                  Uma mudança residencial bem planejada envolve embalagem adequada dos objetos, desmontagem de móveis quando necessário, transporte seguro e montagem no destino. Por isso, é essencial contratar uma empresa de mudança confiável e experiente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Mudança Residencial */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Tipos de Mudança Residencial
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Oferecemos soluções completas para diferentes necessidades de mudança
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudança Local</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mudanças dentro da mesma cidade ou região metropolitana. Ideal para quem está se mudando para um bairro próximo.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Truck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudança Intermunicipal</h3>
                <p className="text-gray-700 leading-relaxed">
                  Transporte entre cidades do mesmo estado. Requer planejamento adequado e veículos apropriados para a distância.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudança Interestadual</h3>
                <p className="text-gray-700 leading-relaxed">
                  Mudanças entre estados diferentes. Exige logística especializada e pode incluir serviços de guarda-móveis temporários.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Incluídos */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Serviços Incluídos na Mudança Residencial
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Um serviço completo e profissional para sua tranquilidade
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Embalagem Profissional</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Embalagem adequada de todos os objetos com materiais de qualidade para garantir proteção durante o transporte.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Transporte Seguro</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Veículos adequados e equipados para transportar seus pertences com segurança e cuidado.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Equipe Especializada</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Profissionais treinados para desmontar, embalar, transportar e montar seus móveis com cuidado.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Desmontagem e Montagem</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Desmontagem de móveis na origem e montagem completa no destino, garantindo que tudo fique no lugar certo.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Seguro de Carga</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Proteção dos seus bens durante todo o processo de mudança, oferecendo tranquilidade e segurança.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-pink-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Agendamento Flexível</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Agende sua mudança no horário mais conveniente para você, incluindo finais de semana quando necessário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Por que escolher o MudaTech para sua mudança residencial?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                A plataforma mais confiável para encontrar empresas de mudança no Brasil
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Empresas Verificadas</h3>
                <p className="text-white/80">
                  Todas as empresas cadastradas passam por verificação de qualidade e credibilidade
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Orçamentos Grátis</h3>
                <p className="text-white/80">
                  Receba múltiplos orçamentos sem custo e compare preços e serviços
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Segurança Garantida</h3>
                <p className="text-white/80">
                  Empresas com seguro de carga e compromisso com a segurança dos seus bens
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Atendimento Rápido</h3>
                <p className="text-white/80">
                  Receba orçamentos em minutos e agende sua mudança com facilidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Como Solicitar sua Mudança Residencial
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Processo simples e rápido em apenas 3 passos
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Informe os Dados</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Preencha o formulário com origem, destino, tipo de imóvel e data estimada da mudança.
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-gray-300" />
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Receba Orçamentos</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Empresas verificadas entrarão em contato com orçamentos personalizados para sua mudança.
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-gray-300" />
                </div>
              </div>

              <div>
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Escolha e Contrate</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Compare os orçamentos recebidos e escolha a empresa que melhor atende suas necessidades.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dicas */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                Dicas para uma Mudança Residencial Bem-Sucedida
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Planeje com Antecedência</h3>
                    <p className="text-gray-700">
                      Agende sua mudança com pelo menos 2 semanas de antecedência, especialmente em épocas de alta demanda como início e fim de mês.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Faça um Inventário</h3>
                    <p className="text-gray-700">
                      Liste todos os itens que serão transportados. Isso ajuda a obter orçamentos mais precisos e facilita a conferência no destino.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare Orçamentos</h3>
                    <p className="text-gray-700">
                      Solicite orçamentos de pelo menos 3 empresas diferentes. Compare não apenas o preço, mas também os serviços incluídos e avaliações.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifique o Seguro</h3>
                    <p className="text-gray-700">
                      Certifique-se de que a empresa contratada possui seguro de carga adequado para proteger seus bens durante o transporte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <WhatsAppCTASection 
        title="Calcule o preço da sua mudança residencial em segundos"
        subtitle="Descubra o valor real da sua mudança residencial em 60 segundos pelo WhatsApp"
        variant="compact"
      />
    </div>
  )
}

