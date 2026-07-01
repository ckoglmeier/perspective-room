# Founder Self-Hosting Guide

Perspective Room bundles are designed to be hosted anywhere static files can be served.

The room has two audiences:

- humans, who read `index.html`
- agents and investor systems, which ingest `room.json` or `agent.md`

## Minimum Bundle

The minimum useful hosted room contains:

```text
index.html
room.json
agent.md
materials.json
```

`index.html` is the human-readable room.

`room.json` is the canonical structured room.

`agent.md` is the text-first handoff for agent workflows.

`materials.json` is the material manifest.

## Optional Materials Folder

Use `materials/` only for files that are safe to distribute to anyone with access to the hosted room or ZIP.

```text
materials/
  seed-deck.pdf
  pilot-summary.pdf
```

When materials are included, link to them from `index.html` and list them in `materials.json`. The hosted folder is the room: the human page, the agent-readable files, the manifest, and any included source files.

If a material requires approval, an NDA, identity capture, revocation, or viewer tracking, do not include the file in `materials/`. List it in `materials.json` and set:

```json
{
  "external_access_required": true,
  "included_in_bundle": false,
  "sensitive": true
}
```

## Hosting Options

Any static host works. Common options include GitHub Pages, S3, Cloudflare Pages, Netlify, Vercel, or a file server controlled by the founder.

Before sharing a hosted room:

- Open `index.html` and confirm the page renders.
- Click the links to `room.json`, `agent.md`, and `materials.json`.
- Validate `room.json` against `perspective_room.v1.schema.json`.
- Confirm every included file is safe for anyone with the room URL to access.
- Confirm every gated file is omitted from `materials/` and marked `external_access_required`.
- Confirm `agent.md` and `index.html` tell the same story as `room.json`.

## Access Model

A static Perspective Room is portable. It is not permissioned.

Anyone who can access the hosted room can access any bundled source files. Use `metadata_only` or `hybrid` mode when you want the room to remain useful without redistributing sensitive materials.

## Recommended Founder Workflow

1. Package the current room.
2. Review `index.html` as the investor-facing room.
3. Review `room.json` and `agent.md` as the AI-native room.
4. Remove or gate anything that should not travel with the bundle.
5. Host the files.
6. Share the room URL with investors.
7. Replace the hosted bundle when the story, claims, or materials change.
