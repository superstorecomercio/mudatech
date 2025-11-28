import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mudança Interestadual - Orçamento Grátis | MudaTech',
  description: 'Transporte seguro e confiável entre estados. Logística especializada para mudanças de longa distância. Orçamentos gratuitos de empresas verificadas.',
  keywords: 'mudança interestadual, mudança entre estados, mudança de longa distância, transporte interestadual, empresas de mudança interestadual',
  openGraph: {
    title: 'Mudança Interestadual - Orçamento Grátis | MudaTech',
    description: 'Transporte seguro e confiável entre estados. Logística especializada para mudanças de longa distância.',
    type: 'website',
  },
}

export default function MudancaInterestadualLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

