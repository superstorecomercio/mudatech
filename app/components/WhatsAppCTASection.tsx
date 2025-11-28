'use client'

import { useState, useEffect } from 'react'
import { Star, Check } from 'lucide-react'

const WHATSAPP_URL = "https://wa.me/15551842523?text=Ol%C3%A1"

// Função para gerar um número dinâmico que muda a cada hora
const getPessoasSolicitaram = () => {
  const base = 113
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDate()
  const variation = Math.floor((hour * 13 + day * 7) % 100)
  return base + variation
}

interface WhatsAppCTASectionProps {
  title?: string
  subtitle?: string
  variant?: 'default' | 'compact'
}

export function WhatsAppCTASection({ 
  title = "Calcule o preço da sua mudança em segundos",
  subtitle = "Descubra o valor real da sua mudança em 60 segundos pelo WhatsApp",
  variant = 'default'
}: WhatsAppCTASectionProps) {
  const [pessoasSolicitaram, setPessoasSolicitaram] = useState(getPessoasSolicitaram())

  useEffect(() => {
    const interval = setInterval(() => {
      setPessoasSolicitaram(getPessoasSolicitaram())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          {/* Rating */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700] drop-shadow-[0_2px_4px_rgba(255,215,0,0.5)] stroke-black stroke-[1]" />
              ))}
            </div>
            <span className="text-sm font-bold">4.9/5 - Mais de 10.000 orçamentos</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            {title}
          </h2>

          <p className="text-lg md:text-xl text-white/95 mb-6 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            {subtitle}
          </p>

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
    )
  }

  return (
    <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 py-16 lg:py-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Rating */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg mb-6 md:mb-10">
            <div className="flex gap-0.5 md:gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#FFD700] text-[#FFD700] drop-shadow-[0_2px_4px_rgba(255,215,0,0.5)] stroke-black stroke-[1]" />
              ))}
            </div>
            <span className="text-sm md:text-sm font-bold">4.9/5 - Mais de 10.000 orçamentos realizados</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] leading-tight">
            {title}
          </h2>

          <p className="text-lg md:text-2xl text-white/95 mb-8 md:mb-12 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            {subtitle}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-6 md:mb-12 text-white">
            <div className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base font-semibold">
              <Check className="w-5 h-5 md:w-5 md:h-5 text-[#FFD700]" />
              <span>Grátis</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base font-semibold">
              <Check className="w-5 h-5 md:w-5 md:h-5 text-[#FFD700]" />
              <span>Rápido</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base font-semibold">
              <Check className="w-5 h-5 md:w-5 md:h-5 text-[#FFD700]" />
              <span>Sem Cadastro</span>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-4 md:mb-0"
          >
            <button
              className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-lg md:text-2xl px-8 md:px-[60px] py-4 md:py-[25px] rounded-2xl shadow-[0_15px_50px_rgba(37,211,102,0.5)] hover:shadow-[0_20px_60px_rgba(37,211,102,0.7)] hover:scale-110 transition-all duration-300 font-extrabold animate-glow w-full md:w-auto"
            >
              💬 Calcular no WhatsApp Grátis
            </button>
          </a>

          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] via-[#FF4500] to-[#FF1744] text-white px-4 py-2 md:px-8 md:py-4 rounded-full font-extrabold mt-4 md:mt-8 shadow-[0_8px_30px_rgba(255,107,53,0.4)] text-base md:text-base">
            <span className="animate-fire text-lg md:text-2xl">🔥</span>
            <span>{pessoasSolicitaram} pessoas solicitaram orçamento hoje</span>
          </div>
        </div>
      </div>
    </section>
  )
}

