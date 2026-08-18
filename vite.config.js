import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon-16x16.png', 'icons/favicon-32x32.png'],
      manifest: {
        name: '해율푸드 관제탑',
        short_name: '관제탑',
        description: '해율만두전골 · 곤드레밥집 · 정담명가 남원추어탕 매장 운영 관제탑',
        start_url: '/',
        display: 'standalone',
        background_color: '#faf9f6',
        theme_color: '#5c7a5a',
        lang: 'ko',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
