'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Package, 
  Users, 
  Truck,
  ArrowRight,
  Star,
  Route,
  Globe,
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

export default function MudancaInterestadualPage() {
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
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Globe className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Mudança Interestadual
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Transporte seguro e confiável entre estados. Logística especializada para mudanças de longa distância.
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

      {/* O que é Mudança Interestadual */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                O que é Mudança Interestadual?
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  A <strong className="text-gray-900">mudança interestadual</strong> é o serviço de transporte de bens entre estados diferentes do Brasil. Este tipo de mudança requer planejamento detalhado, logística especializada e veículos adequados para longas distâncias.
                </p>
                <p>
                  Mudanças interestaduais podem variar de algumas centenas a milhares de quilômetros, exigindo cuidados especiais com embalagem, transporte e prazos. Por isso, é fundamental contratar uma empresa experiente em mudanças de longa distância.
                </p>
                <p>
                  O MudaTech conecta você às melhores empresas especializadas em mudanças interestaduais, garantindo segurança, pontualidade e cuidado com seus pertences durante todo o trajeto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principais Rotas */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Principais Rotas Interestaduais
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Atendemos as principais rotas entre estados do Brasil
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Route className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">São Paulo ↔ Rio de Janeiro</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Uma das rotas mais movimentadas do país, com empresas especializadas e frequência diária.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Route className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">São Paulo ↔ Belo Horizonte</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Rota estratégica entre duas das principais capitais, com logística otimizada.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Route className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">São Paulo ↔ Curitiba</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Conexão entre o maior centro econômico e o sul do país, com empresas experientes.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Route className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Rio de Janeiro ↔ Brasília</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Rota para a capital federal, com serviços especializados e agendamento flexível.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Route className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">São Paulo ↔ Porto Alegre</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Uma das rotas mais longas, requerendo planejamento especial e veículos adequados.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Route className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Outras Rotas</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Atendemos mudanças entre qualquer combinação de estados do Brasil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Especializados */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Serviços Especializados para Mudança Interestadual
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Soluções completas para mudanças de longa distância
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Veículos Especializados</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Frotas adequadas para longas distâncias, com sistemas de segurança e rastreamento em tempo real.
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Embalagem Reforçada</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Embalagem especial para longas viagens, protegendo seus bens contra impactos e variações climáticas.
                </p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-teal-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Seguro Completo</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Seguro de carga para mudanças interestaduais, cobrindo todo o trajeto e garantindo proteção total.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Rastreamento</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Acompanhe sua mudança em tempo real durante todo o trajeto, com atualizações regulares.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Prazos Garantidos</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Compromisso com prazos acordados, com comunicação proativa sobre o status da mudança.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Equipe Experiente</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Profissionais com experiência em mudanças interestaduais, conhecedores das rotas e procedimentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-600 to-teal-800 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Por que escolher o MudaTech para mudança interestadual?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                A melhor plataforma para encontrar empresas especializadas em mudanças de longa distância
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cobertura Nacional</h3>
                <p className="text-white/80">
                  Empresas em todos os estados do Brasil, prontas para atender sua mudança interestadual
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Segurança Total</h3>
                <p className="text-white/80">
                  Seguro de carga especializado e rastreamento em tempo real durante todo o trajeto
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Empresas Verificadas</h3>
                <p className="text-white/80">
                  Todas as empresas passam por verificação de qualidade e experiência em mudanças interestaduais
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Orçamentos Grátis</h3>
                <p className="text-white/80">
                  Receba múltiplos orçamentos sem custo e compare preços e serviços antes de decidir
                </p>
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
                Dicas para Mudança Interestadual
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Planeje com Antecedência</h3>
                    <p className="text-gray-700">
                      Mudanças interestaduais requerem mais tempo de planejamento. Agende com pelo menos 3-4 semanas de antecedência.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifique Documentação</h3>
                    <p className="text-gray-700">
                      Certifique-se de que a empresa possui todas as licenças e documentação necessária para transporte interestadual.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contrate Seguro</h3>
                    <p className="text-gray-700">
                      Para mudanças interestaduais, o seguro de carga é essencial. Verifique a cobertura oferecida pela empresa.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Acompanhe o Rastreamento</h3>
                    <p className="text-gray-700">
                      Utilize o sistema de rastreamento para acompanhar sua mudança em tempo real durante todo o trajeto.
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
        title="Calcule o preço da sua mudança interestadual em segundos"
        subtitle="Descubra o valor real da sua mudança interestadual em 60 segundos pelo WhatsApp"
        variant="compact"
      />
    </div>
  )
}

