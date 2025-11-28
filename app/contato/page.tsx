'use client'

import { useState, type FormEvent } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const WHATSAPP_URL = "https://wa.me/15551842523?text=Ol%C3%A1"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Por enquanto, apenas console.log
      console.log('Dados do contato:', formData)

      // Simula delay de envio
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-16 lg:py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Tem alguma dúvida, sugestão ou precisa de ajuda? Estamos aqui para ajudar!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Informações de Contato
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Escolha a forma de contato que preferir. Nossa equipe está pronta para ajudar você.
                </p>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">E-mail</h3>
                    <a 
                      href="mailto:contato@mudatech.com.br" 
                      className="text-[#667eea] hover:underline font-medium"
                    >
                      contato@mudatech.com.br
                    </a>
                    <p className="text-sm text-gray-600 mt-2">
                      Respondemos em até 24 horas
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
                    <a 
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#667eea] hover:underline font-medium"
                    >
                      (55) 15 5184-2523
                    </a>
                    <p className="text-sm text-gray-600 mt-2">
                      Atendimento rápido e direto
                    </p>
                  </div>
                </div>
              </div>

              {/* Horário Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Horário de Atendimento</h3>
                    <p className="text-gray-700 font-medium">
                      Segunda a Sexta: 9h às 18h
                    </p>
                    <p className="text-gray-700 font-medium">
                      Sábado: 9h às 13h
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Fechado aos domingos e feriados
                    </p>
                  </div>
                </div>
              </div>

              {/* Localização Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Localização</h3>
                    <p className="text-gray-700">
                      Brasil
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Atendimento em todo o território nacional
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Envie sua Mensagem
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 font-medium">
                    Mensagem enviada com sucesso! Entraremos em contato em breve.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 font-medium">
                    Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Assunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all"
                    placeholder="Qual o assunto da sua mensagem?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:border-transparent transition-all resize-none"
                    placeholder="Descreva sua dúvida, sugestão ou solicitação..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#764ba2] hover:to-[#667eea] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Ou entre em contato diretamente pelo{' '}
                  <a 
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#667eea] hover:underline font-semibold"
                  >
                    WhatsApp
                  </a>
                  {' '}para um atendimento mais rápido
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
