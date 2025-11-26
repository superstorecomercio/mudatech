'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';

interface Hotsite {
  id: string;
  nome_exibicao?: string;
  email?: string;
  descricao?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  logo_url?: string;
  foto1_url?: string;
}

export default function HotsitesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hotsites, setHotsites] = useState<Hotsite[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce para evitar muitas requisições
  useEffect(() => {
    if (!searchTerm.trim()) {
      setHotsites([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/admin/hotsites/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar hotsites');
        }

        setHotsites(data.hotsites || []);
      } catch (error) {
        console.error('Erro ao buscar hotsites:', error);
        setHotsites([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Aguardar 300ms após parar de digitar

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div>
      {/* Busca */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por nome
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Digite o nome do hotsite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0073e6] focus:border-[#0073e6]"
              autoComplete="off"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Digite pelo menos 1 caractere para buscar. A busca ignora maiúsculas e minúsculas.
          </p>
        </div>

        {hasSearched && (
          <div className="text-sm text-gray-600">
            {loading ? (
              <span>Buscando...</span>
            ) : (
              <>
                Mostrando <span className="font-semibold">{hotsites.length}</span> hotsite(s) encontrado(s)
              </>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Digite o nome do hotsite no campo acima para buscar e visualizar os resultados.
            </p>
          </div>
        )}
      </div>

      {/* Tabela - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotsite
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagens
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Buscando hotsites...</span>
                    </div>
                  </td>
                </tr>
              ) : !hasSearched ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">Digite no campo de busca para encontrar hotsites</p>
                      <p className="text-sm mt-1">
                        A busca será realizada automaticamente enquanto você digita
                      </p>
                    </div>
                  </td>
                </tr>
              ) : hotsites.length > 0 ? (
                hotsites.map((hotsite) => (
                  <tr key={hotsite.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {hotsite.nome_exibicao || 'Sem nome'}
                      </div>
                      {hotsite.email && (
                        <div className="text-sm text-gray-500 mt-1">
                          {hotsite.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {hotsite.cidade || '-'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {hotsite.estado || '-'}
                      </div>
                      {hotsite.endereco && (
                        <div className="text-xs text-gray-400 mt-1">
                          {hotsite.endereco.substring(0, 40)}
                          {hotsite.endereco.length > 40 && '...'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {hotsite.logo_url && (
                          <span className="text-xs text-green-600">✓ Logo</span>
                        )}
                        {hotsite.foto1_url && (
                          <span className="text-xs text-green-600">✓ Foto1</span>
                        )}
                        {!hotsite.logo_url && !hotsite.foto1_url && (
                          <span className="text-xs text-gray-400">Sem imagens</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/hotsites/${hotsite.id}`}
                        className="text-[#0073e6] hover:text-[#005bb5] font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm ? (
                        <>
                          <p className="font-medium">Nenhum hotsite encontrado</p>
                          <p className="text-sm mt-1">
                            Tente ajustar sua busca
                          </p>
                        </>
                      ) : (
                        <p>Nenhum hotsite cadastrado</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Buscando hotsites...</span>
            </div>
          </div>
        ) : !hasSearched ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">Digite no campo de busca para encontrar hotsites</p>
              <p className="text-sm mt-1">
                A busca será realizada automaticamente enquanto você digita
              </p>
            </div>
          </div>
        ) : hotsites.length > 0 ? (
          hotsites.map((hotsite) => (
            <div key={hotsite.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {hotsite.nome_exibicao || 'Sem nome'}
                  </h3>
                  {hotsite.email && (
                    <p className="text-sm text-gray-500 mt-1">
                      {hotsite.email}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div>
                  <span className="text-xs text-gray-500">Localização: </span>
                  <span className="text-sm font-medium text-gray-900">
                    {hotsite.cidade || '-'}, {hotsite.estado || '-'}
                  </span>
                </div>
                {hotsite.endereco && (
                  <div>
                    <span className="text-xs text-gray-500">Endereço: </span>
                    <span className="text-xs text-gray-600">
                      {hotsite.endereco}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-500">Imagens: </span>
                  <div className="flex items-center gap-2 mt-1">
                    {hotsite.logo_url && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">✓ Logo</span>
                    )}
                    {hotsite.foto1_url && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">✓ Foto1</span>
                    )}
                    {!hotsite.logo_url && !hotsite.foto1_url && (
                      <span className="text-xs text-gray-400">Sem imagens</span>
                    )}
                  </div>
                </div>
              </div>

              <Link
                href={`/admin/hotsites/${hotsite.id}`}
                className="block w-full px-4 py-2 bg-[#0073e6] text-white rounded-md hover:bg-[#005bb5] transition-colors text-center font-medium text-sm"
              >
                Editar
              </Link>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-500">
              {searchTerm ? (
                <>
                  <p className="font-medium">Nenhum hotsite encontrado</p>
                  <p className="text-sm mt-1">
                    Tente ajustar sua busca
                  </p>
                </>
              ) : (
                <p>Nenhum hotsite cadastrado</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
