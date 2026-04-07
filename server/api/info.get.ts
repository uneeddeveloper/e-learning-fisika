import os from 'node:os'

export default defineEventHandler(() => {
  return {
    runtime: 'Nitro',
    platform: os.platform(),
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
  }
})
