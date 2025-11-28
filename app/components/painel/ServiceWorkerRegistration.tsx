"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Registrar Service Worker quando o componente carregar
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/painel/sw.js", { scope: "/painel/" })
        .then((registration) => {
          console.log("[SW] ✅ Service Worker registrado:", registration.scope)
          // Forçar atualização para garantir que está ativo
          return registration.update()
        })
        .then(() => {
          console.log("[SW] ✅ Service Worker atualizado e ativo")
        })
        .catch((error) => {
          console.error("[SW] ❌ Erro ao registrar Service Worker:", error)
        })
    } else {
      console.warn("[SW] ⚠️ Service Worker não suportado neste navegador")
    }
  }, [])

  return null
}

