import {
  PERSPECTIVE_ROOM_SCHEMA_VERSION,
  type PerspectiveRoom,
  type RoomAuthor,
  type RoomBundleMode,
  type RoomTrustStatus,
  type RoomValidationResult,
} from './types.js'

const AUTHORS = new Set<RoomAuthor>(['founder', 'perspective', 'third_party', 'unknown'])
const BUNDLE_MODES = new Set<RoomBundleMode>(['public', 'metadata_only', 'hybrid'])
const STATUSES = new Set<RoomTrustStatus>([
  'draft',
  'founder_approved',
  'needs_source',
  'source_linked',
  'outdated',
])

export function validatePerspectiveRoom(value: unknown): RoomValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  if (!isRecord(value)) {
    return { ok: false, errors: ['room must be an object'], warnings }
  }

  if (value.schema_version !== PERSPECTIVE_ROOM_SCHEMA_VERSION) {
    errors.push(`schema_version must be ${PERSPECTIVE_ROOM_SCHEMA_VERSION}`)
  }
  if (!nonEmpty(value.room_id)) errors.push('room_id is required')
  if (!nonEmpty(value.title)) errors.push('title is required')
  if (value.bundle_mode && !BUNDLE_MODES.has(value.bundle_mode as RoomBundleMode)) {
    errors.push(`bundle_mode has invalid value ${value.bundle_mode}`)
  }

  const room = value as PerspectiveRoom
  validateTrustBlock('narrative', room.narrative, errors, warnings)

  for (const [index, claim] of (room.claims ?? []).entries()) {
    const path = `claims[${index}]`
    if (!nonEmpty(claim.claim)) errors.push(`${path}.claim is required`)
    validateTrustBlock(path, claim, errors, warnings)
    if (claim.status === 'source_linked' && !hasSources(claim.sources)) {
      warnings.push(`${path} is source_linked but has no sources`)
    }
    if (claim.status === 'founder_approved' && claim.authored_by !== 'founder') {
      warnings.push(`${path} is founder_approved but authored_by is not founder`)
    }
  }

  const materialIds = new Set<string>()
  for (const [index, material] of (room.materials ?? []).entries()) {
    const path = `materials[${index}]`
    if (!nonEmpty(material.id)) errors.push(`${path}.id is required`)
    if (!nonEmpty(material.display_name)) errors.push(`${path}.display_name is required`)
    if (material.id) materialIds.add(material.id)
    if (material.sensitive && material.included_in_bundle) {
      warnings.push(`${path} is sensitive but included_in_bundle is true`)
    }
    if (material.included_in_bundle && !material.local_path && !material.download_url) {
      warnings.push(`${path} is included but has no local_path or download_url`)
    }
    if (material.is_current_version === false && material.status !== 'outdated') {
      warnings.push(`${path} is a prior version but status is not outdated`)
    }
  }

  for (const [index, claim] of (room.claims ?? []).entries()) {
    for (const source of claim.sources ?? []) {
      if (source.material_id && !materialIds.has(source.material_id)) {
        warnings.push(`claims[${index}] references missing material ${source.material_id}`)
      }
    }
  }

  return { ok: errors.length === 0, errors, warnings }
}

function validateTrustBlock(
  path: string,
  value: { authored_by?: string; status?: string } | undefined,
  errors: string[],
  warnings: string[],
) {
  if (!value) return
  if (value.authored_by && !AUTHORS.has(value.authored_by as RoomAuthor)) {
    errors.push(`${path}.authored_by has invalid value ${value.authored_by}`)
  }
  if (value.status && !STATUSES.has(value.status as RoomTrustStatus)) {
    errors.push(`${path}.status has invalid value ${value.status}`)
  }
  if (!value.authored_by && value.status) warnings.push(`${path} has status but no authored_by`)
}

function hasSources(value: unknown) {
  return Array.isArray(value) && value.length > 0
}

function nonEmpty(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
