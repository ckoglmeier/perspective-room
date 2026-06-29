# Maintainer Integration Guide

This repository should remain the public source of truth for the Perspective Room standard.

Products that generate Perspective Rooms should treat this package as the contract layer: schema, types, validation, rendering expectations, examples, and agent-readiness evals.

## Integration Principles

- Generate `room.json` from product data, then validate it before export.
- Build `agent.md`, `index.html`, and `materials.json` from the same room object.
- Keep source material access decisions explicit in `materials`.
- Do not add product-only fields unless they are namespaced or proposed for the standard.
- Keep founder-facing edits and generated artifacts in sync before sharing a room.

## Drift Checks

Before releasing product changes that affect room exports:

1. Run the package test suite.
2. Validate generated room examples against `perspective_room.v1`.
3. Compare generated `agent.md` and `index.html` against the same room object.
4. Confirm `needs_source`, `source_linked`, `outdated`, and gated-material fields survive export.
5. Confirm sensitive files are not bundled unless the founder explicitly selected a public-safe bundle.

## Standard Change Flow

Use GitHub issues for proposed standard changes:

1. Describe the founder or investor workflow that needs the change.
2. Add a concrete JSON example.
3. Explain how existing consumers should behave if the field is absent.
4. Add or update an example room.
5. Add or update an agent-readiness eval if the behavior affects downstream agents.

## Compatibility

Minor versions can add optional fields, examples, docs, and validation warnings.

Major versions are required for breaking schema changes, renamed fields, changed trust semantics, or changed bundle-file requirements.
