import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Plus } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';

// Forçar renderização dinâmica - não usar fetch para localhost
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Cidade {
  id: string;
  nome: string;
  slug: string;
  estado: string;
  total_hotsites: number;
  total_orcamentos: number;
  created_at: string;
  updated_at: string;
}

export default async function CidadesPage() {
  const supabase = createServerClient();

  // Buscar cidades
  const { data: cidadesData, error } = await supabase
    .from('cidades')
    .select(`
      id,
      nome,
      slug,
      estado,
      created_at,
      updated_at
    `)
    .order('nome', { ascending: true });

  if (error) {
    console.error('Erro ao buscar cidades:', error);
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Erro ao carregar cidades</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  // Contar hotsites e orçamentos para cada cidade
  const cidades: Cidade[] = await Promise.all(
    (cidadesData || []).map(async (cidade) => {
      const { count: hotsitesCount } = await supabase
        .from('hotsites')
        .select('*', { count: 'exact', head: true })
        .eq('cidade_id', cidade.id);

      const { count: orcamentosCount } = await supabase
        .from('orcamentos')
        .select('*', { count: 'exact', head: true })
        .eq('cidade_id', cidade.id);

      return {
        id: cidade.id,
        nome: cidade.nome,
        slug: cidade.slug,
        estado: cidade.estado || 'XX',
        total_hotsites: hotsitesCount || 0,
        total_orcamentos: orcamentosCount || 0,
        created_at: cidade.created_at,
        updated_at: cidade.updated_at,
      };
    })
  );
  
  // Separar cidades com problema (estado XX)
  const cidadesComProblema = cidades.filter(c => c.estado === 'XX');
  const cidadesNormais = cidades.filter(c => c.estado !== 'XX');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cidades</h1>
          <p className="text-gray-600 mt-1">
            Gerenciar cidades do sistema ({cidades.length} total)
          </p>
        </div>
        <Link href="/admin/cidades/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Cidade
          </Button>
        </Link>
      </div>

      {/* Alerta de cidades com problema */}
      {cidadesComProblema.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="text-yellow-800 font-semibold mb-2">
            ⚠️ {cidadesComProblema.length} cidades com estado incorreto (XX)
          </h2>
          <p className="text-yellow-700 text-sm mb-3">
            Essas cidades precisam ser corrigidas. Clique em "Editar" para atualizar o estado correto.
          </p>
          <div className="space-y-2">
            {cidadesComProblema.map((cidade) => (
              <div key={cidade.id} className="bg-white rounded p-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">{cidade.nome}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    (slug: {cidade.slug})
                  </span>
                  <span className="text-yellow-600 text-sm ml-2">
                    • {cidade.total_hotsites} hotsites
                  </span>
                </div>
                <Link href={`/admin/cidades/${cidade.id}`}>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600 text-sm font-medium">Total de Cidades</p>
          <p className="text-3xl font-bold text-blue-900">{cidades.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-medium">Total de Hotsites</p>
          <p className="text-3xl font-bold text-green-900">
            {cidades.reduce((acc, c) => acc + c.total_hotsites, 0)}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-purple-600 text-sm font-medium">Total de Orçamentos</p>
          <p className="text-3xl font-bold text-purple-900">
            {cidades.reduce((acc, c) => acc + c.total_orcamentos, 0)}
          </p>
        </div>
      </div>

      {/* Tabela de cidades */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hotsites
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orçamentos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cidadesNormais.map((cidade) => (
              <tr key={cidade.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {cidade.nome}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{cidade.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {cidade.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cidade.total_hotsites}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cidade.total_orcamentos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/cidades/${cidade.id}`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cidades.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma cidade cadastrada</p>
          <Link href="/admin/cidades/novo">
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeira Cidade
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}








