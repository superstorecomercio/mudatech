import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Cliente Supabase para uso no cliente (browser)
 * Usa lazy initialization para evitar erros durante o build
 */
export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.\n\n' +
      'Para configurar:\n' +
      '1. Crie o arquivo .env.local na raiz do projeto\n' +
      '2. Adicione:\n' +
      '   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co\n' +
      '   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key\n' +
      '3. Reinicie o servidor: npm run dev\n\n' +
      'Na Vercel, adicione as variáveis em: Settings > Environment Variables'
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// Exporta um getter para manter compatibilidade com código existente
// que usa `supabase` diretamente
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  }
});
