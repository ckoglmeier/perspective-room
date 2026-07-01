# AI Harness Guide

Perspective Room is designed to be read by AI harnesses without custom scraping.

The harness should use the room as founder-provided fundraising context. It should preserve claim status, source references, access boundaries, and version signals. It should not turn the room into an investment recommendation unless the user supplies investor-specific decision criteria.

## General Ingestion Order

1. Read `room.json` first when structured ingestion is available.
2. Read `agent.md` when the harness works better with Markdown or one context document.
3. Use `materials.json` to inspect the material list without parsing the full room object.
4. Read files in `materials/` only when `included_in_bundle` is true and a local file is present.
5. Preserve gated-material status when `external_access_required` is true.

## Package Usage

Install the package directly from the public repository:

```bash
npm install github:ckoglmeier/perspective-room
```

Validation example:

```ts
import { readFileSync } from 'node:fs'
import { validatePerspectiveRoom } from 'perspective-room'

const room = JSON.parse(readFileSync('room.json', 'utf8'))
const result = validatePerspectiveRoom(room)

if (!result.ok) {
  throw new Error(result.errors.join('\n'))
}
```

## Claude Code

Use the room as project context.

Recommended setup:

```text
fundraising-room/
  index.html
  room.json
  agent.md
  materials.json
  materials/
```

Prompt:

```text
Read agent.md and room.json.
Treat this as founder-provided fundraising context.
Preserve authored_by, status, sources, sensitive, external_access_required, included_in_bundle, and version fields.
Do not flatten needs_source, source_linked, and outdated claims.
Do not claim gated materials were reviewed.
Do not make an investment recommendation unless I provide investor criteria.
```

If building tooling around the room, install the package in the project:

```bash
npm install github:ckoglmeier/perspective-room
```

## Codex

Use the room as workspace context.

Recommended setup:

```text
fundraising-room/
  index.html
  room.json
  agent.md
  materials.json
  materials/
```

Prompt:

```text
Use room.json as canonical structured context and agent.md as the text handoff.
Summarize the company, round context, materials, claims, access boundaries, and version signals.
Preserve trust fields exactly.
If a material is external_access_required or not included_in_bundle, say it is gated.
Do not infer that omitted materials do not exist.
```

If building or validating room exports, install the package:

```bash
npm install github:ckoglmeier/perspective-room
```

## Cowork

Use `agent.md` as the primary context file and attach `room.json` when the harness supports structured files.

Recommended setup:

```text
fundraising-room/
  agent.md
  room.json
  materials.json
  materials/
```

Prompt:

```text
This is a Perspective Room.
Use agent.md for the narrative handoff and room.json for canonical fields.
Preserve claim status, source references, access boundaries, and version signals.
Do not treat founder-provided claims as verified unless status is source_linked and sources are present.
Do not redistribute or summarize sensitive files as reviewed when they are gated.
```

If Cowork is connected to a code workspace or package-aware environment, install:

```bash
npm install github:ckoglmeier/perspective-room
```

## Harness Output Requirements

A good harness summary should include:

- company name and one-line summary
- round stage, size, and objective when present
- current narrative status
- claims with `authored_by`, `status`, and source references
- material list with included vs gated status
- version or currentness signals

A good harness summary should not include:

- unqualified statements that hide `needs_source`
- claims that gated materials were reviewed
- investment recommendations without supplied criteria
- redistribution of sensitive material text
