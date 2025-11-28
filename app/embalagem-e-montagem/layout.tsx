import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Embalagem e Montagem - Serviço Profissional | MudaTech',
  description: 'Serviço completo de embalagem profissional e montagem de móveis. Proteção total para seus pertences durante a mudança. Orçamentos gratuitos.',
  keywords: 'embalagem profissional, montagem de móveis, desmontagem de móveis, embalagem para mudança, serviço de embalagem',
  openGraph: {
    title: 'Embalagem e Montagem - Serviço Profissional | MudaTech',
    description: 'Serviço completo de embalagem profissional e montagem de móveis. Proteção total para seus pertences durante a mudança.',
    type: 'website',
  },
}

export default function EmbalagemEMontagemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

