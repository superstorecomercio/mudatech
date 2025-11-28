import { notFound } from 'next/navigation';
import { getCidadeBySlug, getHotsitesByCidadeSlug, getHotsitesCountByTipo } from '../../../../lib/db/queries';
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Star, Shield, Phone, MapPin, CheckCircle2, Truck, Building2, Package, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from 'next';

interface MudancasPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getValidImageUrl(url: string | null | undefined, fallback: string = '/placeholder-logo.svg'): string {
  if (!url || url.trim() === '') return fallback;
  try {
    new URL(url);
    return url;
  } catch {
    if (url.startsWith('/')) return url;
    return fallback;
  }
}

export async function generateMetadata({
  params,
}: MudancasPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCidadeBySlug(slug);
  
  if (!city) {
    return {
      title: 'Cidade não encontrada',
    };
  }

  return {
    title: `Mudanças em ${city.name} - ${city.state} | Empresas de Mudança | MudaTech`,
    description: `Encontre as melhores empresas de mudança em ${city.name}, ${city.state}. Compare preços, serviços e solicite orçamentos gratuitos. Empresas verificadas e confiáveis.`,
    keywords: `mudanças em ${city.name}, empresas de mudança ${city.name}, mudança ${city.name} ${city.state}, mudanças ${city.name}, mudança residencial ${city.name}, mudança comercial ${city.name}, mudança ${city.state}`,
    openGraph: {
      title: `Mudanças em ${city.name} - ${city.state} | MudaTech`,
      description: `Encontre as melhores empresas de mudança em ${city.name}, ${city.state}. Compare preços e solicite orçamentos gratuitos.`,
      type: 'website',
    },
  };
}

