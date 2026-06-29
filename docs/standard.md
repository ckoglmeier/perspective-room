# Perspective Room Standard v0.1

Perspective Rooms exist because fundraising is becoming agent-mediated.

Investors still make the decision. But the work around the first read is changing: parsing decks, extracting claims, routing opportunities, preparing memos, updating CRMs, and generating diligence questions.

Perspective Room Standard gives founders a way to define the agent-readable version of the company before investor-side software does it for them. A room packages the company story, source materials, claims, trust status, and open questions in one portable fundraising bundle.

## Design Principles

1. The founder controls the package. The room records the current story, current materials, and missing context.
2. The agent view and browser view must agree. `room.json`, `agent.md`, and `index.html` are different access paths into the same room.
3. Trust state must travel with the claim. Downstream tools should preserve whether a claim is `draft`, `founder_approved`, `needs_source`, `source_linked`, or `outdated`.
4. Static hosting should be honest about its limits. A self-hosted room is portable, but not permissioned.

## Required Files

```text
index.html
room.json
agent.md
materials.json
```

`room.json` is canonical. It is the structured artifact an investor-side agent, CRM, parser, or memo workflow should ingest first. `agent.md` is a convenience artifact for text-first workflows. `index.html` is the founder and investor reading experience. `materials.json` lets external tools inspect the material list without parsing the full room object.

`materials/` is optional. Only include files that are safe to distribute to anyone with room access.

## How Investors Should Consume A Room

Read the human room first. Use it to understand the company, round, current materials, team, and the claims the founder is asking you to evaluate.

Then inspect `room.json` or `agent.md` if you are using an internal agent, CRM workflow, or memo system. Preserve `authored_by`, `status`, and `sources` fields in downstream summaries. Do not flatten `needs_source` and `source_linked` into the same confidence level.

Recommended ingestion behavior:

- Store `room_id`, `schema_version`, `bundle_mode`, `created_at`, and `updated_at` with the imported room.
- Keep source material IDs attached to claims, even if your internal memo only quotes the claim text.
- Represent `needs_source` as a diligence follow-up, not as a negative conclusion by itself.
- Respect `sensitive`, `external_access_required`, and `included_in_bundle` before redistributing files internally.
- Cite `room.json` as the source of structured fields and cite material IDs for underlying evidence.

## How Agents Should Consume A Room

Prefer `room.json` for structured ingestion. Use `agent.md` for text-first workflows and context windows. Respect `sensitive`, `external_access_required`, and `included_in_bundle` flags. If a material is metadata-only, ask for access or a summary instead of assuming the source file is available.

Agents should treat the room as founder-provided context. They can summarize, compare, draft questions, and map materials to diligence topics. They should not convert the room into an investment recommendation unless the downstream investor has explicitly asked for that analysis and supplied their own decision criteria.

Minimum agent instructions:

- Identify the company, round, primary ask, materials, claims, and missing context.
- Preserve all trust fields in summaries.
- Flag `needs_source`, `outdated`, or missing materials as follow-up items.
- Do not infer that absence of a material means the company lacks that fact.
- Do not claim gated files were reviewed when only metadata was available.

## How Founders Should Self-Host

A founder can unzip the bundle and upload it to any static host. Useful targets include GitHub Pages, S3, Cloudflare Pages, Netlify, Vercel, or a private file server.

Before publishing, founders should check:

- `index.html` opens directly and links to `room.json`, `agent.md`, and `materials.json`.
- `room.json` validates against `perspective_room.v1.schema.json`.
- `agent.md` contains the same claims and missing context as the human page.
- Every included file under `materials/` is safe for anyone with the room URL to access.
- Every private or gated file is marked `external_access_required` and omitted from `materials/`.

## Access Model

A static bundle is portable. It is not permissioned.

Static bundles can be hosted on GitHub Pages, S3, Netlify, Vercel, Cloudflare Pages, or a local file server. Included files are accessible to anyone with the ZIP or hosted bundle. If a file requires identity capture, NDA, approval, revocation, or viewer tracking, leave it out of `materials/` and mark it `external_access_required`.

## Bundle Modes

`metadata_only` includes the AI-native fundraising artifacts and material metadata but no source files. Use it when the founder wants agent-readable context without redistributing sensitive documents.

`public` includes source materials in `materials/`. Use it only when every included file is safe to distribute.

`hybrid` includes public-safe materials and marks gated materials as externally required. Use it when the room should be useful immediately while still preserving private-file boundaries.

## Package Boundary

The package defines:

- Types and schema for `perspective_room.v1`.
- Validation helpers.
- Renderers for `index.html`, `agent.md`, and `materials.json`.
- Minimal and full seed-room examples.
- Agent-readiness eval fixtures.
- Public documentation for consuming and self-hosting bundles.
