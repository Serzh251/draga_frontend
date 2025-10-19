// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      manifest: {
        short_name: 'Draga',
        name: 'Draga navigation',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 48x48 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        start_url: '/',
        id: '/',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
        screenshots: [
          {
            src: 'screenshot-desktop.png',
            type: 'image/png',
            sizes: '1280x720',
            form_factor: 'wide',
          },
          {
            src: 'screenshot-mobile.png',
            type: 'image/png',
            sizes: '360x640',
          },
        ],
      },
      workbox: {
        // Не использовать navigateFallback как SPA-ловушку для всех путей
        navigateFallback: '/', // можно оставить, но ограничим его

        // 🚫 ЗАПРЕТИМ перехватывать навигацию на пути бэкенда
        navigateFallbackDenylist: [
          /^\/admin/, // Django Admin
          /^\/api/, // API
          /^\/static/, // Статика Django
          /^\/media/, // Медиафайлы
          /^\/swagger/, // Swagger
          /^\/ws/, // WebSocket
          /^\/django-static/,
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ← настраиваем @ как src
    },
  },
});
