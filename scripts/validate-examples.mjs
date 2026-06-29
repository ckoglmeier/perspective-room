import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { validatePerspectiveRoom } from '../dist/index.js'

const examplesDir = join(process.cwd(), 'examples')
const failures = []

for (const entry of readdirSync(examplesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const roomPath = join(examplesDir, entry.name, 'room.json')
  const room = JSON.parse(readFileSync(roomPath, 'utf8'))
  const result = validatePerspectiveRoom(room)
  if (!result.ok) {
    failures.push(`${entry.name}: ${result.errors.join('; ')}`)
  }
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log('All example rooms validate.')
