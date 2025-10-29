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
      workbox: {
        globPatterns: ['**/*.{css,js,html,png,jpg,jpeg,svg,webp,json}'],
        swDest: 'dist/sw.js',
        navigateFallback: null,
      },
    }),
  ],

  adapter: netlify(),
  devToolbar: {
    enabled: false
  }
});