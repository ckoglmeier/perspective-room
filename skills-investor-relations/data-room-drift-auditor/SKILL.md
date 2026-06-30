---
name: data-room-drift-auditor
description: >
  Audit an investor data room, Perspective Room, fundraising room export, or agent-readable room package for drift against source materials. Use when checking stale metrics, stale round terms, unsupported claims, missing source links, broken material references, access-boundary issues, public/private boundary issues, or inconsistencies between room.json, agent.md, index.html, materials.json, deck, memo, model, and proof docs.
---

# Data Room Drift Auditor

## Overview

Use this skill to keep investor rooms current and source-backed. A room drifts when its packaged story no longer matches the underlying deck, model, proof docs, source files, or company reality.

## Audit Workflow

1. **Identify source-of-truth artifacts**
   - Room export: `room.json`, `agent.md`, `index.html`, `materials.json`, and included materials.
   - Sources: deck, memo, model, customer proof, benchmark docs, FAQ, updates, source notes.

2. **Map surfaces**
   - Narrative.
   - Round terms.
   - Metrics and traction.
   - Customer proof.
   - Market claims.
   - Technical/proof claims.
   - Team.
   - Materials manifest.
   - Claim status and source state.
   - Access and confidentiality language.

3. **Classify drift**
   - `in_sync`: packaged room matches the source.
   - `room_stale`: room has old or superseded content.
   - `source_missing`: room makes a claim without source support.
   - `material_missing`: file/link is referenced but absent or inaccessible.
   - `source_newer`: source has newer evidence not reflected in room.
   - `boundary_risk`: room includes or implies private, gated, confidential, or unsupported material incorrectly.

4. **Prioritize fixes**
   - Highest priority: round terms, financial metrics, named customer proof, legal/access language, broken files.
   - Medium: stale product/category wording, outdated claim status, missing caveats.
   - Low: cosmetic copy mismatch.

5. **Patch or report**
   - If asked to fix, update the smallest set of room files and manifests.
   - If source truth is ambiguous, produce open decisions rather than guessing.

## Output Shape

Return:

- Executive read.
- Drift table by surface.
- Required fixes.
- Founder decisions needed.
- Suggested room refresh order.

If editing files, summarize changed files and verification performed.
