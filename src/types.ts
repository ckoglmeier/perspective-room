export const PERSPECTIVE_ROOM_SCHEMA_VERSION = 'perspective_room.v1' as const

export type RoomBundleMode = 'public' | 'metadata_only' | 'hybrid'

export type RoomAuthor = 'founder' | 'perspective' | 'third_party' | 'unknown'

export type RoomTrustStatus =
  | 'draft'
  | 'founder_approved'
  | 'needs_source'
  | 'source_linked'
  | 'outdated'

export type RoomSourceReference = {
  material_id?: string
  url?: string
  page?: string
  excerpt?: string
  note?: string
}

export type RoomTrustState = {
  authored_by: RoomAuthor
  status: RoomTrustStatus
  sources?: RoomSourceReference[]
}

export type RoomClaim = RoomTrustState & {
  id?: string
  claim: string
  risk?: 'low' | 'medium' | 'high'
  evidence?: string
}

export type RoomMaterial = {
  id: string
  display_name: string
  filename?: string
  material_kind?: string
  description?: string
  folder_name?: string
  content_type?: string
  size_bytes?: number
  version_label?: string
  version_number?: number
  is_current_version?: boolean
  extraction_status?: string
  authored_by?: RoomAuthor
  status?: RoomTrustStatus
  sources?: RoomSourceReference[]
  included_in_bundle?: boolean
  listed_in_manifest?: boolean
  local_path?: string
  download_url?: string
  external_access_required?: boolean
  sensitive?: boolean
}

export type RoomFounder = {
  id?: string
  name: string
  title?: string
  email?: string
  linkedin_url?: string
  short_bio?: string
  founder_market_fit?: string
}

export type PerspectiveRoom = {
  schema_version: typeof PERSPECTIVE_ROOM_SCHEMA_VERSION
  room_id: string
  title: string
  bundle_mode?: RoomBundleMode
  created_at?: string
  updated_at?: string
  company?: {
    name?: string
    website?: string
    one_line_summary?: string
  }
  contact?: {
    name?: string
    email?: string
  }
  round?: {
    stage?: string
    size?: string
    objective?: string
  }
  narrative?: RoomTrustState & {
    current_story?: string
    primary_ask?: string
  }
  claims?: RoomClaim[]
  materials?: RoomMaterial[]
  founders?: RoomFounder[]
  links?: {
    human_url?: string
    agent_url?: string
    agent_markdown_url?: string
    canonical_json_url?: string
  }
  self_hosting_notice?: string
}

export type RoomBundleFile = {
  path: string
  content: string
  contentType: string
}

export type RoomBundle = {
  files: RoomBundleFile[]
  warnings: string[]
}

export type RoomValidationResult = {
  ok: boolean
  errors: string[]
  warnings: string[]
}
