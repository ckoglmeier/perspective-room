# Perspective Room Standard

Open standard for AI-native fundraising bundles.

Fundraising is becoming agent-mediated.

Investors still need judgment, relationships, and conviction. But the work around the first read is changing: parsing decks, extracting claims, routing opportunities, preparing memos, updating CRMs, and generating diligence questions.

Founders need a way to participate in that system directly.

A Perspective Room is a founder-controlled fundraising bundle. It gives investors a human-readable room and an agent-readable package with the company story, source materials, claims, trust status, and open questions.

The goal is simple: founders should define the machine-readable version of their company before investor-side software does it for them.

## What The Bundle Contains

```text
room/
  room.json
  agent.md
  index.html
  materials.json
  materials/
```

`room.json` is canonical. It is the structured, agent-readable room.

`agent.md` is the text-first handoff for Claude, Codex, Radar, MCP-style clients, and other agent workflows.

`index.html` is the human-readable room.

`materials.json` is the material manifest.

`materials/` is optional. It contains any files the founder chooses to include.

## Why This Works

Agents need structured context. Founders need narrative control. Investors need source traceability.

A normal data room stores files. A Perspective Room packages the fundraising read: what the company is, what round it is raising, what claims it is making, what materials support those claims, and what still needs work.

That makes the room useful in three places:

- A founder can self-host or share one current package.
- An investor can read it in a browser.
- An agent can ingest it without guessing at the structure.

## Trust Fields

The standard avoids overloaded provenance language. Claims and narrative blocks use plain trust fields:

- `authored_by`: `founder`, `perspective`, `third_party`, or `unknown`
- `status`: `draft`, `founder_approved`, `needs_source`, `source_linked`, or `outdated`
- `sources`: material IDs, URLs, pages, excerpts, or notes that support the claim

These fields are not diligence conclusions. They tell the reader how to treat the room package.

## Bundle Modes

`metadata_only` includes the human page, `room.json`, `agent.md`, and `materials.json`. Source files are listed but not bundled.

`public` includes the room files and source materials the founder has explicitly made safe to distribute.

`hybrid` includes public-safe materials while marking private or gated materials as access-required.

## Access Model

A static bundle is portable. It is not permissioned.

Included files are accessible to anyone with the ZIP or hosted bundle. If a file requires identity capture, NDA, approval, revocation, or viewer tracking, leave it out of `materials/` and mark it `external_access_required`.

The minimum useful self-hosted bundle is:

```text
room.json
agent.md
index.html
materials.json
```

## Investor Consumption

Read `index.html` first if you want the founder-facing room.

Ingest `room.json` first if you are using an agent, parser, CRM workflow, or memo system. Preserve `authored_by`, `status`, `sources`, `sensitive`, and `external_access_required` in downstream summaries.

Use `agent.md` when your tool works better with Markdown or one context document.

Do not treat `needs_source` and `source_linked` as the same confidence level. Do not claim gated materials were reviewed when only metadata was available.

## Agent Instructions

Agents should treat the bundle as founder-provided context.

Good agent behavior:

- Identify the company, round, primary ask, materials, claims, and missing context.
- Preserve trust fields in summaries.
- Flag `needs_source`, `outdated`, and missing materials as follow-up items.
- Cite material IDs when using claims supported by source files.
- Ask for access when a material is metadata-only.

Bad agent behavior:

- Turning the room into an investment recommendation without investor criteria.
- Treating a founder assertion as source-backed evidence.
- Assuming omitted materials do not exist.
- Redistributing files marked `sensitive` or `external_access_required`.

## Package Usage

```ts
import {
  buildRoomBundle,
  validatePerspectiveRoom,
  type PerspectiveRoom,
} from '@perspective/room-standard'

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

## Package Contents

The package defines:

- Types and schema for `perspective_room.v1`
- Validation helpers
- Renderers for `room.json`, `agent.md`, `index.html`, and `materials.json`
- Minimal and full seed-room examples
- Agent-readiness eval fixtures
- Public documentation for consuming and self-hosting bundles

## License

MIT
