'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, TrendingUp, Search, Building2 } from 'lucide-react'
import { getCidades } from '@/lib/db/queries/cidades'

interface Cidade {
  id: string
  name: string
  slug: string
  state: string
  description?: string
  empresaCount?: number
}

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
  },
  {
    nome: "Belo Horizonte",
    slug: "belo-horizonte-mg",
    estado: "MG",
    descricao: "Empresas verificadas em BH",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "/belo-horizonte-cityscape.jpg"
  },
  {
    nome: "Salvador",
    slug: "salvador-ba",
    estado: "BA",
    descricao: "Empresas verificadas em Salvador",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    nome: "Fortaleza",
    slug: "fortaleza-ce",
    estado: "CE",
    descricao: "Empresas verificadas em Fortaleza",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    nome: "Recife",
    slug: "recife-pe",
    estado: "PE",
    descricao: "Empresas verificadas em Recife",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    nome: "Manaus",
    slug: "manaus-am",
    estado: "AM",
    descricao: "Empresas verificadas em Manaus",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    nome: "Goiânia",
    slug: "goiania-go",
    estado: "GO",
    descricao: "Empresas verificadas em Goiânia",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    nome: "Campinas",
    slug: "campinas-sp",
    estado: "SP",
    descricao: "Empresas verificadas em Campinas",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    nome: "Florianópolis",
    slug: "florianopolis-sc",
    estado: "SC",
    descricao: "Empresas verificadas em Florianópolis",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    nome: "Vitória",
    slug: "vitoria-es",
    estado: "ES",
    descricao: "Empresas verificadas em Vitória",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    nome: "Natal",
    slug: "natal-rn",
    estado: "RN",
    descricao: "Empresas verificadas em Natal",
    servicos: ["Mudanças", "Carretos", "Guarda-móveis"],
    imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
]

export default function CitiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCidades() {
      try {
        setLoading(true)
        const cidadesData = await getCidades()
        setCidades(cidadesData)
      } catch (error) {
        console.error('Erro ao buscar cidades:', error)
        // Fallback para cidades populares se houver erro
        setCidades(cidadesPopulares.map(c => ({
          id: c.slug,
          name: c.nome,
          slug: c.slug,
          state: c.estado,
          description: c.descricao,
          empresaCount: 0
        })))
      } finally {
        setLoading(false)
      }
    }
    fetchCidades()
  }, [])

  // Combinar cidades do banco com dados visuais das cidades populares
  const cidadesCompletas = cidades.map(cidade => {
    const popular = cidadesPopulares.find(c => c.slug === cidade.slug)
    return {
      ...cidade,
      imagem: popular?.imagem || '/s-o-paulo-skyline.jpg',
      servicos: popular?.servicos || ["Mudanças", "Carretos", "Guarda-móveis"],
      descricao: cidade.description || popular?.descricao || `Empresas verificadas em ${cidade.name}`
    }
  })

  const filteredCidades = cidadesCompletas.filter(cidade => {
    const search = searchTerm.toLowerCase()
    return (
      cidade.name.toLowerCase().includes(search) ||
      cidade.state.toLowerCase().includes(search) ||
      cidade.descricao?.toLowerCase().includes(search)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MapPin className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Cidades Atendidas
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Encontre empresas de mudança verificadas em todas as principais cidades do Brasil
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cidade ou estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cidades Section */}
      <section className="py-16 lg:py-24 px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#667eea]/10 rounded-full mb-4">
              <TrendingUp className="w-5 h-5 text-[#667eea]" />
              <span className="text-sm font-bold text-[#667eea]">
                {filteredCidades.length} {filteredCidades.length === 1 ? 'cidade encontrada' : 'cidades encontradas'}
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900">
              Encontre Empresas nas Principais Cidades
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Acesse diretamente as empresas mais procuradas em cada cidade
            </p>
          </div>

          {/* Grid de Cidades */}
          {filteredCidades.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">Nenhuma cidade encontrada com "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-[#667eea] hover:underline font-semibold"
              >
                Limpar busca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
              {filteredCidades.map((cidade) => (
                <Link
                  key={cidade.slug}
                  href={`/cidades/${cidade.slug}`}
                  className="group relative overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-3 bg-white border-l-4 border-[#667eea] border-0 cursor-pointer"
                >
                  {/* Imagem de Fundo */}
                  <div className="relative h-48 overflow-hidden">
                    {cidade.imagem.startsWith('http') ? (
                      <img
                        src={cidade.imagem}
                        alt={`${cidade.name}, ${cidade.state}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80';
                        }}
                      />
                    ) : (
                      <Image
                        src={cidade.imagem}
                        alt={`${cidade.name}, ${cidade.state}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Nome da Cidade */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-white" />
                        <span className="text-sm font-medium text-white/90">{cidade.state}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {cidade.name}
                      </h3>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {cidade.descricao}
                    </p>
                    
                    {cidade.empresaCount !== undefined && cidade.empresaCount > 0 && (
                      <p className="text-xs font-semibold text-[#667eea]">
                        {cidade.empresaCount} {cidade.empresaCount === 1 ? 'empresa disponível' : 'empresas disponíveis'}
                      </p>
                    )}
                    
                    {/* Serviços */}
                    <div className="flex flex-wrap gap-2">
                      {cidade.servicos?.map((servico) => (
                        <span
                          key={servico}
                          className="text-xs px-3 py-1 bg-[#667eea]/10 text-[#667eea] font-medium rounded-full"
                        >
                          {servico}
                        </span>
                      ))}
                    </div>

                    {/* Link */}
                    <div className="pt-2">
                      <span className="text-sm font-semibold text-[#667eea] group-hover:text-[#764ba2] transition-colors inline-flex items-center gap-1">
                        Ver empresas
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
