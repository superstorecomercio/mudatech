import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guarda-Móveis - Armazenamento Seguro | MudaTech',
  description: 'Armazenamento seguro e confiável para seus móveis e pertences. Solução ideal para reformas, mudanças temporárias ou falta de espaço. Orçamentos gratuitos.',
  keywords: 'guarda-móveis, armazenamento de móveis, self storage, guarda de móveis, armazenamento temporário, depósito de móveis',
  openGraph: {
    title: 'Guarda-Móveis - Armazenamento Seguro | MudaTech',
    description: 'Armazenamento seguro e confiável para seus móveis e pertences. Solução ideal para reformas e mudanças temporárias.',
    type: 'website',
  },
}

export default function GuardaMoveisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

