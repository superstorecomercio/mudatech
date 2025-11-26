'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function TestModeBanner() {
  const [isTestMode, setIsTestMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const checkTestMode = async () => {
      try {
        const response = await fetch('/api/admin/emails/test-mode/status')
        const data = await response.json()
        // API retorna 'active', não 'enabled'
        const isActive = data.active === true || data.enabled === true
        console.log('🔴 [TestModeBanner] Status:', { data, isActive, loading, dismissed })
        setIsTestMode(isActive)
      } catch (error) {
        console.error('Erro ao verificar modo de teste:', error)
      } finally {
        setLoading(false)
      }
    }

    checkTestMode()
    // Verificar a cada 30 segundos
    const interval = setInterval(checkTestMode, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Verificar se foi descartado no localStorage
  useEffect(() => {
    const dismissedState = localStorage.getItem('test-mode-banner-dismissed')
    if (dismissedState === 'true') {
      setDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('test-mode-banner-dismissed', 'true')
  }

  // Resetar dismissed quando o modo de teste mudar
  useEffect(() => {
    if (!isTestMode) {
      setDismissed(false)
      localStorage.removeItem('test-mode-banner-dismissed')
    }
  }, [isTestMode])

  // Ajustar padding do main quando banner estiver visível
  useEffect(() => {
    const updatePadding = () => {
      const mainContent = document.getElementById('admin-main-content')
      if (!mainContent) {
        // Tentar novamente após um delay se o elemento não existir
        setTimeout(updatePadding, 100)
        return
      }

      const isMobile = window.innerWidth < 1024
      const bannerVisible = isTestMode && !dismissed && !loading

      if (bannerVisible) {
        // Banner tem altura fixa de 64px (h-16 = 4rem)
        if (isMobile) {
          // Mobile: header (80px = 5rem pt-20) + banner (64px = 4rem) = 144px = 9rem
          mainContent.style.paddingTop = '9rem'
        } else {
          // Desktop: apenas banner (64px = 4rem)
          mainContent.style.paddingTop = '4rem'
        }
      } else {
        // Resetar para valores padrão do Tailwind
        if (isMobile) {
          mainContent.style.paddingTop = '5rem' // pt-20 padrão
        } else {
          mainContent.style.paddingTop = '0' // pt-0 padrão
        }
      }
    }

    // Aguardar um pouco para garantir que o DOM está pronto
    const timeout = setTimeout(updatePadding, 100)
    updatePadding()
    window.addEventListener('resize', updatePadding)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', updatePadding)
    }
  }, [isTestMode, dismissed, loading])

  // Debug: sempre mostrar se estiver em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('🔴 [TestModeBanner] Render check:', { loading, isTestMode, dismissed })
  }

  if (loading || !isTestMode || dismissed) {
    return null
  }

  return (
    <div className="fixed top-16 lg:top-0 left-0 right-0 z-[55] bg-red-600 text-white shadow-lg h-16">
      <div className="flex items-center justify-between px-4 py-3 h-full">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base">
              ⚠️ Modo de Teste Ativo
            </p>
            <p className="text-xs sm:text-sm opacity-90">
              Todos os emails estão sendo interceptados e não serão enviados realmente. 
              <a 
                href="/admin/emails/test-mode" 
                className="underline font-medium ml-1 hover:opacity-75"
              >
                Ver detalhes
              </a>
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 p-1 hover:bg-red-700 rounded transition-colors flex-shrink-0"
          aria-label="Fechar aviso"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

