---
name: investor-update-writer
description: >
  Draft concise investor updates from startup traction notes, fundraising-room changes, metrics, asks, risks, wins, losses, and unresolved follow-ups. Use for monthly investor updates, fundraising follow-ups, room-change summaries, stakeholder notes, advisor updates, or converting messy company progress into a credible investor-facing email.
---

# Investor Update Writer

## Overview

Use this skill to write investor updates that are clear, credible, and useful. The update should help investors understand what changed, where help is needed, and what evidence supports the story.

## Workflow

1. **Collect update inputs**
   - Reporting period.
   - Metrics and deltas.
   - Product/company progress.
   - Customer, revenue, pipeline, or usage updates.
   - Fundraising room changes.
   - Risks, misses, and unresolved follow-ups.
   - Specific asks.

2. **Build the update spine**
   - Short opening.
   - Highlights.
   - Metrics.
   - What changed.
   - Asks.
   - Risks or unresolved follow-ups.
   - Link to updated room or materials when relevant.

3. **Calibrate tone**
   - Be direct and concrete.
   - Do not over-polish bad news.
   - Separate facts from interpretation.
   - Avoid vague momentum language unless paired with evidence.

4. **Use the room**
   - If a Perspective Room or data room exists, summarize meaningful changes since the last update.
   - Name new materials, retired stale materials, updated claims, and unresolved follow-ups.

5. **Verify claims**
   - Check numbers, dates, customer names, and funding language.
   - Use `fundraising-claim-auditor` when a sentence feels like it is doing too much.

## Output Shape

Return:

- Subject line options.
- Polished update.
- Optional shorter version.
- Asks extracted as bullets.
- Claims or numbers that need confirmation.

Keep the main update skimmable. If it cannot be read quickly, it is not an investor update.
