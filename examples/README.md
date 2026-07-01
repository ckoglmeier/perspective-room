# Examples

Start here if you want to understand the bundle shape before reading the full spec.

A Perspective Room bundle has a human-readable room and agent-readable artifacts that describe the same fundraising context.

## Minimal Room

`examples/minimal/` is the smallest valid Perspective Room.

Use it to see the required files and required `room.json` fields:

- `index.html`
- `room.json`
- `agent.md`
- `materials.json`

This example is useful for conformance checks, parser tests, and first integrations.

## Full Seed Room

`examples/full-seed-room/` is a more realistic AI-native fundraising bundle for a fictional seed-stage company.

Read it in this order:

1. Open `index.html` as the human room.
2. Read `room.json` as the canonical structured source.
3. Read `agent.md` as the text-first agent handoff.
4. Inspect `materials.json` to see included versus gated materials.
5. Open files in `materials/` only when `included_in_bundle` is true.

This example demonstrates:

- founder-authored narrative
- claim status
- source-linked claims
- `needs_source` claims
- included materials
- gated materials
- version and currentness fields
- bundle mode semantics

## Validation

From the repo root:

```bash
npm run validate:examples
```

To render a bundle from an example room:

```bash
npm run build
node --input-type=module -e "
import { readFileSync } from 'node:fs'
import { buildRoomBundle } from './dist/index.js'

const room = JSON.parse(readFileSync('examples/full-seed-room/room.json', 'utf8'))
const bundle = buildRoomBundle(room)

for (const file of bundle.files) {
  console.log(file.path)
}
"
```

Expected output:

```text
room.json
materials.json
agent.md
index.html
```

## Example Data

All company names, claims, materials, and metrics in these examples are fictional.
