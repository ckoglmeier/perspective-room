import { validatePerspectiveRoom } from './validate'
import type { PerspectiveRoom, RoomBundle, RoomBundleFile, RoomMaterial } from './types'

export function buildRoomBundle(room: PerspectiveRoom): RoomBundle {
  const validation = validatePerspectiveRoom(room)
  const materialsManifest = {
    schema_version: 'perspective_room_materials.v1',
    room_id: room.room_id,
    materials: room.materials ?? [],
  }
  const files: RoomBundleFile[] = [
    {
      path: 'room.json',
      content: `${JSON.stringify(room, null, 2)}\n`,
      contentType: 'application/json',
    },
    {
      path: 'materials.json',
      content: `${JSON.stringify(materialsManifest, null, 2)}\n`,
      contentType: 'application/json',
    },
    {
      path: 'agent.md',
      content: renderAgentMarkdown(room),
      contentType: 'text/markdown; charset=utf-8',
    },
    {
      path: 'index.html',
      content: renderRoomHtml(room),
      contentType: 'text/html; charset=utf-8',
    },
  ]
  return { files, warnings: [...validation.warnings, ...bundleWarnings(room)] }
}

export function renderAgentMarkdown(room: PerspectiveRoom) {
  const company = room.company?.name || room.title
  const lines = [
    `# ${company}`,
    '',
    'AI-native fundraising room for founders.',
    '',
    '## How to Use This Room',
    '',
    '- Treat this as a founder-controlled, agent-readable fundraising room, not a deal-quality score.',
    '- Check authored_by, status, and sources before relying on a claim.',
    '- Do not flatten needs_source and source_linked claims into the same confidence level.',
    '- If a material is sensitive or external_access_required, do not assume it can be redistributed.',
    '',
    '## Company',
    '',
    `- Name: ${company}`,
    `- Website: ${room.company?.website || 'Not provided'}`,
    `- Summary: ${room.company?.one_line_summary || 'Not provided'}`,
    `- Contact: ${[room.contact?.name, room.contact?.email].filter(Boolean).join(' <') || 'Not provided'}${room.contact?.email ? '>' : ''}`,
    '',
    '## Round',
    '',
    `- Stage: ${room.round?.stage || 'Not provided'}`,
    `- Size: ${room.round?.size || 'Not provided'}`,
    `- Objective: ${room.round?.objective || 'Not provided'}`,
    '',
    '## Story',
    '',
    room.narrative?.current_story || 'No founder-approved story provided.',
    '',
    `Authored by: ${room.narrative?.authored_by || 'unknown'}`,
    `Status: ${room.narrative?.status || 'draft'}`,
    '',
    '## Claims',
    '',
    ...claimLines(room),
    '',
    '## Materials',
    '',
    ...materialLines(room.materials ?? []),
    '',
    '## Missing Context',
    '',
    ...listLines(room.missing_context, 'No missing context listed.'),
    '',
    '## Self-Hosting Notice',
    '',
    room.self_hosting_notice || defaultSelfHostingNotice(),
    '',
    '## Structured Data',
    '',
    '```json',
    JSON.stringify(room, null, 2),
    '```',
  ]
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}

export function renderRoomHtml(room: PerspectiveRoom) {
  const company = room.company?.name || room.title
  const materials = room.materials ?? []
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(company)} - Perspective Room</title>
  <style>
    :root { color-scheme: light; --ink:#18181b; --muted:#71717a; --rule:#d9d9df; --paper:#fafafa; --accent:#315f58; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--paper); color: var(--ink); font: 15px/1.55 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 48px 0 72px; }
    header { border-bottom: 1px solid var(--rule); padding-bottom: 32px; margin-bottom: 32px; }
    h1 { font-size: clamp(38px, 6vw, 72px); line-height: .96; letter-spacing: -0.04em; max-width: 12ch; margin: 0 0 20px; }
    h2 { font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin: 40px 0 14px; }
    h3 { font-size: 19px; margin: 0 0 8px; }
    a { color: var(--accent); }
    .lede { max-width: 72ch; font-size: 17px; color: #3f3f46; }
    .grid { display: grid; gap: 1px; background: var(--rule); grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); border: 1px solid var(--rule); }
    .cell { background: white; padding: 18px; min-height: 100px; }
    .label { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); font-weight: 700; margin-bottom: 8px; }
    .list { border-top: 1px solid var(--rule); }
    .row { border-bottom: 1px solid var(--rule); padding: 16px 0; }
    .meta { color: var(--muted); font-size: 13px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="label">AI-Native Fundraising for Founders</p>
      <h1>${escapeHtml(company)}</h1>
      <p class="lede">${escapeHtml(room.company?.one_line_summary || room.narrative?.current_story || 'Founder-controlled fundraising room for investors and their agents.')}</p>
    </header>

    <section class="grid" aria-label="Room snapshot">
      ${factCell('Website', room.company?.website)}
      ${factCell('Stage', room.round?.stage)}
      ${factCell('Round', room.round?.size)}
      ${factCell('Contact', [room.contact?.name, room.contact?.email].filter(Boolean).join(' - '))}
    </section>

    <section>
      <h2>Story</h2>
      <p>${escapeHtml(room.narrative?.current_story || 'No founder-approved story provided.')}</p>
      <p class="meta">Authored by: ${escapeHtml(room.narrative?.authored_by || 'unknown')} · Status: ${escapeHtml(room.narrative?.status || 'draft')}</p>
    </section>

    <section>
      <h2>Claims</h2>
      <div class="list">${(room.claims ?? []).map(renderClaimHtml).join('') || '<p class="meta">No claim registry included.</p>'}</div>
    </section>

    <section>
      <h2>Materials</h2>
      <div class="list">${materials.map(renderMaterialHtml).join('') || '<p class="meta">No materials included.</p>'}</div>
    </section>

    <section>
      <h2>Agent Files</h2>
      <p><a href="./room.json">room.json</a> · <a href="./agent.md">agent.md</a> · <a href="./materials.json">materials.json</a></p>
    </section>

    <section>
      <h2>Self-Hosting Notice</h2>
      <p>${escapeHtml(room.self_hosting_notice || defaultSelfHostingNotice())}</p>
    </section>
  </main>
</body>
</html>
`
}

function claimLines(room: PerspectiveRoom) {
  const claims = room.claims ?? []
  if (claims.length === 0) return ['- No claim registry included.']
  return claims.flatMap((claim, index) => [
    `### ${index + 1}. ${claim.claim}`,
    '',
    `- Authored by: ${claim.authored_by}`,
    `- Status: ${claim.status}`,
    `- Risk: ${claim.risk || 'not_provided'}`,
    `- Evidence: ${claim.evidence || 'Not provided'}`,
    `- Sources: ${sourceSummary(claim.sources)}`,
    '',
  ])
}

