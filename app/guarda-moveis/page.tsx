'use client'

import Link from 'next/link'
import { 
  Warehouse, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Package, 
  Lock,
  MapPin,
  ArrowRight,
  Star,
  Key,
  Calendar
} from 'lucide-react'
import { WhatsAppCTASection } from '@/app/components/WhatsAppCTASection'

export default function GuardaMoveisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Warehouse className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Guarda-Móveis
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Armazenamento seguro e confiável para seus móveis e pertences. Solução ideal para reformas, mudanças temporárias ou falta de espaço.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/calcularmudanca"
                className="px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
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

      {/* O que é Guarda-Móveis */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                O que é Guarda-Móveis?
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  O <strong className="text-gray-900">guarda-móveis</strong> é um serviço de armazenamento temporário ou permanente de móveis, eletrodomésticos, objetos pessoais e outros pertences em unidades de armazenamento seguras e climatizadas.
                </p>
                <p>
                  Este serviço é ideal para diversas situações: durante reformas, mudanças temporárias, quando há falta de espaço em casa, para armazenar móveis de herança, ou enquanto aguarda a conclusão de uma nova residência.
                </p>
                <p>
                  As empresas de guarda-móveis oferecem unidades de armazenamento com segurança 24 horas, controle de temperatura e umidade, e acesso facilitado quando você precisar retirar seus pertences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quando usar */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Quando Usar Guarda-Móveis?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Situações ideais para contratar um serviço de guarda-móveis
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Durante Reformas</h3>
                <p className="text-gray-700 leading-relaxed">
                  Proteja seus móveis durante obras e reformas, mantendo-os seguros e livres de poeira e danos.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mudanças Temporárias</h3>
                <p className="text-gray-700 leading-relaxed">
                  Armazene seus pertences enquanto aguarda a conclusão de uma nova residência ou durante uma mudança temporária.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Package className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Falta de Espaço</h3>
                <p className="text-gray-700 leading-relaxed">
                  Libere espaço em casa armazenando móveis e objetos que não são usados com frequência.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                  <Key className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Móveis de Herança</h3>
                <p className="text-gray-700 leading-relaxed">
                  Guarde móveis e objetos herdados com segurança até decidir o que fazer com eles.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Armazenamento de Longo Prazo</h3>
                <p className="text-gray-700 leading-relaxed">
                  Solução para armazenar pertences por períodos prolongados com segurança e economia.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Warehouse className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Estoque Comercial</h3>
                <p className="text-gray-700 leading-relaxed">
                  Empresas podem usar guarda-móveis para armazenar estoque, documentos e equipamentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Características de um Bom Guarda-Móveis
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                O que procurar ao contratar um serviço de guarda-móveis
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Segurança 24h</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Vigilância constante, câmeras de segurança, alarmes e controle de acesso para máxima proteção.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Climatização</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Controle de temperatura e umidade para preservar móveis, documentos e objetos sensíveis.
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <Key className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Acesso Facilitado</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Horários flexíveis de acesso para retirar ou adicionar itens conforme sua necessidade.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Tamanhos Variados</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Unidades de diferentes tamanhos para atender desde pequenos volumes até mudanças completas.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Seguro de Carga</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Seguro para proteger seus pertences contra danos, roubos e imprevistos durante o armazenamento.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Organização</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Sistema de organização que permite localizar rapidamente seus itens quando necessário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-600 to-orange-800 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Vantagens do Guarda-Móveis
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Por que escolher um serviço profissional de guarda-móveis
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Segurança Total</h3>
                <p className="text-white/80">
                  Seus pertences protegidos com segurança 24 horas e sistemas avançados de monitoramento
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Preservação</h3>
                <p className="text-white/80">
                  Ambiente climatizado que preserva móveis, documentos e objetos sensíveis
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Key className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Flexibilidade</h3>
                <p className="text-white/80">
                  Acesso quando precisar e contratos flexíveis adaptados às suas necessidades
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Economia</h3>
                <p className="text-white/80">
                  Solução mais econômica que alugar um espaço maior apenas para armazenamento
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
                Dicas para Usar Guarda-Móveis
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Organize Antes de Guardar</h3>
                    <p className="text-gray-700">
                      Faça um inventário dos itens e organize-os por categoria. Isso facilita a localização quando precisar retirar algo.
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Escolha o Tamanho Adequado</h3>
                    <p className="text-gray-700">
                      Avalie o volume de itens que precisa guardar e escolha uma unidade que atenda suas necessidades sem desperdiçar espaço.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifique o Seguro</h3>
                    <p className="text-gray-700">
                      Certifique-se de que o guarda-móveis oferece seguro adequado para seus pertences e verifique a cobertura.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Embalagem Adequada</h3>
                    <p className="text-gray-700">
                      Use embalagens adequadas e proteja itens frágeis. Mesmo em ambiente climatizado, a embalagem correta é importante.
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
        title="Calcule o preço do guarda-móveis em segundos"
        subtitle="Descubra o valor real do armazenamento em 60 segundos pelo WhatsApp"
        variant="compact"
      />
    </div>
  )
}

