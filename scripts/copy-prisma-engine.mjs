import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

const ENGINE_FILE = 'libquery_engine-rhel-openssl-3.0.x.so.node'
const SOURCE_DIR = resolve('app/generated/prisma')
const SOURCE_PATH = join(SOURCE_DIR, ENGINE_FILE)
const FUNCTIONS_ROOT = resolve('.vercel/output/functions')

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function main() {
  if (!(await exists(SOURCE_PATH))) {
    console.log(`[copy-prisma-engine] source not found: ${SOURCE_PATH} (skipping)`)
    return
  }
  if (!(await exists(FUNCTIONS_ROOT))) {
    console.log(`[copy-prisma-engine] no .vercel/output/functions — not a Vercel build (skipping)`)
    return
  }

  const funcDirs = (await readdir(FUNCTIONS_ROOT, { withFileTypes: true }))
    .filter((d) => d.isDirectory() && d.name.endsWith('.func'))
    .map((d) => join(FUNCTIONS_ROOT, d.name))

  for (const funcDir of funcDirs) {
    const targets = [
      join(funcDir, 'app/generated/prisma', ENGINE_FILE),
      join(funcDir, ENGINE_FILE),
    ]
    for (const dest of targets) {
      await mkdir(dirname(dest), { recursive: true })
      await copyFile(SOURCE_PATH, dest)
      console.log(`[copy-prisma-engine] copied -> ${dest}`)
    }
  }
}

main().catch((err) => {
  console.error('[copy-prisma-engine] failed:', err)
  process.exit(1)
})
