"use client"

import { useEffect } from "react"

export function PWAMetaTags() {
  useEffect(() => {
    // Adicionar link do manifest se não existir
    if (typeof document !== "undefined") {
      let manifestLink = document.querySelector('link[rel="manifest"]')
      if (!manifestLink) {
        manifestLink = document.createElement("link")
        manifestLink.setAttribute("rel", "manifest")
        manifestLink.setAttribute("href", "/painel/manifest.json")
        document.head.appendChild(manifestLink)
      }

      // Adicionar apple-touch-icon se não existir
      let appleIcon = document.querySelector('link[rel="apple-touch-icon"]')
      if (!appleIcon) {
        appleIcon = document.createElement("link")
        appleIcon.setAttribute("rel", "apple-touch-icon")
        appleIcon.setAttribute("href", "/painel/apple-icon-180.png")
        document.head.appendChild(appleIcon)
      }

      // Adicionar meta theme-color se não existir
      let themeColor = document.querySelector('meta[name="theme-color"]')
      if (!themeColor) {
        themeColor = document.createElement("meta")
        themeColor.setAttribute("name", "theme-color")
        themeColor.setAttribute("content", "#2563eb")
        document.head.appendChild(themeColor)
      }

      // Adicionar meta apple-mobile-web-app-capable
      let appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]')
      if (!appleCapable) {
        appleCapable = document.createElement("meta")
        appleCapable.setAttribute("name", "apple-mobile-web-app-capable")
        appleCapable.setAttribute("content", "yes")
        document.head.appendChild(appleCapable)
      }

      // Adicionar meta apple-mobile-web-app-status-bar-style
      let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
      if (!appleStatusBar) {
        appleStatusBar = document.createElement("meta")
        appleStatusBar.setAttribute("name", "apple-mobile-web-app-status-bar-style")
        appleStatusBar.setAttribute("content", "default")
        document.head.appendChild(appleStatusBar)
      }

      // Adicionar meta apple-mobile-web-app-title
      let appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]')
      if (!appleTitle) {
        appleTitle = document.createElement("meta")
        appleTitle.setAttribute("name", "apple-mobile-web-app-title")
        appleTitle.setAttribute("content", "MudaTech")
        document.head.appendChild(appleTitle)
      }
    }
  }, [])

  return null
}

