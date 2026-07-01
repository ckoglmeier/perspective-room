# Perspective Room Standard

Open standard for AI-native fundraising bundles.

Perspective Room gives founders a portable fundraising package that humans and AI systems can read from the same source of truth.

Every bundle has two first-class surfaces: a human-readable room for people and agent-readable files for AI workflows.

The core idea is simple: founders should control both versions of the fundraising read before investor-side software defines the machine-readable company for them.

## Why This Exists

Fundraising is becoming agent-mediated.

Investors still need judgment, relationships, and conviction. But the first read is changing. Deck parsing, claim extraction, routing, memo prep, and CRM updates are increasingly handled by software around the investor.

The old package was built for a person opening files one by one:

- a deck
- a DocSend link
- a folder of PDFs
- a model
- scattered answers in email

That is not enough when the company is also being read by agents.

A normal data room stores files. A Perspective Room packages the fundraising read for humans and agents: the company story, round context, materials, claim status, access boundaries, and version signals.

It does not do the investor's work. It makes the founder's package legible to the humans and agents already doing it.

## What Founders Share

```text
room/
  index.html
  room.json
  agent.md
  materials.json
  materials/
```

`index.html` is the human-readable room. It is the surface a founder can host or share with investors, advisors, and collaborators.

`room.json` is canonical. It is the structured, agent-readable room.

`agent.md` is the text-first handoff for Claude Code, Codex, Cowork, Radar, MCP-style clients, and other agent workflows.

`materials.json` is the material manifest.

`materials/` is optional. It contains only files the founder chooses to include in the portable bundle. When the room is self-hosted, included materials should be accessible from the hosted room and linked from `index.html`; gated materials should be listed in `materials.json` but not copied into `materials/`.

## What This Is Not

Perspective Room Standard is not:

- investor diligence
- an investment recommendation
- a permissioning system
- a replacement for investor relationships
- a replacement for legal, financial, or late-stage diligence
- a full virtual data room
- a scoring layer

The open standard defines how fundraising context should be shared. Intelligence layers can be built on top.

## Trust And Access Fields

Claims and narrative blocks use plain trust fields:

- `authored_by`: `founder`, `perspective`, `third_party`, or `unknown`
- `status`: `draft`, `founder_approved`, `needs_source`, `source_linked`, or `outdated`
- `sources`: material IDs, URLs, pages, excerpts, or notes that support the claim

These fields are not diligence conclusions. They tell the reader how to treat the room package.

Materials can also carry access fields:

- `included_in_bundle`
- `external_access_required`
- `sensitive`
- `is_current_version`
- `version_label`

A static bundle is portable. It is not permissioned. If a file requires identity capture, NDA, approval, revocation, or viewer tracking, leave it out of `materials/` and mark it `external_access_required`.

## Bundle Modes

`metadata_only` includes `index.html`, `room.json`, `agent.md`, and `materials.json`. Source files are listed but not bundled.

`public` includes the room files and source materials the founder has explicitly made safe to distribute.

`hybrid` includes public-safe materials while marking private or gated materials as access-required.

## How An AI Harness Should Act

AI harnesses should treat a Perspective Room as founder-provided fundraising context, not as verified investor analysis.

Good harness behavior:

- Read `room.json` first when structured ingestion is available.
- Use `agent.md` for text-first workflows and context windows.
- Preserve `authored_by`, `status`, `sources`, `sensitive`, `external_access_required`, `included_in_bundle`, and version fields.
- Keep `needs_source`, `source_linked`, and `outdated` distinct.
- Cite material IDs when summarizing source-linked claims.
- Say when a material is gated instead of implying it was reviewed.
- Avoid turning the room into an investment recommendation unless the investor supplies decision criteria.

Bad harness behavior:

- Treating founder assertions as verified evidence.
- Flattening `needs_source` and `source_linked` into the same confidence level.
- Assuming omitted or gated materials do not exist.
- Redistributing files marked `sensitive` or `external_access_required`.
- Scoring the company without the user's explicit criteria.

