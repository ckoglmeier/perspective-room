---
name: fundraising-room-packager
description: >
  Turn messy founder fundraising materials into an investor-ready fundraising room or Perspective Room package. Use when asked to package a deck, memo, financial model, FAQ, proof docs, diligence materials, claims, and source files into room.json, agent.md, index.html, materials.json, a data-room summary, or a structured investor handoff.
---

# Fundraising Room Packager

## Overview

Use this skill to convert founder materials into a clean fundraising room that is readable by humans and agents. The output should preserve narrative control, source traceability, access boundaries, and claim status without pretending the room is a substitute for investor diligence.

## Workflow

1. **Inventory materials**
   - Identify deck, memo, model, product docs, customer proof, benchmark/eval evidence, contracts, screenshots, press, and existing FAQs.
   - Separate source files from derived summaries.
   - Mark private/gated files as external references rather than embedding them in public bundles.

2. **Extract the room spine**
   - Company one-liner.
   - Fundraising status and round details.
   - Why now.
   - Customer/problem proof.
   - Product and workflow.
   - Business model.
   - Traction.
   - Team.
   - Risks and context boundaries.

3. **Build the claim map**
   - For every important claim, capture source, status, confidence, date, and caveat.
   - Use `fundraising-claim-auditor` for high-stakes traction, benchmark, market, or AI capability claims when available.

4. **Package for two readers**
   - Human reader: concise room summary or `index.html` text with clear sections and no hidden assumptions.
   - Agent reader: `agent.md` plus structured fields such as `room.json` and `materials.json`.

5. **Define access and freshness**
   - Mark included files, external files, gated files, stale files, and missing files.
   - Do not imply revocation, viewer tracking, confidentiality, or permission controls for a static bundle.

6. **Verify**
   - Check that every material reference resolves.
   - Check that every strong claim has a source or is explicitly marked with the correct trust status.
   - Check that round terms, metrics, dates, and company description match across outputs.

## Output Shape

When creating a room package, produce:

- `room.json` or equivalent structured room summary.
- `agent.md` handoff for agent workflows.
- `materials.json` manifest.
- Human-readable room summary or `index.html` copy.
- Missing materials and external-access list.
- Claim/source ledger.

If editing an existing room, return changed surfaces plus unresolved drift.
