export default defineEventHandler(() => {
  return {
    status: 'ok',
    layer: 'backend',
    runtime: 'Nitro',
    time: new Date().toLocaleTimeString('id-ID'),
  }
})
