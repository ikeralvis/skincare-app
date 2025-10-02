import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server', 
  integrations: [
    AstroPWA({
      mode: 'production',
      registerType: 'autoUpdate',
      injectRegister: null, 
      injectManifest: null, 
      scope: '/', 
      devOptions: {
        enabled: true,
        navigateFallback: '/',
      },
      manifest: {
        name: 'Guía de Skincare',
        short_name: 'Skincare',
        description: 'Tu guía personal de rutina de cuidado de la piel.',
        theme_color: '#00ffff',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'images/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'images/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,js,html,png,jpg,jpeg,svg,webp,json}'],
        navigateFallback: null,
      },
    }),
  ],

  adapter: netlify(),
});