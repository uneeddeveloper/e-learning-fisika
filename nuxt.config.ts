// https://nuxt.com/docs/api/configuration/nuxt-config
import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

const PRISMA_ENGINE_FILE = 'libquery_engine-rhel-openssl-3.0.x.so.node'
const PRISMA_GENERATED_DIR = 'app/generated/prisma'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-utils'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

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

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
  },

  nitro: {
    hooks: {
      compiled: async (nitro) => {
        const src = resolve(PRISMA_GENERATED_DIR, PRISMA_ENGINE_FILE)
        const targets = [
          join(nitro.options.output.serverDir, PRISMA_GENERATED_DIR, PRISMA_ENGINE_FILE),
          join(nitro.options.output.serverDir, PRISMA_ENGINE_FILE),
        ]
        for (const dest of targets) {
          await mkdir(dirname(dest), { recursive: true })
          await copyFile(src, dest)
          console.log(`[prisma-engine] copied -> ${dest}`)
        }
      },
    },
  },
})
