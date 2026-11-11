// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@vite-pwa/nuxt'],
  css: ['~/assets/main.css'],

  routeRules: {
    // Homepage photos and icons have stable names, so browsers may keep them for a day
    // and refresh them in the background for a week.
    '/images/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
    '/icons/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
  },

  runtimeConfig: {
    // Server only: the browser calls /api on this site, which forwards to the API with the
    // session token (server/api/[...path].ts). Override with NUXT_API_BASE.
    apiBase: 'http://localhost:8000',
  },

  app: {
    head: {
      title: 'Recipe Hub',
      meta: [{ name: 'theme-color', content: '#ffffff' }],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  i18n: {
    // English at /, Russian at /ru, Polish at /pl: each language is its own server-rendered URL.
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', language: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'pl', language: 'pl', name: 'Polski', file: 'pl.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'recipe-hub.lang',
      redirectOn: 'root',
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Recipe Hub',
      short_name: 'Recipes',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      navigateFallback: null,
    },
  },
})
