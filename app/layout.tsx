import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Empresas de Mudança - Encontre as Melhores | MudaTech",
  description: "Encontre as melhores empresas de mudança do Brasil. Compare preços, serviços e solicite orçamentos gratuitos. Mais de 10.000 orçamentos realizados. Empresas verificadas e confiáveis.",
  keywords: "empresas de mudança, mudança, mudanças, empresas mudança, mudança residencial, mudança comercial, mudança interestadual, orçamento mudança, preço mudança, empresas mudança brasil, mudança barata, mudança rápida",
  openGraph: {
    title: "Empresas de Mudança - Encontre as Melhores | MudaTech",
    description: "Encontre as melhores empresas de mudança do Brasil. Compare preços, serviços e solicite orçamentos gratuitos. Mais de 10.000 orçamentos realizados.",
    type: "website",
    locale: "pt_BR",
    siteName: "MudaTech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Empresas de Mudança - Encontre as Melhores | MudaTech",
    description: "Encontre as melhores empresas de mudança do Brasil. Compare preços e solicite orçamentos gratuitos.",
  },
  alternates: {
    canonical: "https://www.mudatech.com.br",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MudaTech",
    "description": "Plataforma para encontrar as melhores empresas de mudança do Brasil",
    "url": "https://www.mudatech.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.mudatech.com.br/cidades?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MudaTech",
    "url": "https://www.mudatech.com.br",
    "logo": "https://www.mudatech.com.br/logo.png",
    "description": "Plataforma líder para encontrar empresas de mudança no Brasil",
    "sameAs": [
      "https://www.facebook.com/mudatech",
      "https://www.instagram.com/mudatech"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Empresas de Mudança",
    "provider": {
      "@type": "Organization",
      "name": "MudaTech"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "description": "Encontre as melhores empresas de mudança do Brasil. Compare preços, serviços e solicite orçamentos gratuitos."
  };

  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <head>
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <Script
          id="service-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema)
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col bg-white`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
