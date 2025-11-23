"use client"

import { useState } from "react"
import { ConversationalForm } from "@/components/conversational-form"
import { MovingQuoteResult } from "@/components/moving-quote-result"

export default function Home() {
  const [showResult, setShowResult] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  const handleFormComplete = (data: any) => {
    setFormData(data)
    setShowResult(true)
  }

  const handleReset = () => {
    setShowResult(false)
    setFormData(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary mb-2">Guia de Mudanças</h1>
          <div className="inline-block bg-primary/10 border-2 border-primary rounded-full px-6 py-2">
            <p className="text-primary font-semibold text-lg">⚡ Calculadora Instantânea</p>
          </div>
          <p className="text-foreground text-xl font-medium">
            Vamos calcular o valor da sua mudança em <span className="text-primary font-bold">15 segundos</span>
          </p>
        </header>

        {!showResult ? (
          <ConversationalForm onComplete={handleFormComplete} />
        ) : (
          <MovingQuoteResult data={formData} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
