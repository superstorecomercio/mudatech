import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mudança Residencial - Orçamento Grátis | MudaTech',
  description: 'Encontre as melhores empresas de mudança residencial no Brasil. Orçamentos gratuitos, empresas verificadas e serviço confiável. Solicite seu orçamento agora!',
  keywords: 'mudança residencial, mudança de casa, mudança de apartamento, empresas de mudança, orçamento mudança, mudança barata',
  openGraph: {
    title: 'Mudança Residencial - Orçamento Grátis | MudaTech',
    description: 'Encontre as melhores empresas de mudança residencial no Brasil. Orçamentos gratuitos e empresas verificadas.',
    type: 'website',
  },
}

export default function MudancaResidencialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

