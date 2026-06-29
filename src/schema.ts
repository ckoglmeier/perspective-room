import { PERSPECTIVE_ROOM_SCHEMA_VERSION } from './types'

export const perspectiveRoomSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://perspectiveapp.io/standards/perspective_room.v1.schema.json',
  title: 'Perspective Room',
  description: 'Founder-controlled, self-hostable room for AI-native fundraising for founders.',
  type: 'object',
  required: ['schema_version', 'room_id', 'title'],
  additionalProperties: true,
  properties: {
    schema_version: { const: PERSPECTIVE_ROOM_SCHEMA_VERSION },
    room_id: { type: 'string', minLength: 1 },
    title: { type: 'string', minLength: 1 },
    bundle_mode: { enum: ['public', 'metadata_only', 'hybrid'] },
    company: {
      type: 'object',
      additionalProperties: true,
      properties: {
        name: { type: 'string' },
        website: { type: 'string' },
        one_line_summary: { type: 'string' },
      },
    },
    narrative: { $ref: '#/$defs/trustBlock' },
    claims: {
      type: 'array',
      items: {
        allOf: [
          { $ref: '#/$defs/trustBlock' },
          {
            type: 'object',
            required: ['claim'],
            properties: {
              claim: { type: 'string', minLength: 1 },
              risk: { enum: ['low', 'medium', 'high'] },
              evidence: { type: 'string' },
            },
          },
        ],
      },
    },
    materials: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'display_name'],
        additionalProperties: true,
        properties: {
          id: { type: 'string', minLength: 1 },
          display_name: { type: 'string', minLength: 1 },
          filename: { type: 'string' },
          included_in_bundle: { type: 'boolean' },
          listed_in_manifest: { type: 'boolean' },
          local_path: { type: 'string' },
          download_url: { type: 'string' },
          external_access_required: { type: 'boolean' },
          sensitive: { type: 'boolean' },
        },
      },
    },
  },
  $defs: {
    source: {
      type: 'object',
      additionalProperties: false,
      properties: {
        material_id: { type: 'string' },
        url: { type: 'string' },
        page: { type: 'string' },
        excerpt: { type: 'string' },
        note: { type: 'string' },
      },
    },
    trustBlock: {
      type: 'object',
      additionalProperties: true,
      properties: {
        authored_by: { enum: ['founder', 'perspective', 'third_party', 'unknown'] },
        status: { enum: ['draft', 'founder_approved', 'needs_source', 'source_linked', 'outdated'] },
        sources: {
          type: 'array',
          items: { $ref: '#/$defs/source' },
        },
      },
    },
  },
} as const
