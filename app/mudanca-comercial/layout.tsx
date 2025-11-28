import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mudança Comercial - Orçamento Grátis | MudaTech',
  description: 'Serviço especializado para empresas. Transporte seguro de equipamentos, móveis e documentos comerciais. Orçamentos gratuitos de empresas verificadas.',
  keywords: 'mudança comercial, mudança de escritório, mudança de loja, mudança empresarial, empresas de mudança comercial',
  openGraph: {
    title: 'Mudança Comercial - Orçamento Grátis | MudaTech',
    description: 'Serviço especializado para empresas. Transporte seguro de equipamentos, móveis e documentos comerciais.',
    type: 'website',
  },
}

export default function MudancaComercialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

