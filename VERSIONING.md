# Versioning

Perspective Room Standard uses schema versions and package versions separately.

## Schema Versions

The current schema version is `perspective_room.v1`.

Additive changes can stay within `perspective_room.v1` when older consumers can safely ignore the new field.

Breaking changes require a new schema version.

Breaking changes include:

- Renaming or removing existing fields
- Changing the meaning of an existing trust status
- Making an optional field required
- Changing bundle file names or their expected roles
- Changing values for `bundle_mode`, `authored_by`, or `status`

## Package Versions

Package versions follow semver:

- Patch: docs, examples, validation bug fixes, or renderer fixes that preserve behavior
- Minor: additive schema fields, new helpers, new examples, or new warnings
- Major: new schema version or breaking package API changes
