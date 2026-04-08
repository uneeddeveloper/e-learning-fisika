import { d as defineEventHandler } from '../../_/nitro.mjs';
import os from 'node:os';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const info_get = defineEventHandler(() => {
  return {
    runtime: "Nitro",
    platform: os.platform(),
    nodeVersion: process.version,
    env: "production",
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
});

export { info_get as default };
//# sourceMappingURL=info.get.mjs.map
