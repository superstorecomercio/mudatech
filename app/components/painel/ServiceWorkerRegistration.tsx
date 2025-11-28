"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Registrar Service Worker quando o componente carregar
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/painel/sw.js")
        .then((registration) => {
          console.log("[SW] Service Worker registrado:", registration.scope)
        })
        .catch((error) => {
          console.error("[SW] Erro ao registrar Service Worker:", error)
        })
    }
  }, [])

  return null
}

