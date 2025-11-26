'use client'

import AdminSidebar from '@/app/components/admin/AdminSidebar';
import TestModeBanner from '@/app/components/admin/TestModeBanner';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [testModeActive, setTestModeActive] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <TestModeBanner />
      <AdminSidebar />
      {/* Main Content - Responsivo */}
      <main 
        id="admin-main-content" 
        className={`lg:ml-64 p-4 sm:p-6 lg:p-8 ${
          testModeActive 
            ? 'pt-36 lg:pt-24' // Mobile: 144px (header 80px + banner 64px), Desktop: 96px (banner 64px + espaço 32px)
            : 'pt-24 lg:pt-8'   // Mobile: 96px (header 80px + espaço 16px), Desktop: 32px (espaço)
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}


