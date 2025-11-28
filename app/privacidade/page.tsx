import { Metadata } from "next"
import { Shield, Lock, Eye, Database, CheckCircle2, FileText, Mail, AlertCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidade | MudaTech",
  description: "Política de privacidade e proteção de dados do MudaTech. Conheça como protegemos seus dados pessoais.",
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Política de Privacidade
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Seus dados estão seguros conosco. Conheça como protegemos sua privacidade
            </p>
            <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FileText className="w-5 h-5" />
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
              
              <section className="border-l-4 border-indigo-600 pl-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">1. Introdução</h2>
                </div>
                <p className="text-lg leading-relaxed">
                  O MudaTech está comprometido em proteger sua privacidade. Esta Política de Privacidade descreve como coletamos, 
                  usamos, armazenamos e protegemos suas informações pessoais quando você usa nosso serviço.
                </p>
              </section>

              <section className="border-l-4 border-purple-600 pl-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">2. Informações que Coletamos</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">Coletamos as seguintes informações quando você usa nosso serviço:</p>
                <ul className="list-disc pl-6 space-y-3 text-lg">
                  <li><strong>Informações de contato:</strong> nome, email, telefone e WhatsApp</li>
                  <li><strong>Informações da mudança:</strong> origem, destino, tipo de imóvel, data estimada</li>
                  <li><strong>Informações técnicas:</strong> endereço IP, tipo de navegador, páginas visitadas</li>
                  <li><strong>Informações de uso:</strong> como você interage com nosso serviço</li>
                </ul>
              </section>

              <section className="border-l-4 border-pink-600 pl-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-pink-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">3. Como Usamos suas Informações</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">Utilizamos suas informações para:</p>
                <ul className="list-disc pl-6 space-y-3 text-lg">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Conectar você com empresas de mudança parceiras</li>
                  <li>Calcular estimativas de preço para sua mudança</li>
                  <li>Enviar comunicações relacionadas ao serviço</li>
                  <li>Analisar e melhorar a experiência do usuário</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section className="border-l-4 border-indigo-600 pl-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">4. Compartilhamento de Informações</h2>
                <p className="text-lg leading-relaxed mb-4">
                  Compartilhamos suas informações apenas nas seguintes situações:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-lg">
                  <li><strong>Empresas parceiras:</strong> Compartilhamos seus dados de contato e informações da mudança com empresas 
                  de mudança para que possam entrar em contato e fornecer orçamentos</li>
                  <li><strong>Prestadores de serviço:</strong> Podemos compartilhar informações com provedores de serviços que nos 
                  ajudam a operar a plataforma</li>
                  <li><strong>Obrigações legais:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
                </ul>
              </section>

              <section className="border-l-4 border-purple-600 pl-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">5. Segurança dos Dados</h2>
                </div>
                <p className="text-lg leading-relaxed">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, 
                  alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet é 100% seguro.
                </p>
              </section>

              <section className="border-l-4 border-pink-600 pl-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">6. Seus Direitos (LGPD)</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                <ul className="list-disc pl-6 space-y-3 text-lg">
                  <li>Confirmar a existência de tratamento de dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar anonimização, bloqueio ou eliminação de dados</li>
                  <li>Solicitar portabilidade dos dados</li>
                  <li>Revogar seu consentimento</li>
                </ul>
              </section>

              <section className="border-l-4 border-indigo-600 pl-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">7. Cookies e Tecnologias Similares</h2>
                <p className="text-lg leading-relaxed">
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site e personalizar conteúdo. 
                  Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades do site.
                </p>
              </section>

              <section className="border-l-4 border-purple-600 pl-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">8. Retenção de Dados</h2>
                <p className="text-lg leading-relaxed">
                  Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, 
                  a menos que um período de retenção mais longo seja exigido ou permitido por lei.
                </p>
              </section>

              <section className="border-l-4 border-pink-600 pl-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">9. Alterações nesta Política</h2>
                <p className="text-lg leading-relaxed">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas 
                  publicando a nova política nesta página e atualizando a data de "Última atualização".
                </p>
              </section>

              <section className="border-l-4 border-indigo-600 pl-6 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 m-0">10. Contato</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">
                  Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais, entre em contato conosco:
                </p>
                <p className="text-lg leading-relaxed">
                  <strong>Email:</strong>{" "}
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
              href="/termos-de-uso"
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Termos de Uso</h3>
                  <p className="text-sm text-gray-600">Leia nossos termos e condições</p>
                </div>
              </div>
            </Link>

            <Link
              href="/contato"
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Mail className="w-6 h-6 text-purple-600" />
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
