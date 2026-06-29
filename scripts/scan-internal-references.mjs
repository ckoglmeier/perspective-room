import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const blocked = [
  /Supabase/i,
  /NEXT_PUBLIC_/,
  /SERVICE_ROLE/i,
  /localhost/i,
  /\/Users\/ck/,
  /private Perspective repo/i,
  /private app/i,
  /app\/app\/rooms/,
  /export-manifest\.json/,
]
const ignored = new Set([
  '.git',
  '.gitignore',
  'node_modules',
  'dist',
  '.npm-cache',
  'package-lock.json',
  'scripts/scan-internal-references.mjs',
])
const failures = []

scan(process.cwd())

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('No blocked internal references found.')

function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    const repoPath = relative(process.cwd(), path)
    if (ignored.has(entry.name) || ignored.has(repoPath)) continue
    if (entry.isDirectory()) {
      scan(path)
      continue
    }
    const text = readFileSync(path, 'utf8')
    for (const pattern of blocked) {
      if (pattern.test(text)) {
        failures.push(`${relative(process.cwd(), path)} matches ${pattern}`)
      }
    }
  }
}
