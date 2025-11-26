import HotsitesList from '@/app/components/admin/HotsitesList';

// Desabilitar cache para sempre buscar dados atualizados
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HotsitesPage() {
  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hotsites</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Gerencie todos os hotsites do sistema
          </p>
        </div>
        <a
          href="/admin/hotsites/novo"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center text-sm sm:text-base"
        >
          + Criar Hotsite
        </a>
      </div>

      <HotsitesList />
    </div>
  );
}

