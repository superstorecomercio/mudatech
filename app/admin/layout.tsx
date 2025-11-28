'use client'

import AdminSidebar from '@/app/components/admin/AdminSidebar';
import AdminHeader from '@/app/components/admin/AdminHeader';
import TestModeBanner from '@/app/components/admin/TestModeBanner';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [testModeActive, setTestModeActive] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      // Bypass em desenvolvimento
      // Verificar tanto variável de ambiente do servidor quanto do cliente
      const bypassEnabled = typeof window !== 'undefined' 
        ? (window as any).__ADMIN_BYPASS__ === 'true' || 
          localStorage.getItem('admin_bypass') === 'true' ||
          process.env.NEXT_PUBLIC_ADMIN_BYPASS_AUTH === 'true'
        : false;
      
      if (process.env.NODE_ENV === 'development' && bypassEnabled) {
        setIsAuthenticated(true);
        setAuthChecked(true);
        return;
      }

      // Não verificar autenticação na página de login
      if (pathname === '/admin/login') {
        setAuthChecked(true);
        return;
      }

      const token = localStorage.getItem('admin_session');
      
      if (!token) {
        router.push('/admin/login?redirect=' + encodeURIComponent(pathname));
        return;
      }

      try {
        const response = await fetch('/api/admin/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Se o dispositivo mudou, forçar nova verificação
            if (data.deviceChanged) {
              console.log('Dispositivo diferente detectado, forçando nova verificação');
              localStorage.removeItem('admin_session');
              document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              router.push('/admin/login?redirect=' + encodeURIComponent(pathname) + '&deviceChanged=true');
              return;
            }
            
            setIsAuthenticated(true);
            setAuthChecked(true);
            // Cookie já é gerenciado pelo servidor, não precisa fazer aqui
          } else {
            localStorage.removeItem('admin_session');
            document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            router.push('/admin/login?redirect=' + encodeURIComponent(pathname));
          }
        } else {
          localStorage.removeItem('admin_session');
          document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          router.push('/admin/login?redirect=' + encodeURIComponent(pathname));
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('admin_session');
        document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/admin/login?redirect=' + encodeURIComponent(pathname));
      }
    };

    checkAuth();
  }, [router, pathname]);

  useEffect(() => {
    const checkTestMode = async () => {
      try {
        const response = await fetch('/api/admin/emails/test-mode/status');
        const data = await response.json();
        setTestModeActive(data.active === true || data.enabled === true);
      } catch (error) {
        console.error('Erro ao verificar modo de teste:', error);
      }
    };

    checkTestMode();
    const interval = setInterval(checkTestMode, 30000);
    return () => clearInterval(interval);
  }, []);

  // Não renderizar conteúdo até verificar autenticação (exceto na página de login)
  if (!authChecked && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado e não for página de login, não renderizar
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  // Página de login não precisa do layout completo
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TestModeBanner />
      <AdminSidebar />
      <AdminHeader />
      {/* Main Content - Responsivo */}
      {/* Header fixo tem 64px (h-16), então precisamos de pelo menos pt-20 (80px) para garantir espaço */}
      <main 
        id="admin-main-content" 
        className="lg:ml-64 pt-20 lg:pt-20 p-4 sm:p-6 lg:p-8"
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}


