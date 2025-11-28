'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Package, 
  Users, 
  MapPin,
  ArrowRight,
  Star,
  Truck,
  Briefcase,
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

export default function MudancaComercialPage() {
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
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Mudança Comercial
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Serviço especializado para empresas. Transporte seguro de equipamentos, móveis e documentos comerciais.
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

      {/* O que é Mudança Comercial */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                O que é Mudança Comercial?
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  A <strong className="text-gray-900">mudança comercial</strong> é um serviço especializado no transporte de equipamentos, móveis, documentos e outros itens de empresas, escritórios, lojas e estabelecimentos comerciais. Diferente da mudança residencial, a mudança comercial requer cuidados específicos com equipamentos sensíveis, documentos importantes e minimização do tempo de parada das atividades.
                </p>
                <p>
                  Uma mudança comercial bem executada permite que a empresa retome suas operações rapidamente no novo endereço, com todos os equipamentos instalados e funcionando corretamente. Por isso, é essencial contratar uma empresa especializada em mudanças comerciais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Mudança Comercial */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Tipos de Mudança Comercial
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Soluções especializadas para diferentes tipos de estabelecimentos comerciais
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <Briefcase className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudança de Escritório</h3>
                <p className="text-gray-700 leading-relaxed">
                  Transporte de móveis de escritório, equipamentos de informática, arquivos e documentos. Inclui desmontagem e remontagem de estações de trabalho.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudança de Loja</h3>
                <p className="text-gray-700 leading-relaxed">
                  Transporte de vitrines, prateleiras, balcões, equipamentos de ponto de venda e estoque. Planejamento para minimizar o tempo de fechamento.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                  <Truck className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudança Industrial</h3>
                <p className="text-gray-700 leading-relaxed">
                  Transporte de maquinários pesados, equipamentos industriais e estruturas. Requer equipamentos especiais e equipe altamente qualificada.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudança de Clínica</h3>
                <p className="text-gray-700 leading-relaxed">
                  Transporte especializado de equipamentos médicos, móveis clínicos e instrumentos. Requer cuidados especiais e certificações.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudança de Restaurante</h3>
                <p className="text-gray-700 leading-relaxed">
                  Transporte de equipamentos de cozinha, móveis, decoração e estoque. Planejamento para retomada rápida das operações.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudança de Consultório</h3>
                <p className="text-gray-700 leading-relaxed">
                  Transporte de equipamentos profissionais, móveis especializados e documentos. Serviço discreto e eficiente.
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
                Serviços Especializados para Mudança Comercial
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Soluções completas para garantir uma mudança comercial sem interrupções
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Embalagem Especializada</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Embalagem adequada para equipamentos eletrônicos, documentos e itens frágeis com materiais de proteção específicos.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Transporte de Equipamentos</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Veículos adequados e equipamentos especiais para transporte seguro de máquinas e equipamentos pesados.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-pink-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Equipe Técnica</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Profissionais especializados em desmontagem e instalação de equipamentos comerciais e industriais.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Planejamento de Horários</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Agendamento flexível, incluindo finais de semana e horários noturnos para minimizar impacto nas operações.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Seguro Especializado</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Seguro específico para equipamentos comerciais e industriais de alto valor, garantindo proteção total.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Instalação Completa</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Instalação e configuração de equipamentos no destino, garantindo que tudo funcione corretamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-indigo-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Vantagens da Mudança Comercial com MudaTech
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Soluções profissionais para sua empresa
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Minimiza Paradas</h3>
                <p className="text-white/80">
                  Planejamento eficiente para reduzir o tempo de interrupção das atividades comerciais
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Equipamentos Protegidos</h3>
                <p className="text-white/80">
                  Cuidado especial com equipamentos sensíveis e de alto valor durante todo o processo
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Equipe Especializada</h3>
                <p className="text-white/80">
                  Profissionais treinados para lidar com equipamentos comerciais e industriais
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instalação Completa</h3>
                <p className="text-white/80">
                  Desmontagem, transporte e instalação completa no destino, pronta para uso
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <WhatsAppCTASection 
        title="Calcule o preço da sua mudança comercial em segundos"
        subtitle="Descubra o valor real da sua mudança comercial em 60 segundos pelo WhatsApp"
        variant="compact"
      />
    </div>
  )
}

