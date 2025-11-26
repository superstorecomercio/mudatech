-- Migration: Criar template de email para prospecção de clientes
-- Descrição: Template para envio de ofertas e promoções para vender anúncios

INSERT INTO email_templates (
  tipo,
  nome,
  assunto,
  corpo_html,
  variaveis,
  ativo,
  created_at,
  updated_at
) VALUES (
  'prospeccao_clientes',
  'Prospecção de Clientes - Ofertas e Promoções',
  'Oportunidade Especial: Anuncie sua Empresa de Mudanças na MudaTech! 🚚',
  '<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Oportunidade Especial - MudaTech</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #0073e6;">
      <h1 style="color: #0073e6; margin: 0; font-size: 28px;">MudaTech</h1>
      <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Sua plataforma de mudanças</p>
    </div>

    <!-- Código de Rastreamento -->
    <div style="background-color: #f0f0f0; padding: 10px; border-radius: 4px; margin-bottom: 20px; text-align: center; font-size: 11px; color: #666;">
      Código: {{codigo_rastreamento}}
    </div>

    <!-- Conteúdo Principal -->
    <h2 style="color: #333; font-size: 24px; margin-top: 0;">Olá {{nome_cliente}}!</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Esperamos que esteja bem! Somos a <strong>MudaTech</strong>, a maior plataforma de orçamentos de mudanças do Brasil.
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      Temos uma <strong>oportunidade especial</strong> para empresas de mudanças que desejam aumentar sua visibilidade e receber mais orçamentos qualificados!
    </p>

    <!-- Destaque da Oferta -->
    <div style="background: linear-gradient(135deg, #0073e6 0%, #005bb5 100%); color: white; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
      <h3 style="margin: 0 0 15px 0; font-size: 22px;">🎯 Anuncie sua Empresa na MudaTech</h3>
      <p style="margin: 0; font-size: 16px; opacity: 0.95;">
        Receba orçamentos de clientes reais que estão procurando serviços de mudança na sua região!
      </p>
    </div>

    <!-- Benefícios -->
    <h3 style="color: #0073e6; font-size: 20px; margin-top: 30px;">✨ Por que anunciar na MudaTech?</h3>
    
    <ul style="font-size: 16px; line-height: 1.8; padding-left: 20px;">
      <li style="margin-bottom: 10px;"><strong>Orçamentos Qualificados:</strong> Clientes reais procurando serviços de mudança</li>
      <li style="margin-bottom: 10px;"><strong>Alta Visibilidade:</strong> Sua empresa aparece para milhares de clientes</li>
      <li style="margin-bottom: 10px;"><strong>Fácil Gerenciamento:</strong> Painel completo para gerenciar seus anúncios</li>
      <li style="margin-bottom: 10px;"><strong>Resultados Comprovados:</strong> Centenas de empresas já utilizam nossa plataforma</li>
      <li style="margin-bottom: 10px;"><strong>Suporte Dedicado:</strong> Equipe pronta para ajudar você a ter sucesso</li>
    </ul>

    <!-- Call to Action -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://guiademudancas.com.br/planos" style="display: inline-block; background-color: #28a745; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        🚀 Quero Anunciar Agora!
      </a>
    </div>

    <!-- Informações Adicionais -->
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 30px; border-left: 4px solid #0073e6;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        <strong>💡 Dica:</strong> Nossos planos são flexíveis e adaptados para empresas de todos os tamanhos. 
        Entre em contato conosco para conhecer a melhor opção para o seu negócio!
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999;">
      <p style="margin: 5px 0;">
        <strong>MudaTech</strong> - Plataforma de Orçamentos de Mudanças
      </p>
      <p style="margin: 5px 0;">
        Email: contato@mudatech.com.br | Site: <a href="https://guiademudancas.com.br" style="color: #0073e6;">guiademudancas.com.br</a>
      </p>
      <p style="margin: 10px 0 0 0; font-size: 11px;">
        Você está recebendo este email porque seu endereço está em nossa lista de contatos.
        <br>
        Se não deseja mais receber nossos emails, <a href="#" style="color: #0073e6;">clique aqui para cancelar</a>.
      </p>
    </div>

  </div>
</body>
</html>',
  '["nome_cliente", "email_cliente", "codigo_rastreamento"]'::JSONB,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (tipo) 
DO UPDATE SET
  nome = EXCLUDED.nome,
  assunto = EXCLUDED.assunto,
  corpo_html = EXCLUDED.corpo_html,
  variaveis = EXCLUDED.variaveis,
  updated_at = NOW();
