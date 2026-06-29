# Agent-Readiness Evals

These fixtures describe expected agent behavior for Perspective Room bundles.

They are deterministic review cases, not live model calls. The goal is to preserve the standard's core promise: agents should carry claim status, source links, missing context, and access limits into downstream summaries.

Each case includes:

- a prompt
- an input room
- required behaviors
- forbidden behaviors

Use these cases when evaluating agent integrations that consume `room.json` or `agent.md`.
