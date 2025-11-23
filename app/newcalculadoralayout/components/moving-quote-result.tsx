"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MapPin, Home, Package, Calendar, Phone, Mail, User, RotateCcw } from "lucide-react"

interface MovingQuoteResultProps {
  data: any
  onReset: () => void
}

export function MovingQuoteResult({ data, onReset }: MovingQuoteResultProps) {
  // Simple price calculation based on distance and property size
  const calculatePrice = () => {
    let basePrice = 800

    if (data.rooms?.includes("4+")) basePrice += 400
    else if (data.rooms?.includes("3")) basePrice += 200
    else if (data.rooms?.includes("2")) basePrice += 100

    if (data.needsPacking?.includes("completa")) basePrice += 300
    else if (data.needsPacking?.includes("frágeis")) basePrice += 150

    if (data.hasFragileItems === "Sim") basePrice += 100
    if (data.hasElevator?.includes("escada")) basePrice += 150

    return basePrice
  }

  const estimatedPrice = calculatePrice()

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Card className="bg-primary text-primary-foreground p-8 text-center shadow-2xl">
        <CheckCircle2 className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Orçamento Calculado!</h2>
        <p className="text-primary-foreground/90 mb-6">
          Recebemos suas informações e calculamos o valor estimado da sua mudança
        </p>
        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
          <p className="text-sm text-primary-foreground/80 mb-1">Valor estimado</p>
          <p className="text-5xl font-bold">R$ {estimatedPrice.toLocaleString("pt-BR")}</p>
          <p className="text-sm text-primary-foreground/80 mt-2">*Valor aproximado, sujeito a alterações</p>
        </div>
      </Card>

      <Card className="p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-6 text-foreground">Resumo da Solicitação</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Origem</p>
                <p className="text-foreground">{data.originCity}</p>
                <p className="text-sm text-muted-foreground">{data.originAddress}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Destino</p>
                <p className="text-foreground">{data.destinationCity}</p>
                <p className="text-sm text-muted-foreground">{data.destinationAddress}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Home className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Tipo de Imóvel</p>
                <p className="text-foreground">{data.propertyType}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Cômodos</p>
                <p className="text-foreground">{data.rooms}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Data da Mudança</p>
                <p className="text-foreground">{data.moveDate}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Nome</p>
                <p className="text-foreground">{data.name}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-muted-foreground">Telefone</p>
                <p className="text-foreground">{data.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-muted-foreground">E-mail</p>
                <p className="text-foreground">{data.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <p className="font-semibold text-sm text-muted-foreground">Serviços Adicionais</p>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• Elevador: {data.hasElevator}</li>
                <li>• Embalagem: {data.needsPacking}</li>
                <li>• Itens frágeis: {data.hasFragileItems}</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-accent/10 border-accent">
        <p className="text-center text-sm text-muted-foreground mb-4">
          Em breve você receberá até 10 orçamentos de empresas especializadas no seu e-mail!
        </p>
        <div className="flex justify-center gap-3">
          <Button size="lg" className="px-8">
            Confirmar Solicitação
          </Button>
          <Button size="lg" variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Nova Cotação
          </Button>
        </div>
      </Card>
    </div>
  )
}
