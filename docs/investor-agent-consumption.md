# Investor And Agent Consumption Guide

Perspective Room is an AI-native fundraising bundle. It gives investors a human-readable room and an agent-readable package from the same underlying data.

## Recommended Investor Flow

1. Read `index.html` for the founder-facing room.
2. Ingest `room.json` into internal tooling, CRM workflows, memo systems, or agent workflows.
3. Use `agent.md` when the tool works better with Markdown or a single context document.
4. Preserve trust and access fields in downstream summaries.

## Fields To Preserve

Downstream systems should preserve these fields rather than flattening the room into unqualified prose:

- `authored_by`
- `status`
- `sources`
- `sensitive`
- `external_access_required`
- `included_in_bundle`
- `bundle_mode`

These fields are part of the standard. They are how the room tells an investor or agent what can be relied on, what needs a source, and what requires separate access.

## Trust Status

Do not treat all claims as having the same confidence level.

`source_linked` means the claim includes source references.

`needs_source` means the claim is useful founder-provided context, but still needs support before it should be repeated as evidence.

`outdated` means the claim may explain history, but should not be used as the current state without confirmation.

`founder_approved` means the founder has approved the statement, but it does not necessarily mean source files were reviewed.

`draft` means the statement is not ready to be relied on externally.

## Material Access

Do not claim a material was reviewed when it is only listed in metadata.

If `external_access_required` is true or `included_in_bundle` is false, the consuming system should say that the material exists but was not available in the portable bundle.

If `sensitive` is true, do not redistribute the material without the founder's explicit permission.

## Agent Instructions

Agents consuming a room should:

- identify the company, round context, materials, claims, access boundaries, and version signals
- preserve trust fields in summaries
- cite material IDs when using sourced claims
- preserve `needs_source`, `outdated`, and gated-material status without turning them into diligence conclusions
- ask for access when a material is gated
- avoid turning the room into an investment recommendation without investor criteria

Agents should not:

- flatten `needs_source` into `source_linked`
- assume omitted materials do not exist
- imply that gated files were reviewed
- convert founder context into a diligence conclusion without additional analysis

## CRM And Memo Systems

When importing a room, store the room metadata alongside any generated summaries:

- `room_id`
- `schema_version`
- `bundle_mode`
- `created_at`
- `updated_at`

Keep claim IDs and material IDs attached to generated notes. This makes later diligence easier because the investor can trace a memo paragraph back to a room claim and, when available, a supporting material.
