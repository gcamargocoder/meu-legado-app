import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.svg', 'icons/icon-512.svg'],
      workbox: {
        // Muda o prefixo de todos os caches do Workbox nos dispositivos dos
        // usuários. Isso invalida de uma vez os caches da versão anterior do
        // app (o hash de conteúdo do Vite já muda por padrão a cada build,
        // mas esse bump força a limpeza mesmo de caches antigos que por
        // algum motivo não teriam sido atualizados ainda).
        cacheId: 'meu-legado-v2',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Meu Legado',
        short_name: 'Meu Legado',
        description: 'Disciplina positiva e acompanhamento do desenvolvimento dos filhos.',
        theme_color: '#1F3A2E',
        background_color: '#F5F1E6',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
});
