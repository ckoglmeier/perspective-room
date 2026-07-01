import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  buildRoomBundle,
  renderAgentMarkdown,
  renderRoomHtml,
  validatePerspectiveRoom,
  type PerspectiveRoom,
} from '../src/index'

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), path), 'utf8')) as T
}

describe('Perspective Room Standard', () => {
  it('validates the minimal example', () => {
    const room = readJson<PerspectiveRoom>('examples/minimal/room.json')

    const result = validatePerspectiveRoom(room)

    expect(result.errors).toEqual([])
    expect(result.ok).toBe(true)
  })

  it('validates the full seed-room example', () => {
    const room = readJson<PerspectiveRoom>('examples/full-seed-room/room.json')

    const result = validatePerspectiveRoom(room)

    expect(result.errors).toEqual([])
    expect(result.ok).toBe(true)
    expect(result.warnings).toEqual([])
  })

  it('fails invalid core schema fields with useful errors', () => {
    const result = validatePerspectiveRoom({
      schema_version: 'wrong',
      room_id: '',
      title: '',
    })

    expect(result.ok).toBe(false)
    expect(result.errors).toContain('schema_version must be perspective_room.v1')
    expect(result.errors).toContain('room_id is required')
    expect(result.errors).toContain('title is required')
  })

  it('fails invalid trust state and bundle mode values', () => {
    const room = {
      schema_version: 'perspective_room.v1',
      room_id: 'invalid-trust',
      title: 'Invalid Trust',
      bundle_mode: 'private',
      claims: [
        {
          claim: 'A claim exists.',
          authored_by: 'robot',
          status: 'verified',
        },
      ],
    }

    const result = validatePerspectiveRoom(room)

    expect(result.ok).toBe(false)
    expect(result.errors).toContain('bundle_mode has invalid value private')
    expect(result.errors).toContain('claims[0].authored_by has invalid value robot')
    expect(result.errors).toContain('claims[0].status has invalid value verified')
  })

  it('allows needs_source claims without sources but warns for source_linked claims without sources', () => {
    const room: PerspectiveRoom = {
      schema_version: 'perspective_room.v1',
      room_id: 'source-status',
      title: 'Source Status',
      claims: [
        {
          claim: 'A claim needs more evidence.',
          authored_by: 'founder',
          status: 'needs_source',
        },
        {
          claim: 'A claim says it is linked.',
          authored_by: 'founder',
          status: 'source_linked',
        },
      ],
    }

    const result = validatePerspectiveRoom(room)

    expect(result.ok).toBe(true)
    expect(result.warnings).toContain('claims[1] is source_linked but has no sources')
    expect(result.warnings).not.toContain('claims[0] is source_linked but has no sources')
  })

  it('warns when sensitive material is included in a static bundle', () => {
    const room: PerspectiveRoom = {
      schema_version: 'perspective_room.v1',
      room_id: 'sensitive',
      title: 'Sensitive Room',
      materials: [
        {
          id: 'model',
          display_name: 'Financial model',
          sensitive: true,
          included_in_bundle: true,
          local_path: 'materials/model.xlsx',
        },
      ],
    }

    const result = validatePerspectiveRoom(room)

    expect(result.ok).toBe(true)
    expect(result.warnings).toContain('materials[0] is sensitive but included_in_bundle is true')
  })

  it('builds the expected core bundle files and preserves trust fields', () => {
    const room = readJson<PerspectiveRoom>('examples/full-seed-room/room.json')

    const bundle = buildRoomBundle(room)
    const files = new Map(bundle.files.map((file) => [file.path, file.content]))
    const roomJson = JSON.parse(files.get('room.json') ?? '{}') as PerspectiveRoom

    expect([...files.keys()].sort()).toEqual(['agent.md', 'index.html', 'materials.json', 'room.json'])
    expect(roomJson.claims?.[0]).toMatchObject({
      authored_by: 'founder',
      status: 'source_linked',
    })
    expect(roomJson.claims?.[0]?.sources).toEqual(expect.arrayContaining([
      { material_id: 'seed-deck', page: '7', note: 'Pilot customer summary' },
    ]))
    expect(files.get('materials.json')).toContain('perspective_room_materials.v1')
  })

  it('renders agent instructions that preserve trust distinctions', () => {
    const room = readJson<PerspectiveRoom>('examples/full-seed-room/room.json')

    const markdown = renderAgentMarkdown(room)

    expect(markdown).toContain('Check authored_by, status, and sources before relying on a claim.')
    expect(markdown).toContain('Do not flatten needs_source and source_linked claims')
    expect(markdown).toContain('External access required: true')
    expect(markdown).toContain('"status": "needs_source"')
  })

  it('renders HTML links to the agent-readable artifacts', () => {
    const room = readJson<PerspectiveRoom>('examples/minimal/room.json')

    const html = renderRoomHtml(room)

    expect(html).toContain('href="./room.json"')
    expect(html).toContain('href="./agent.md"')
    expect(html).toContain('href="./materials.json"')
  })

  it('renders included material links without linking gated materials', () => {
    const room = readJson<PerspectiveRoom>('examples/full-seed-room/room.json')

    const html = renderRoomHtml(room)

    expect(html).toContain('href="materials/northstar-seed-deck.md"')
    expect(html).toContain('included in hosted room')
    expect(html).toContain('external access required')
    expect(html).toContain('Request access from the founder.')
    expect(html).not.toContain('href="northstar-model.xlsx"')
  })

  it('keeps agent-readiness eval fixtures well formed', () => {
    const casesDir = join(process.cwd(), 'evals/agent-readiness/cases')
    const cases = readdirSync(casesDir).filter((file) => file.endsWith('.json'))

    expect(cases).toEqual(expect.arrayContaining([
      'preserve-claim-status.json',
      'gated-materials.json',
      'do-not-flatten-trust-status.json',
    ]))

    for (const file of cases) {
      const evaluation = readJson<{
        name: string
        input: string
        prompt: string
        required_behaviors: string[]
        forbidden_behaviors: string[]
      }>(`evals/agent-readiness/cases/${file}`)

      expect(evaluation.name).toBeTruthy()
      expect(evaluation.input).toBe('../../examples/full-seed-room/room.json')
      expect(evaluation.prompt).toBeTruthy()
      expect(evaluation.required_behaviors.length).toBeGreaterThan(0)
      expect(evaluation.forbidden_behaviors.length).toBeGreaterThan(0)
    }
  })
})
