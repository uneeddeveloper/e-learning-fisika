export default defineEventHandler((event) => {
  if (process.env.NODE_ENV !== 'development') return

  setResponseHeader(event, 'X-Rendered-By', 'Nuxt Backend (Nitro)')
  setResponseHeader(event, 'X-Layer', 'server')
})