See [AI harness guide](docs/ai-harnesses.md) for Claude Code, Codex, Cowork, and package usage.

## Install From GitHub

Install the package directly from the public repository:

```bash
npm install github:ckoglmeier/perspective-room
```

## Quickstart

Clone the repo and run the standard checks:

```bash
git clone https://github.com/ckoglmeier/perspective-room.git
cd perspective-room
npm install
npm run verify
```

Start with the examples:

- `examples/minimal/` shows the smallest valid room.
- `examples/full-seed-room/` shows a more realistic seed-stage fundraising bundle.

For more detail, see [Examples](examples/README.md).

Open the human-readable room:

```bash
open examples/full-seed-room/index.html
```

Then compare the agent-readable files:

- `examples/full-seed-room/room.json` is the canonical structured room.
- `examples/full-seed-room/agent.md` is the text-first handoff.
- `examples/full-seed-room/materials.json` is the material manifest.

Validate and render the example bundle:

```bash
npm run build
node --input-type=module -e "
import { readFileSync } from 'node:fs'
import { buildRoomBundle, validatePerspectiveRoom } from './dist/index.js'

const room = JSON.parse(readFileSync('examples/full-seed-room/room.json', 'utf8'))
const validation = validatePerspectiveRoom(room)

if (!validation.ok) {
  throw new Error(validation.errors.join('\n'))
}

const bundle = buildRoomBundle(room)
console.log(bundle.files.map((file) => file.path).join('\n'))
"
```

Expected output:

```text
room.json
materials.json
agent.md
index.html
```

## Package Usage

```ts
import {
  buildRoomBundle,
  validatePerspectiveRoom,
  type PerspectiveRoom,
} from 'perspective-room'

const room: PerspectiveRoom = {
  schema_version: 'perspective_room.v1',
  room_id: 'room_123',
  title: 'Acme Seed Room',
  bundle_mode: 'metadata_only',
  company: {
    name: 'Acme',
    one_line_summary: 'Acme helps logistics teams reconcile freight invoices.',
  },
  narrative: {
    authored_by: 'founder',
    status: 'founder_approved',
    current_story: 'Acme reduces freight invoice leakage for mid-market shippers.',
  },
  claims: [
    {
      id: 'claim_traction',
      claim: 'Acme has three paid pilots.',
      authored_by: 'founder',
      status: 'needs_source',
      risk: 'medium',
    },
  ],
}

const validation = validatePerspectiveRoom(room)
if (!validation.ok) {
  throw new Error(validation.errors.join('\n'))
}

const bundle = buildRoomBundle(room)
```

`buildRoomBundle` returns the core files for the portable bundle:

- `room.json`
- `materials.json`
- `agent.md`
- `index.html`

## Standard Boundary

The open standard defines:

- required bundle files
- schema and TypeScript types for `perspective_room.v1`
- validation helpers
- human and agent renderers
- trust and access semantics
- conformance examples
- agent-readiness eval fixtures

Perspective can build an intelligence layer on top: extraction, analysis, drift detection, investor-specific prep, routing, and room maintenance. Those are product capabilities, not requirements of the open standard.

## Companion Skills

This repo also includes companion investor-relations skills that help founders, operators, and agents produce higher-quality room artifacts:

- `fundraising-room-packager`
- `investor-relations`
- `fundraising-claim-auditor`
- `data-room-drift-auditor`
- `investor-update-writer`

Each skill lives under `skills-investor-relations/<skill-name>/SKILL.md`.

## Guides

- [Spec](SPEC.md)
- [Standard](docs/standard.md)
- [Founder self-hosting](docs/self-hosting.md)
- [Investor and agent consumption](docs/investor-agent-consumption.md)
- [AI harness guide](docs/ai-harnesses.md)
- [Maintainer integration](docs/maintainer-integration.md)
- [Launch checklist](docs/launch-checklist.md)

## License

MIT
