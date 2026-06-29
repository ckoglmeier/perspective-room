# Agent-Readiness Evals

These fixtures describe expected agent behavior for Perspective Room bundles.

They are deterministic review cases, not live model calls. The goal is to preserve the standard's core promise: agents should carry claim status, source links, access boundaries, and version signals into downstream summaries.

Each case includes:

- a prompt
- an input room
- required behaviors
- forbidden behaviors

Use these cases when evaluating agent integrations that consume `room.json` or `agent.md`.

Current cases:

- `preserve-claim-status`: summaries must carry trust status and source references.
- `gated-materials`: agents must distinguish bundled files from access-required materials.
- `do-not-flatten-trust-status`: memo summaries must not flatten `needs_source`, `source_linked`, and `outdated` into the same confidence level.
