'use client'

import Link from 'next/link'
import { 
  Box, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Package, 
  Users, 
  Wrench,
  ArrowRight,
  Star,
  ToolCase,
  Settings
} from 'lucide-react'
import { WhatsAppCTASection } from '@/app/components/WhatsAppCTASection'

export default function EmbalagemEMontagemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-700 to-rose-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Box className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Embalagem e Montagem
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Serviço completo de embalagem profissional e montagem de móveis. Proteção total para seus pertences durante a mudança.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/calcularmudanca"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
              >
                Solicitar Orçamento
              </Link>
              <Link
                href="/cidades"
                className="px-8 py-4 bg-white/10 text-white border-2 border-white rounded-lg font-semibold hover:bg-white/20 transition-colors text-lg"
              >
                Ver Empresas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* O que é Embalagem e Montagem */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                O que é Embalagem e Montagem?
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  O serviço de <strong className="text-gray-900">embalagem e montagem</strong> é uma solução completa que inclui a embalagem profissional de todos os seus pertences e a desmontagem/montagem de móveis durante o processo de mudança.
                </p>
                <p>
                  A embalagem profissional utiliza materiais adequados para proteger cada tipo de item: papel bolha para objetos frágeis, caixas resistentes para livros e documentos, plástico bolha para eletrodomésticos, e proteções especiais para móveis e quadros.
                </p>
                <p>
                  A montagem e desmontagem de móveis é realizada por profissionais experientes que conhecem as técnicas corretas para desmontar móveis sem danificar peças, organizar todas as partes e parafusos, e remontar tudo corretamente no destino.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Incluídos */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                O que Inclui o Serviço de Embalagem e Montagem?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Serviços completos para garantir proteção total dos seus pertences
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Embalagem de Objetos Frágeis</h3>
                <p className="text-gray-700 leading-relaxed">
                  Embalagem especializada de vidros, porcelanas, cristais e objetos de arte com materiais de proteção adequados.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                  <Box className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Embalagem de Eletrodomésticos</h3>
                <p className="text-gray-700 leading-relaxed">
                  Proteção adequada para geladeiras, fogões, máquinas de lavar e outros eletrodomésticos com plástico bolha e mantas.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                  <Wrench className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Desmontagem de Móveis</h3>
                <p className="text-gray-700 leading-relaxed">
                  Desmontagem cuidadosa de guarda-roupas, camas, mesas e outros móveis, organizando todas as peças e parafusos.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Settings className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Montagem de Móveis</h3>
                <p className="text-gray-700 leading-relaxed">
                  Remontagem completa de todos os móveis no destino, garantindo que tudo fique no lugar correto e funcionando.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                  <ToolCase className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Embalagem de Quadros e Espelhos</h3>
                <p className="text-gray-700 leading-relaxed">
                  Proteção especial para quadros, espelhos e objetos de parede com caixas específicas e materiais de amortecimento.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Organização e Identificação</h3>
                <p className="text-gray-700 leading-relaxed">
                  Todas as caixas são identificadas e organizadas por cômodo, facilitando a desembalagem no destino.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materiais Utilizados */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Materiais de Embalagem Utilizados
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Materiais de qualidade para garantir proteção total
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Box className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Caixas Resistentes</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Caixas de papelão de alta qualidade em diversos tamanhos para diferentes tipos de objetos.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-6 h-6 text-pink-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Papel Bolha</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Proteção com bolhas de ar para objetos frágeis, absorvendo impactos durante o transporte.
                </p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 border border-rose-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-rose-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Plástico Bolha</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Proteção adicional para eletrodomésticos e objetos de maior valor.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Box className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Mantas e Cobertores</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Mantas especiais para proteger móveis, sofás e objetos grandes contra arranhões e danos.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                <div className="flex items-center gap-3 mb-3">
                  <ToolCase className="w-6 h-6 text-pink-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Fitas Adesivas</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Fitas resistentes para vedar caixas e garantir que os objetos permaneçam protegidos.
                </p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 border border-rose-200">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-6 h-6 text-rose-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Caixas Especiais</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Caixas específicas para quadros, espelhos e objetos de formato especial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-600 to-rose-800 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Vantagens da Embalagem e Montagem Profissional
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Por que contratar um serviço profissional de embalagem e montagem
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Proteção Total</h3>
                <p className="text-white/80">
                  Seus pertences protegidos com materiais adequados e técnicas profissionais
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Economia de Tempo</h3>
                <p className="text-white/80">
                  Economize horas de trabalho com uma equipe experiente e eficiente
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sem Danos</h3>
                <p className="text-white/80">
                  Redução significativa de riscos de danos durante o transporte
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Profissionais Qualificados</h3>
                <p className="text-white/80">
                  Equipe treinada e experiente em embalagem e montagem de móveis
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
                Dicas para Embalagem e Montagem
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contrate Profissionais</h3>
                    <p className="text-gray-700">
                      A embalagem profissional garante proteção adequada e economiza tempo. Profissionais conhecem as melhores técnicas e materiais.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Identifique as Caixas</h3>
                    <p className="text-gray-700">
                      Certifique-se de que todas as caixas sejam identificadas por cômodo. Isso facilita muito a organização no destino.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Guarde Peças e Parafusos</h3>
                    <p className="text-gray-700">
                      Durante a desmontagem, peças e parafusos devem ser organizados em sacos identificados para facilitar a montagem.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Itens de Valor Separados</h3>
                    <p className="text-gray-700">
                      Itens de alto valor devem ser embalados separadamente e com proteção extra. Considere transportá-los pessoalmente.
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
        title="Calcule o preço da embalagem e montagem em segundos"
        subtitle="Descubra o valor real do serviço de embalagem e montagem em 60 segundos pelo WhatsApp"
        variant="compact"
      />
    </div>
  )
}

