// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  nitro: {
    preset: 'vercel',
  },

  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: [
        '/',
        '/courses',
        '/auth/login',
        '/auth/confirm',
        '/frontend',
        '/frontend/*',
        '/backend',
        '/backend/*',
      ],
    },
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },
})
