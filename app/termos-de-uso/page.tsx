import { Metadata } from "next"
import { FileText, Shield, CheckCircle2, AlertTriangle, Clock, Mail } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Termos de Uso | MudaTech",
  description: "Termos de uso e condições do MudaTech. Leia nossos termos e condições de uso da plataforma.",
}

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Termos de Uso
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Conheça os termos e condições de uso da plataforma MudaTech
            </p>
            <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">
                Última atualização: {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
            <div className="prose prose-lg max-w-none space-y-12 text-gray-700">
              
              <section className="border-l-4 border-blue-600 pl-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">1. Aceitação dos Termos</h2>
                </div>
                <p className="text-lg leading-relaxed">
                  Ao acessar e usar o site MudaTech, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. 
                  Se você não concorda com alguma parte destes termos, não deve usar nosso serviço.
                </p>
              </section>

              <section className="border-l-4 border-indigo-600 pl-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">2. Descrição do Serviço</h2>
                </div>
                <p className="text-lg leading-relaxed">
                  O MudaTech é uma plataforma que conecta clientes que precisam de serviços de mudança com empresas de transporte e mudanças. 
                  Fornecemos uma ferramenta de cálculo de orçamento estimado e facilitamos o contato entre clientes e empresas parceiras.
                </p>
              </section>

              <section className="border-l-4 border-purple-600 pl-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">3. Uso do Serviço</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">Você concorda em usar o serviço apenas para fins legais e de acordo com estes termos. Você não deve:</p>
                <ul className="list-disc pl-6 space-y-3 text-lg">
                  <li>Usar o serviço de forma fraudulenta ou enganosa</li>
                  <li>Fornecer informações falsas ou enganosas</li>
                  <li>Interferir ou interromper o funcionamento do serviço</li>
                  <li>Tentar acessar áreas restritas do sistema</li>
                  <li>Usar o serviço para qualquer propósito ilegal</li>
                </ul>
              </section>

              <section className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">4. Orçamentos e Estimativas</h2>
                <p className="text-lg leading-relaxed">
                  Os valores estimados fornecidos pela plataforma são apenas estimativas baseadas nas informações fornecidas. 
                  Os preços finais podem variar e devem ser confirmados diretamente com as empresas de mudança. 
                  O MudaTech não se responsabiliza por diferenças entre valores estimados e valores finais cobrados pelas empresas.
                </p>
              </section>

              <section className="border-l-4 border-indigo-600 pl-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">5. Empresas Parceiras</h2>
                <p className="text-lg leading-relaxed">
                  O MudaTech atua como intermediário entre clientes e empresas de mudança. Não somos responsáveis pelos serviços prestados 
                  pelas empresas parceiras. Recomendamos que você verifique as credenciais, licenças e avaliações das empresas antes de 
                  contratar seus serviços.
                </p>
              </section>

              <section className="border-l-4 border-purple-600 pl-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">6. Privacidade e Dados</h2>
                <p className="text-lg leading-relaxed">
                  Seus dados pessoais são tratados de acordo com nossa <Link href="/privacidade" className="text-[#667eea] hover:underline font-semibold">Política de Privacidade</Link>. Ao usar o serviço, você consente com a 
                  coleta, uso e compartilhamento de suas informações conforme descrito na política de privacidade.
                </p>
              </section>

              <section className="border-l-4 border-blue-600 pl-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">7. Limitação de Responsabilidade</h2>
                <p className="text-lg leading-relaxed">
                  O MudaTech não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou 
                  impossibilidade de uso do serviço. Não garantimos que o serviço estará sempre disponível, seguro ou livre de erros.
                </p>
              </section>

              <section className="border-l-4 border-indigo-600 pl-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">8. Modificações dos Termos</h2>
                <p className="text-lg leading-relaxed">
                  Reservamos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após 
                  a publicação. É sua responsabilidade revisar periodicamente estes termos.
                </p>
              </section>

              <section className="border-l-4 border-purple-600 pl-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">9. Contato</h2>
                </div>
                <p className="text-lg leading-relaxed">
                  Se você tiver dúvidas sobre estes termos, entre em contato conosco através do email:{" "}
                  <a href="mailto:contato@mudatech.com.br" className="text-[#667eea] hover:underline font-semibold">
                    contato@mudatech.com.br
                  </a>
                </p>
              </section>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Link
              href="/privacidade"
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Política de Privacidade</h3>
                  <p className="text-sm text-gray-600">Saiba como protegemos seus dados</p>
                </div>
              </div>
            </Link>

            <Link
              href="/contato"
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Fale Conosco</h3>
                  <p className="text-sm text-gray-600">Entre em contato com nossa equipe</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
