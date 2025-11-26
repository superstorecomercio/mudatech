"use client"

import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { Star, Check, Shield, Zap, Building2, Package, MessageCircle, TrendingUp, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const WHATSAPP_URL = "https://wa.me/5515551842523?text=Oi,%20quero%20fazer%20um%20or%C3%A7amento%20de%20mudan%C3%A7a!"

// Função para gerar um número dinâmico que muda a cada hora
const getPessoasSolicitaram = () => {
  const base = 113
  const now = new Date()
  const hour = now.getHours() // 0-23
  const day = now.getDate() // 1-31

  // Variação baseada na hora e no dia para parecer "aleatório" mas ser consistente por hora
  const variation = Math.floor((hour * 13 + day * 7) % 100) // Garante variação entre 0-99
  return base + variation
}

const testimonials = [
  {
    name: "Maria Silva",
    route: "São Paulo → Rio de Janeiro",
    text: "Não acreditei quando recebi 5 orçamentos em menos de 5 minutos! Consegui negociar e economizei quase R$ 1.000 comparando os preços. O processo todo pelo WhatsApp foi super prático.",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "João Costa",
    route: "Curitiba → Florianópolis",
    text: "O valor estimado foi muito próximo do que realmente paguei. A empresa que escolhi foi super profissional e o orçamento que recebi aqui ajudou muito na negociação.",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    name: "Ana Paula",
    route: "Brasília → Goiânia",
    text: "Adorei a praticidade! Não precisei ficar ligando para várias empresas. Recebi os contatos direto no WhatsApp e já consegui fechar o negócio no mesmo dia.",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    name: "Carlos Mendes",
    route: "Belo Horizonte → Vitória",
    text: "Estava com medo de ser golpe, mas todas as empresas que me contataram eram sérias e verificadas. O preço ficou dentro do que eu esperava e o serviço foi excelente!",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Juliana Santos",
    route: "Porto Alegre → Caxias do Sul",
    text: "Mudança de última hora e consegui resolver tudo rapidinho! A Julia (a assistente) foi super atenciosa e me ajudou a entender todos os detalhes. Recomendo demais!",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Roberto Alves",
    route: "Salvador → Aracaju",
    text: "Comparar preços nunca foi tão fácil. Recebi 4 propostas diferentes e consegui escolher a melhor relação custo-benefício. O processo todo levou menos de 10 minutos!",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "Fernanda Lima",
    route: "Recife → Maceió",
    text: "Primeira vez que uso um serviço assim e fiquei impressionada! Recebi 6 empresas diferentes, todas com preços competitivos. Escolhi uma que tinha ótimas avaliações.",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Pedro Henrique",
    route: "Fortaleza → Natal",
    text: "O cálculo foi super preciso! A diferença entre o valor estimado e o real foi de apenas R$ 150. As empresas que me contataram foram todas muito profissionais.",
    avatar: "https://i.pravatar.cc/150?img=51",
  },
  {
    name: "Larissa Oliveira",
    route: "Manaus → Belém",
    text: "Mudança interestadual sempre é complicada, mas aqui foi super simples. Recebi várias opções e consegui negociar um preço melhor. Recomendo para quem precisa de mudança!",
    avatar: "https://i.pravatar.cc/150?img=28",
  },
  {
    name: "Rafael Souza",
    route: "Campinas → Ribeirão Preto",
    text: "Economizei tempo e dinheiro! Não precisei pesquisar empresas manualmente. Em poucos minutos já tinha várias propostas para comparar. Valeu muito a pena!",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Patricia Rocha",
    route: "Florianópolis → Joinville",
    text: "Adorei a experiência! A assistente virtual foi super educada e me ajudou em tudo. Recebi orçamentos de empresas confiáveis e fechei com a melhor proposta.",
    avatar: "https://i.pravatar.cc/150?img=36",
  },
  {
    name: "Marcos Ferreira",
    route: "Vitória → Vila Velha",
    text: "Mudança comercial e consegui resolver tudo pelo WhatsApp mesmo. As empresas entenderam minhas necessidades e me deram propostas personalizadas. Excelente serviço!",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    name: "Camila Rodrigues",
    route: "São Luís → Teresina",
    text: "Super prático e rápido! Em menos de 3 minutos já tinha recebido os primeiros orçamentos. Consegui fechar no mesmo dia e a mudança foi perfeita.",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
  {
    name: "Thiago Martins",
    route: "João Pessoa → Campina Grande",
    text: "Não esperava que fosse tão fácil! Recebi 5 empresas diferentes, todas verificadas. O preço ficou bem abaixo do que eu imaginava. Super recomendo!",
    avatar: "https://i.pravatar.cc/150?img=19",
  },
  {
    name: "Beatriz Almeida",
    route: "Aracaju → Maceió",
    text: "Primeira experiência com mudança e foi perfeita! A plataforma me guiou em tudo e recebi empresas sérias. O processo todo foi muito tranquilo e organizado.",
    avatar: "https://i.pravatar.cc/150?img=52",
  },
  {
    name: "Lucas Barbosa",
    route: "Natal → João Pessoa",
    text: "Comparação de preços em tempo real foi o diferencial! Consegui ver todas as propostas lado a lado e escolher a melhor. Economizei quase R$ 600!",
    avatar: "https://i.pravatar.cc/150?img=24",
  },
  {
    name: "Isabela Costa",
    route: "Goiânia → Uberlândia",
    text: "Mudança de última hora e consegui resolver rapidinho! Recebi várias opções e fechei com uma empresa que tinha disponibilidade imediata. Salvaram minha vida!",
    avatar: "https://i.pravatar.cc/150?img=41",
  },
  {
    name: "Gabriel Nunes",
    route: "Cuiabá → Campo Grande",
    text: "Serviço excelente! O cálculo foi preciso e as empresas que me contataram foram todas muito profissionais. A mudança aconteceu sem nenhum problema.",
    avatar: "https://i.pravatar.cc/150?img=16",
  },
]

function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex * itemsPerPage) + itemsPerPage
  )

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200"
          aria-label="Depoimento anterior"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200"
          aria-label="Próximo depoimento"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 px-8 md:px-0">
          {currentTestimonials.map((testimonial, i) => (
            <Card key={`${currentIndex}-${i}`} className="p-6 bg-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic leading-relaxed">&quot;{testimonial.text}&quot;</p>
              <div className="border-t pt-4 flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.route}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-[#FF6B35] w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [pessoasSolicitaram, setPessoasSolicitaram] = useState(getPessoasSolicitaram())

  // Atualizar a cada minuto (para garantir que mude na hora certa)
  useEffect(() => {
    const interval = setInterval(() => {
      setPessoasSolicitaram(getPessoasSolicitaram())
    }, 60000) // 60 segundos

    return () => clearInterval(interval)
  }, [])
  const cidadesPopulares = [
    {
      nome: "São Paulo",
      slug: "sao-paulo-sp",
      estado: "SP",
      descricao: "Empresas verificadas em SP",
      servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
      imagem: "/s-o-paulo-skyline.jpg"
    },
    {
      nome: "Rio de Janeiro",
      slug: "rio-de-janeiro-rj",
      estado: "RJ",
      descricao: "Empresas verificadas no Rio",
      servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
      imagem: "/rio-de-janeiro-christ.jpg"
    },
    {
      nome: "Curitiba",
      slug: "curitiba-pr",
      estado: "PR",
      descricao: "Empresas verificadas em Curitiba",
      servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
      imagem: "/curitiba-architecture.jpg"
    },
    {
      nome: "Porto Alegre",
      slug: "porto-alegre-rs",
      estado: "RS",
      descricao: "Empresas verificadas em Porto Alegre",
      servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
      imagem: "/porto-alegre-downtown.jpg"
    },
    {
      nome: "Brasília",
      slug: "brasilia-df",
      estado: "DF",
      descricao: "Empresas verificadas no DF",
      servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
      imagem: "/brasilia-congress.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-20 pt-4 md:pt-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge: Comparar e Receber Cotações */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Compare preços e receba cotações de empresas verificadas</span>
          </div>

          {/* Rating */}
          <div className="inline-flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-full shadow-sm mb-8 animate-fade-in-up animation-delay-100">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FF6B35] text-[#FF6B35]" />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">4.9/5 - Mais de 10.000 orçamentos realizados</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up animation-delay-200 text-balance">
            Calcule o preço da sua mudança <span className="text-[#FF6B35]">em segundos</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 animate-fade-in-up animation-delay-300 text-balance">
            Descubra o valor real da sua mudança em 60 segundos pelo WhatsApp
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 text-gray-600 animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Check className="w-5 h-5 text-[#FF6B35]" />
              <span>Grátis</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Check className="w-5 h-5 text-[#FF6B35]" />
              <span>Rápido</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Check className="w-5 h-5 text-[#FF6B35]" />
              <span>Sem Cadastro</span>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block animate-fade-in-up animation-delay-500"
          >
            <Button
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg md:text-xl px-12 py-7 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold"
            >
              💬 Calcular no WhatsApp Grátis
            </Button>
          </a>

          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FF6B35]/10 text-[#FF6B35] px-6 py-3 rounded-full font-semibold mt-6 animate-fade-in-up animation-delay-600">
            🔥 {pessoasSolicitaram} pessoas solicitaram orçamento hoje
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            {[
              { icon: "📱", title: "Clique no Botão", desc: "Em 2 segundos você já está conversando" },
              {
                icon: "💬",
                title: "Fale com Julia",
                desc: "Nossa IA faz 10 perguntas rápidas sobre sua mudança",
              },
              {
                icon: "💰",
                title: "Receba Orçamento",
                desc: "Preço real + contato de empresas verificadas",
              },
            ].map((step, i) => (
              <Card
                key={i}
                className="p-4 md:p-8 text-center bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl md:text-6xl mb-3 md:mb-4">{step.icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Por Que Escolher o MudaTech?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: TrendingUp,
              title: "Inteligência Artificial",
              desc: "IA calcula distância real e complexidade da mudança",
            },
            {
              icon: MessageCircle,
              title: "Preço Realista",
              desc: "Baseado em centenas de mudanças reais já realizadas",
            },
            { icon: Building2, title: "Empresas Verificadas", desc: "Até 10 transportadoras confiáveis e avaliadas" },
            { icon: Package, title: "Completo", desc: "Inclui embalagem, elevador e lista de objetos" },
            { icon: Zap, title: "Super Rápido", desc: "Resposta instantânea via WhatsApp" },
            { icon: Shield, title: "Seguro", desc: "Seus dados protegidos e empresas verificadas" },
          ].map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <Card
                key={i}
                className="p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <Icon className="w-12 h-12 text-[#FF6B35] mb-4" />
                <h3 className="text-lg font-bold mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            O Que Nossos Clientes Dizem
          </h2>
          
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Seção de Cidades Populares */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Buscas Populares</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Encontre Empresas nas Principais Cidades
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acesse diretamente as empresas mais procuradas em cada cidade
            </p>
          </div>

          {/* Grid de Cidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-10">
            {cidadesPopulares.map((cidade) => (
              <Link
                key={cidade.slug}
                href={`/cidades/${cidade.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-200 cursor-pointer active:scale-[0.98]"
              >
                {/* Imagem de Fundo */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${cidade.imagem})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Nome da Cidade */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-white" />
                      <span className="text-sm font-medium text-white/90">{cidade.estado}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {cidade.nome}
                    </h3>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {cidade.descricao}
                  </p>
                  
                  {/* Serviços */}
                  <div className="flex flex-wrap gap-2">
                    {cidade.servicos.map((servico) => (
                      <span
                        key={servico}
                        className="text-xs px-3 py-1 bg-accent/10 text-accent font-medium rounded-full"
                      >
                        {servico}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  <div className="pt-2">
                    <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors inline-flex items-center gap-1">
                      Ver empresas
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Link para todas as cidades */}
          <div className="text-center mt-8 md:mt-10">
            <Link
              href="/cidades"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <MapPin className="w-5 h-5" />
              Ver todas as cidades
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
              Pronto Para Saber o Valor da Sua Mudança?
            </h2>

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-block mb-6">
              <Button
                size="lg"
                className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg md:text-xl px-12 py-7 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold"
              >
                💬 Começar Agora no WhatsApp
              </Button>
            </a>

            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/10 text-[#FF6B35] px-6 py-3 rounded-full font-semibold">
              ⏰ Atenção: Vagas limitadas para orçamentos hoje!
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