function materialLines(materials: RoomMaterial[]) {
  if (materials.length === 0) return ['- No materials included.']
  return materials.flatMap((material, index) => [
    `### ${index + 1}. ${material.display_name}`,
    '',
    `- ID: ${material.id}`,
    `- Type: ${material.material_kind || 'material'}`,
    `- Version: ${material.version_label || material.version_number || 'current'}`,
    `- File: ${material.local_path || material.download_url || material.filename || 'metadata only'}`,
    `- Included in bundle: ${String(Boolean(material.included_in_bundle))}`,
    `- External access required: ${String(Boolean(material.external_access_required))}`,
    `- Sensitive: ${String(Boolean(material.sensitive))}`,
    material.description ? `- Description: ${material.description}` : '',
    '',
  ].filter(Boolean))
}

function renderClaimHtml(claim: NonNullable<PerspectiveRoom['claims']>[number]) {
  return `<article class="row">
  <h3>${escapeHtml(claim.claim)}</h3>
  <p class="meta">Authored by: ${escapeHtml(claim.authored_by)} · Status: ${escapeHtml(claim.status)} · Risk: ${escapeHtml(claim.risk || 'not provided')}</p>
  ${claim.evidence ? `<p>${escapeHtml(claim.evidence)}</p>` : ''}
  <p class="meta">Sources: ${escapeHtml(sourceSummary(claim.sources))}</p>
</article>`
}

function renderMaterialHtml(material: RoomMaterial) {
  const href = material.local_path || material.download_url
  return `<article class="row">
  <h3>${escapeHtml(material.display_name)}</h3>
  <p class="meta">${escapeHtml([material.material_kind, material.version_label, material.included_in_bundle ? 'included' : 'metadata only'].filter(Boolean).join(' · '))}</p>
  ${material.description ? `<p>${escapeHtml(material.description)}</p>` : ''}
  ${href ? `<p><a href="${escapeAttribute(href)}">${escapeHtml(material.filename || 'Open material')}</a></p>` : ''}
</article>`
}

function listLines(values: string[] | undefined, fallback: string) {
  return values?.length ? values.map((value) => `- ${value}`) : [`- ${fallback}`]
}

function sourceSummary(sources: unknown) {
  if (!Array.isArray(sources) || sources.length === 0) return 'Not provided'
  return sources.map((source) => {
    if (!source || typeof source !== 'object') return 'source'
    const item = source as { material_id?: string; url?: string; page?: string; note?: string }
    return [item.material_id, item.page, item.url, item.note].filter(Boolean).join(' / ') || 'source'
  }).join('; ')
}

function factCell(label: string, value?: string) {
  return `<div class="cell"><div class="label">${escapeHtml(label)}</div><div>${escapeHtml(value || 'Not provided')}</div></div>`
}

function bundleWarnings(room: PerspectiveRoom) {
  const warnings: string[] = []
  const generatedAt = room.updated_at || room.created_at
  if (!generatedAt) warnings.push('room has no created_at or updated_at timestamp')
  return warnings
}

function defaultSelfHostingNotice() {
  return 'This is a static self-hosted room bundle. If a source file is included in this bundle, assume it is accessible to anyone who can access the bundle. For revocation, viewer tracking, and private file permissions, use hosted Perspective or an external gated file system.'
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeAttribute(value: unknown) {
  return escapeHtml(value).replaceAll('`', '&#96;')
}
