"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ChevronRight, MapPin, Home, Package, Calendar, Phone, Mail, User, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  type: "bot" | "user"
  text: string
  timestamp: Date
  read?: boolean
}

interface FormData {
  originCity: string
  originAddress: string
  destinationCity: string
  destinationAddress: string
  propertyType: string
  rooms: string
  moveDate: string
  hasElevator: string
  needsPacking: string
  hasFragileItems: string
  name: string
  phone: string
  email: string
}

const questions = [
  {
    id: "originCity",
    question: "Olá! 👋 Vamos começar. De qual cidade você vai mudar?",
    placeholder: "Digite a cidade de origem",
    icon: MapPin,
  },
  {
    id: "originAddress",
    question: "Perfeito! E qual o endereço completo de origem?",
    placeholder: "Digite o endereço completo",
    icon: Home,
  },
  {
    id: "destinationCity",
    question: "Ótimo! E para qual cidade você está se mudando?",
    placeholder: "Digite a cidade de destino",
    icon: MapPin,
  },
  {
    id: "destinationAddress",
    question: "E qual será o endereço de destino?",
    placeholder: "Digite o endereço de destino",
    icon: Home,
  },
  {
    id: "propertyType",
    question: "Que tipo de imóvel você está saindo?",
    options: ["Casa", "Apartamento", "Kitnet", "Comercial"],
    icon: Home,
  },
  {
    id: "rooms",
    question: "Quantos cômodos tem o imóvel?",
    options: ["1 cômodo", "2 cômodos", "3 cômodos", "4+ cômodos"],
    icon: Package,
  },
  {
    id: "moveDate",
    question: "Quando você pretende realizar a mudança?",
    placeholder: "Ex: 15/03/2025",
    icon: Calendar,
  },
  {
    id: "hasElevator",
    question: "O imóvel tem elevador ou é necessário usar escada?",
    options: ["Tem elevador", "Tem escada", "Térreo"],
    icon: Home,
  },
  {
    id: "needsPacking",
    question: "Você precisa de serviço de embalagem?",
    options: ["Sim, embalagem completa", "Sim, apenas itens frágeis", "Não, farei por conta"],
    icon: Package,
  },
  {
    id: "hasFragileItems",
    question: "Você tem itens frágeis ou que precisam de cuidado especial?",
    options: ["Sim", "Não"],
    icon: Package,
  },
  {
    id: "name",
    question: "Quase lá! Qual é o seu nome?",
    placeholder: "Digite seu nome completo",
    icon: User,
  },
  {
    id: "phone",
    question: "Qual o melhor telefone para contato?",
    placeholder: "(00) 00000-0000",
    icon: Phone,
  },
  {
    id: "email",
    question: "E por último, qual seu e-mail?",
    placeholder: "seu@email.com",
    icon: Mail,
  },
]

interface ConversationalFormProps {
  onComplete: (data: FormData) => void
}

export function ConversationalForm({ onComplete }: ConversationalFormProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [inputValue, setInputValue] = useState("")
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [isTyping, setIsTyping] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0 && showIntro) {
      setTimeout(() => {
        addBotMessage("Olá! Sou a Julia 👋")
      }, 500)

      setTimeout(() => {
        addBotMessage("Vou te ajudar a fazer uma cotação rápida e fácil da sua mudança!")
      }, 2000)

      setTimeout(() => {
        setShowIntro(false)
        setCurrentStep(0)
        addBotMessage(questions[0].question)
      }, 3500)
    }
  }, [])

  const addBotMessage = (text: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          text,
          timestamp: new Date(),
          read: false,
        },
      ])
      setIsTyping(false)
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.type === "bot" && !msg.read ? { ...msg, read: true } : msg)))
      }, 800)
    }, 800)
  }

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text,
        timestamp: new Date(),
        read: true,
      },
    ])
  }

  const handleSubmit = (value: string) => {
    if (!value.trim() || currentStep < 0) return

    const currentQuestion = questions[currentStep]
    addUserMessage(value)

    setFormData((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))

    setInputValue("")

    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
        addBotMessage(questions[currentStep + 1].question)
      }, 1000)
    } else {
      setTimeout(() => {
        addBotMessage("Perfeito! ✅ Estou calculando o melhor orçamento para você...")
        setTimeout(() => {
          onComplete(formData as FormData)
        }, 2000)
      }, 1000)
    }
  }

  const handleOptionClick = (option: string) => {
    handleSubmit(option)
  }

  const currentQuestion = currentStep >= 0 ? questions[currentStep] : null
  const Icon = currentQuestion?.icon

  return (
    <Card className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm border-2 shadow-2xl">
      <div className="h-[600px] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500",
                message.type === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full overflow-hidden",
                  message.type === "bot" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
                )}
              >
                {message.type === "bot" ? (
                  <img src="/professional-woman-receptionist-smiling-friendly-c.jpg" alt="Julia" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div
                  className={cn(
                    "rounded-2xl px-5 py-3 shadow-sm",
                    message.type === "bot" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                  )}
                >
                  <p className="text-base leading-relaxed font-medium">{message.text}</p>
                </div>
                {message.type === "user" && (
                  <div className="flex items-center justify-end gap-1 px-2">
                    <CheckCheck className={cn("h-4 w-4", message.read ? "text-primary" : "text-muted-foreground")} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3 animate-in fade-in">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground overflow-hidden">
                <img src="/professional-woman-receptionist-smiling-friendly-c.jpg" alt="Julia" className="h-full w-full object-cover" />
              </div>
              <div className="rounded-2xl px-5 py-3 bg-muted">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {currentStep >= 0 && !isTyping && messages.length > 0 && (
          <div className="border-t bg-background/50 p-4 space-y-3">
            {currentQuestion?.options ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4 text-left hover:bg-primary hover:text-primary-foreground transition-all text-base font-medium"
                  >
                    <ChevronRight className="mr-2 h-5 w-5 shrink-0" />
                    <span>{option}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit(inputValue)
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />}
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={currentQuestion?.placeholder}
                    className={cn("h-12 text-base font-medium", Icon && "pl-11")}
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-6 text-base font-semibold"
                  disabled={!inputValue.trim()}
                >
                  Enviar
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
