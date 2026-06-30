# Perspective Room Standard v0.1

This document is the normative specification for `perspective_room.v1`.

The standard defines how founder-controlled fundraising context should be packaged for humans and AI systems. It does not define investor diligence, scoring, recommendations, or a private product workflow.

## Required Bundle Files

A conforming bundle must include:

```text
index.html
room.json
agent.md
materials.json
```

`room.json` is canonical.

`index.html` is the human-readable room.

`agent.md` is the text-first agent handoff.

`materials.json` is the material manifest.

`materials/` is optional and must contain only files intentionally included in the portable bundle.

## Required Room Fields

`room.json` must include:

- `schema_version`: must be `perspective_room.v1`
- `room_id`: stable room identifier
- `title`: human-readable room title

## Recommended Room Fields

A useful room should include:

- `bundle_mode`
- `created_at`
- `updated_at`
- `company`
- `contact`
- `round`
- `narrative`
- `claims`
- `materials`
- `self_hosting_notice`

## Bundle Modes

`metadata_only`: include room artifacts and material metadata. Do not include source files.

`public`: include room artifacts and source files that are safe to distribute.

`hybrid`: include public-safe source files and mark private or gated files as `external_access_required`.

## Trust Semantics

Claims and narrative blocks should preserve:

- `authored_by`
- `status`
- `sources`

Allowed `authored_by` values:

- `founder`
- `perspective`
- `third_party`
- `unknown`

Allowed `status` values:

- `draft`
- `founder_approved`
- `needs_source`
- `source_linked`
- `outdated`

`needs_source` means the claim is founder-provided context that should not be repeated as source-backed evidence.

`source_linked` means the claim includes source references.

`outdated` means the claim may explain history but should not be treated as current.

`founder_approved` means the founder approved the statement. It does not mean source files were reviewed.

`draft` means the statement is not ready to rely on externally.

## Material Semantics

Materials should preserve:

- `id`
- `display_name`
- `material_kind`
- `version_label`
- `version_number`
- `is_current_version`
- `included_in_bundle`
- `listed_in_manifest`
- `local_path`
- `download_url`
- `external_access_required`
- `sensitive`

If `external_access_required` is true, consumers must not imply the file was reviewed.

If `sensitive` is true, consumers must not redistribute the material without founder permission.

If `included_in_bundle` is false, the material may exist but is not part of the portable bundle.

## What This Standard Does Not Define

The standard does not define:

- investment recommendations
- investor scoring
- diligence conclusions
- permissioning or revocation
- viewer tracking
- CRM ownership
- legal or financial review
- founder coaching workflows
- product-specific intelligence layers

## Conformance Examples

### Valid Minimal Room

```json
{
  "schema_version": "perspective_room.v1",
  "room_id": "room_minimal",
  "title": "Acme Seed Room"
}
```

### Valid Hybrid Room

```json
{
  "schema_version": "perspective_room.v1",
  "room_id": "room_hybrid",
  "title": "Acme Seed Room",
  "bundle_mode": "hybrid",
  "company": {
    "name": "Acme",
    "one_line_summary": "Acme helps logistics teams reconcile freight invoices."
  },
  "claims": [
    {
      "id": "claim_pilots",
      "claim": "Acme has three paid pilots.",
      "authored_by": "founder",
      "status": "source_linked",
      "sources": [
        {
          "material_id": "pilot-summary",
          "note": "Completed pilot list"
        }
      ]
    }
  ],
  "materials": [
    {
      "id": "pilot-summary",
      "display_name": "Pilot summary",
      "included_in_bundle": true,
      "local_path": "materials/pilot-summary.md",
      "external_access_required": false,
      "sensitive": false
    },
    {
      "id": "financial-model",
      "display_name": "Financial model",
      "included_in_bundle": false,
      "external_access_required": true,
      "sensitive": true
    }
  ]
}
```

### Invalid Or Unsafe Patterns

Do not treat a `needs_source` claim as source-backed evidence.

Do not say a gated material was reviewed when `external_access_required` is true.

Do not include sensitive source files in `materials/` unless the founder explicitly wants them to travel with the bundle.

Do not use the room as an investment recommendation unless a separate investor workflow supplies decision criteria.

Do not assume omitted materials do not exist.

## Compatibility

Consumers should ignore unknown fields.

Producers should not remove or rename fields in `perspective_room.v1`.

Minor versions may add optional fields, examples, docs, validation warnings, or eval fixtures.

Breaking schema changes require a new schema version.