const MudancasPage = async ({ params }: MudancasPageProps) => {
  const { slug } = await params;
  const city = await getCidadeBySlug(slug);
  const hotsites = await getHotsitesByCidadeSlug(slug, 'Empresa de Mudança');
  const counts = await getHotsitesCountByTipo(slug);

  if (!city) {
    notFound();
  }

  const cityImages: Record<string, string> = {
    'sao-paulo-sp': '/s-o-paulo-skyline.jpg',
    'rio-de-janeiro-rj': '/rio-de-janeiro-christ.jpg',
    'belo-horizonte-mg': '/belo-horizonte-cityscape.jpg',
    'brasilia-df': '/brasilia-congress.jpg',
    'curitiba-pr': '/curitiba-architecture.jpg',
    'porto-alegre-rs': '/porto-alegre-downtown.jpg',
  };

  const cityImage = cityImages[slug] || '/s-o-paulo-skyline.jpg';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src={cityImage}
          alt={`${city.name}, ${city.state}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-xl font-semibold">{city.state}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Mudanças em {city.name}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-6">
                Encontre as melhores opções de mudança residencial e comercial em {city.name}, {city.state}. Compare preços e solicite orçamentos gratuitos.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">
                    {hotsites.length > 0 ? `${hotsites.length} empresa${hotsites.length > 1 ? 's' : ''} verificada${hotsites.length > 1 ? 's' : ''}` : 'Empresas verificadas'}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">Avaliações reais</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">100% confiável</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="bg-white border-b py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#667eea] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cidades" className="hover:text-[#667eea] transition-colors">Cidades</Link>
            <span>/</span>
            <Link href={`/cidades/${slug}`} className="hover:text-[#667eea] transition-colors">{city.name}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Mudanças</span>
          </div>
        </div>
      </section>

      {/* Service Type Links */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/cidades/${slug}/mudancas`}
              className="px-6 py-3 bg-[#667eea] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Mudanças ({counts.mudanca})
            </Link>
            <Link
              href={`/cidades/${slug}/carretos`}
              className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-[#667eea] hover:text-[#667eea] transition-all"
            >
              Carretos ({counts.carreto})
            </Link>
            <Link
              href={`/cidades/${slug}/guarda-moveis`}
              className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-200 hover:border-[#667eea] hover:text-[#667eea] transition-all"
            >
              Guarda-Móveis ({counts.guardamoveis})
            </Link>
          </div>
        </div>
      </section>

      {/* Lista de Empresas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Transportadoras e Empresas de Mudança em {city.name}
            </h2>
            <p className="text-gray-600">
              {hotsites.length > 0 
                ? `${hotsites.length} empresa${hotsites.length > 1 ? 's' : ''} verificada${hotsites.length > 1 ? 's' : ''} disponível${hotsites.length > 1 ? 'eis' : ''} em ${city.name}`
                : `Encontre as melhores opções de mudança residencial e comercial em ${city.name}`
              }
            </p>
          </div>

          {hotsites.length > 0 ? (
            <div className="space-y-6">
              {hotsites.map((hotsite) => (
                <Card
                  key={hotsite.id}
                  className="p-6 lg:p-8 bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Logo e Info Principal */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-[133px] h-[100px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <Image
                          src={getValidImageUrl(hotsite.logoUrl)}
                          alt={hotsite.nomeExibicao || 'Logo da empresa'}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                              {hotsite.nomeExibicao}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              {hotsite.plano && (
                                <Badge 
                                  variant={hotsite.plano.nome === 'Premium' ? 'default' : 'outline'}
                                  className={
                                    hotsite.plano.nome === 'Premium' 
                                      ? 'bg-[#667eea] text-white' 
                                      : 'border-[#667eea]/20'
                                  }
                                >
                                  {hotsite.plano.nome}
                                </Badge>
                              )}
                              {hotsite.verificado && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 border-0">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Verificada
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                              {hotsite.cidade && hotsite.estado && (
                                <span className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {hotsite.cidade}/{hotsite.estado}
                                </span>
                              )}
                              {hotsite.telefone1 && (
                                <span className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {hotsite.telefone1}
                                </span>
                              )}
                            </div>

                            {/* Descrição */}
                            {hotsite.descricao && (
                              <p className="text-gray-700 leading-relaxed line-clamp-2 mb-4">
                                {hotsite.descricao}
                              </p>
                            )}

                            {/* Serviços */}
                            {hotsite.servicos && hotsite.servicos.length > 0 && (
                              <div className="grid sm:grid-cols-2 gap-2">
                                {hotsite.servicos.slice(0, 4).map((servico, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span className="text-gray-700">{servico}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="lg:w-64 flex flex-col justify-between gap-4">
                      <div className="space-y-3">
                        <Link href={`/orcamento?empresa=${hotsite.nomeExibicao}&cidade=${slug}`}>
                          <Button size="lg" className="w-full rounded-xl font-semibold text-base bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#764ba2] hover:to-[#667eea]">
                            Solicitar Orçamento
                          </Button>
                        </Link>
                        {hotsite.telefone1 && (
                          <a href={`tel:${hotsite.telefone1.replace(/\D/g, '')}`}>
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="w-full rounded-xl font-semibold border-2"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Ligar Agora
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Truck className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Nenhuma empresa de mudança encontrada em {city.name}
                </h3>
                <p className="text-gray-600">
                  Ainda não temos empresas de mudança cadastradas nesta cidade, mas você pode solicitar orçamentos gerais.
                </p>
                <Link href={`/orcamento?cidade=${slug}&tipo=mudanca`}>
                  <Button size="lg" className="rounded-xl font-semibold px-8 bg-gradient-to-r from-[#667eea] to-[#764ba2]">
                    Solicitar Orçamento de Mudança
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* CTA Final */}
          {hotsites.length > 0 && (
            <div className="mt-16 text-center p-12 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl shadow-2xl text-white">
              <h3 className="text-3xl font-bold mb-4">
                Precisa de mais opções de mudança em {city.name}?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Preencha nosso formulário e receba até 4 orçamentos personalizados de empresas verificadas
              </p>
              <Link href={`/orcamento?cidade=${slug}&tipo=mudanca`}>
                <Button size="lg" className="rounded-xl font-semibold px-8 text-base bg-white text-[#667eea] hover:bg-gray-100">
                  Solicitar Orçamentos Grátis
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content Section - Cards Bonitos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mudança Residencial e Comercial em {city.name}, {city.state}
              </h2>
              <div className="text-gray-700 space-y-3 leading-relaxed">
                <p>
                  Procurando <strong className="text-gray-900">mudança residencial em {city.name}</strong> ou <strong className="text-gray-900">mudança comercial em {city.name}</strong>? O MudaTech conecta você às melhores transportadoras e empresas especializadas em {city.name}, {city.state}, facilitando o processo de encontrar e comparar serviços de mudança na sua região.
                </p>
                <p>
                  Nossa plataforma reúne empresas verificadas e confiáveis em {city.name}, oferecendo uma forma rápida e segura de encontrar a empresa ideal para sua mudança, seja ela residencial, comercial ou interestadual.
                </p>
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tipos de Mudanças em {city.name}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mudança Residencial</h4>
                    <p className="text-sm text-gray-700">Especializada em mudanças de casas e apartamentos em {city.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mudança Comercial</h4>
                    <p className="text-sm text-gray-700">Focada em mudanças de escritórios, lojas e estabelecimentos comerciais</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mudança Interestadual</h4>
                    <p className="text-sm text-gray-700">Experientes em mudanças de longa distância partindo de {city.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mudança com Embalagem</h4>
                    <p className="text-sm text-gray-700">Oferecem serviço completo incluindo embalagem e montagem</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MudancasPage;
